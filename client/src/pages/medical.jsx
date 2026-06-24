import { useEffect, useState, useMemo, useRef } from "react";
import { Search, MapPin, Navigation, Activity, Clock, Info, X, ChevronRight, ShieldAlert, ExternalLink, ArrowLeft, Compass, Pill } from "lucide-react";
import Header from "../Components/Header";

/* --- LOGIC UTILS --- */
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBoundingBox(lat, lon, radiusKm) {
    const latDelta = radiusKm / 111;
    const lonDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
    return { south: lat - latDelta, north: lat + latDelta, west: lon - lonDelta, east: lon + lonDelta };
}

const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter"
];

async function fetchOverpassFastest(query) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
        const promises = OVERPASS_SERVERS.map(url =>
            fetch(url, {
                method: "POST",
                body: `data=${encodeURIComponent(query)}`,
                signal: controller.signal
            }).then(res => {
                if (!res.ok) throw new Error(`Server ${url} failed`);
                return res.json();
            })
        );
        return await Promise.any(promises);
    } catch (error) {
        if (error.name === 'AbortError') throw new Error("Request timed out.");
        throw new Error("All data sync servers failed.");
    } finally {
        clearTimeout(timeoutId);
    }
}

export default function MedicalStoreCenter() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Initializing...");
    const [error, setError] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [currentArea, setCurrentArea] = useState("Locating...");
    const [userCoords, setUserCoords] = useState(null);
    const [filter247, setFilter247] = useState(false);
    const [sortBy, setSortBy] = useState("distance");
    const [filterDistance, setFilterDistance] = useState(25);
    const [selectedStore, setSelectedStore] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const RADIUS_KM = 25;
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (locationInput.length > 2) {
            debounceTimer.current = setTimeout(async () => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=5`,
                        { headers: { 'User-Agent': 'HealthApp/1.0' } }
                    );
                    const data = await res.json();
                    setSuggestions(data);
                } catch (e) { console.error(e); }
            }, 400);
        } else {
            setSuggestions([]);
        }

        return () => clearTimeout(debounceTimer.current);
    }, [locationInput]);

    useEffect(() => {
        setLoadingText("Acquiring GPS Signal...");
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                initData(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                setError("GPS access denied. Please search manually.");
                setLoading(false);
            },
            { timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    async function initData(lat, lon, forcedAddress = null) {
        setLoading(true);
        setError("");
        setSuggestions([]);
        const targetLat = parseFloat(lat);
        const targetLon = parseFloat(lon);

        try {
            setLoadingText("Establishing Server Connection...");
            const bbox = getBoundingBox(targetLat, targetLon, RADIUS_KM);

            // Changed query targeting "pharmacy" instead of "hospital"
            const query = `[out:json];(node["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center tags;`;

            const geoPromise = forcedAddress ? Promise.resolve({ display_name: forcedAddress }) : fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLon}`,
                { headers: { 'User-Agent': 'HealthApp/1.0' } }
            ).then(res => res.json());

            setLoadingText("Triangulating Medical Retail Grid...");

            const [geoData, overpassData] = await Promise.all([
                geoPromise,
                fetchOverpassFastest(query)
            ]);

            setCurrentArea(geoData.display_name || "Current Location");
            setLoadingText("Processing Store Records...");

            const processed = overpassData.elements.map(el => {
                const sLat = el.lat || el.center?.lat;
                const sLon = el.lon || el.center?.lon;
                return {
                    id: el.id,
                    name: el.tags?.name || "Pharmacy / Medical Store",
                    dist: distanceKm(targetLat, targetLon, sLat, sLon),
                    lat: sLat,
                    lon: sLon,
                    isOpen247: el.tags?.opening_hours === "24/7" || el.tags?.["opening_hours:covid"] === "24/7",
                    dispensing: el.tags?.dispensing === "yes" || el.tags?.["healthcare:pharmacy"] === "dispensing",
                    phone: el.tags?.phone || el.tags?.["contact:phone"] || "N/A",
                    address: el.tags?.["addr:street"] ? `${el.tags["addr:street"]}, ${el.tags["addr:city"] || ""}` : "Verified Medical Supplier"
                };
            }).filter(s => s.dist <= RADIUS_KM);

            setStores(processed);
        } catch (err) {
            setError(err.message || "Failed to sync medical store data.");
        } finally {
            setLoading(false);
        }
    }

    const displayedStores = useMemo(() => {
        let list = stores.filter(s => s.dist <= filterDistance);
        if (filter247) list = list.filter(s => s.isOpen247);
        if (searchQuery.trim()) {
            list = list.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return [...list].sort((a, b) => sortBy === "distance" ? a.dist - b.dist : a.name.localeCompare(b.name));
    }, [stores, filter247, filterDistance, sortBy, searchQuery]);

    const directionUrl = useMemo(() => {
        if (!selectedStore) return "";
        const base = "https://www.google.com/maps/dir/?api=1";
        const dest = `&destination=${selectedStore.lat},${selectedStore.lon}`;
        const origin = userCoords ? `&origin=${userCoords.lat},${userCoords.lon}` : "";
        return `${base}${origin}${dest}`;
    }, [selectedStore, userCoords]);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <div className="flex-1 w-full min-w-0 flex flex-col transition-all duration-300">
                <Header />

                {!selectedStore && (
                    <section className="bg-white border-b border-slate-200 p-3 sm:p-4 sticky top-11 z-30 shadow-sm">
                        <div className="max-w-6xl mx-auto space-y-3">
                            <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                                <div className="flex flex-col sm:flex-row w-full flex-1 gap-2.5">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-cyan-600 transition-colors" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search medical stores..."
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-600 focus:bg-white rounded-md py-2 pl-9 pr-3 outline-none transition-all text-[11px] font-semibold text-slate-900 placeholder-slate-400"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative flex-1 group">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search custom location..."
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-600 focus:bg-white rounded-md py-2 pl-9 pr-3 outline-none transition-all text-[11px] font-semibold text-slate-900 placeholder-slate-400"
                                            value={locationInput}
                                            onChange={(e) => setLocationInput(e.target.value)}
                                        />
                                        {suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl z-[100] overflow-hidden max-h-48 overflow-y-auto">
                                                {suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setLocationInput(s.display_name); initData(s.lat, s.lon, s.display_name); }}
                                                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100 last:border-none transition-colors"
                                                    >
                                                        <MapPin size={12} className="text-slate-400 shrink-0" />
                                                        <span className="truncate text-[11px] font-semibold text-slate-700">{s.display_name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-0.5 lg:pb-0">
                                    <button
                                        onClick={() => setFilter247(!filter247)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${filter247
                                                ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                            }`}
                                    >
                                        <ShieldAlert size={12} /> Open 24/7 Only
                                    </button>

                                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded shrink-0">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{filterDistance}km Range</span>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            step="5"
                                            value={filterDistance}
                                            onChange={(e) => setFilterDistance(Number(e.target.value))}
                                            className="w-16 accent-cyan-600 cursor-pointer"
                                        />
                                    </div>

                                    <div className="bg-white border border-slate-200 px-2 py-1.5 rounded flex items-center shrink-0">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-[10px] font-bold uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer text-slate-700"
                                        >
                                            <option value="distance">Nearest First</option>
                                            <option value="name">Alphabetical</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <main className="flex-1 w-full flex flex-col">
                    {selectedStore ? (
                        <div className="flex-1 w-full flex flex-col bg-white min-h-[calc(100vh-100px)] relative animate-fadeIn">
                            <div className="bg-slate-900 text-white p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-md z-10 w-full">

                                {/* Left Section: Back Button & Info */}
                                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-hidden">
                                    <button
                                        onClick={() => setSelectedStore(null)}
                                        className="shrink-0 p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold"
                                    >
                                        <ArrowLeft size={16} />
                                        {/* Hide "to List" on extra small screens to save space */}
                                        <span>Back <span className="hidden xs:inline sm:hidden md:inline">to List</span></span>
                                    </button>

                                    <div className="border-l border-slate-700 pl-2 sm:pl-3 min-w-0 flex-1">
                                        <h2 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                                            {selectedStore.name}
                                        </h2>
                                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} className="text-rose-400 shrink-0" />
                                            <span className="truncate">{selectedStore.address}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Right Section: Actions */}
                                <div className="flex items-center w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                                    <a
                                        href={directionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider text-[11px] py-2.5 sm:py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-all"
                                    >
                                        <Navigation size={13} className="shrink-0" />
                                        <span className="truncate">Open Directions</span>
                                        <ExternalLink size={12} className="shrink-0" />
                                    </a>
                                </div>

                            </div>

                            <div className="flex-1 w-full h-full relative bg-slate-100">
                                <iframe
                                    title="Full Bleed Command Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: "calc(100vh - 180px)" }}
                                    loading="lazy"
                                    srcDoc={`<style>html,body{margin:0;height:100%;overflow:hidden;}</style><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${selectedStore.lat},${selectedStore.lon}&z=15&output=embed"></iframe>`}
                                    className="w-full h-full block"
                                    allow="geolocation"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-screen px-3 md:px-20 w-full mx-auto p-3 sm:p-4 space-y-4 flex-1">
                            <div className="flex flex-col gap-0.5">
                                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">Nearest Registered Medical Stores & Pharmacies</h1>
                                <p className="text-slate-500 text-[11px] flex items-center gap-1.5 font-medium">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Tracking <span className="text-slate-900 font-bold">{displayedStores.length}</span> active pharmacies near <span className="font-semibold text-cyan-600 underline underline-offset-2 decoration-cyan-600/25">{currentArea.split(',')[0]}</span>
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[11px] font-semibold rounded">
                                    {error}
                                </div>
                            )}

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="relative flex items-center justify-center mb-4">
                                        <div className="w-10 h-10 border-4 border-slate-100 border-t-cyan-600 rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800 tracking-wider uppercase mb-1">{loadingText}</p>
                                    <p className="text-[9px] text-slate-400 font-medium">Syncing specialized store directories...</p>
                                </div>
                            ) : displayedStores.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <Info className="mx-auto text-slate-300 mb-2" size={32} />
                                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wide">No local dispensaries or pharmacies discovered</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {displayedStores.map(s => (
                                        <div key={s.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between transition-all hover:shadow-md hover:border-cyan-200 group">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`p-2 rounded ${s.isOpen247 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-cyan-50 text-cyan-600 border border-cyan-100'}`}>
                                                        <Pill size={12} />
                                                    </div>
                                                    <div className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                        <span className="text-[10px] font-bold text-slate-800 tracking-wide">{s.dist.toFixed(1)} km</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xs font-bold text-slate-900 mb-0.5 line-clamp-1 group-hover:text-cyan-600 transition-colors">{s.name}</h3>
                                                <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium mb-3">
                                                    <MapPin size={11} className="shrink-0 text-slate-300" />
                                                    <span className="truncate">{s.address}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-100 rounded-md mb-4">
                                                    <div>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">Service Type</p>
                                                        <p className="text-[11px] font-bold text-slate-700">{s.dispensing ? "Prescription" : "General Medical"}</p>
                                                    </div>
                                                    <div className="text-right border-l border-slate-200 pl-2">
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">Operations</p>
                                                        <p className={`text-[11px] font-bold ${s.isOpen247 ? 'text-rose-600' : 'text-slate-500'}`}>
                                                            {s.isOpen247 ? 'Open 24/7' : 'Standard Hours'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedStore(s)}
                                                className="w-fit bg-slate-900 hover:bg-cyan-600 text-white py-2 px-3 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                View Interactive Map <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
        </div>
    );
}