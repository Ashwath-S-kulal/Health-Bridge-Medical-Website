import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { X, MapPin, Phone, Copy, ExternalLink, Navigation, Search, AlertTriangle, Filter, Compass, Globe } from "lucide-react";
import Sidebar from "../Components/Sidebar";

/* ---------------- HELPERS ---------------- */
const distanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getBoundingBox = (lat, lon, radiusKm) => {
    const latDelta = radiusKm / 111;
    const lonDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
    return { 
        south: lat - latDelta, 
        north: lat + latDelta, 
        west: lon - lonDelta, 
        east: lon + lonDelta 
    };
};

const OVERPASS_SERVERS = [
    "https://overpass.kumi.systems/api/interpreter", 
    "https://lz4.overpass-api.de/api/interpreter"
];

/* ---------------- SUB-COMPONENTS ---------------- */

const PharmacyCard = memo(({ s, onSelect }) => (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden ring-1 ring-slate-100 hover:ring-emerald-200">
        <div className="absolute top-4 right-4 text-right">
            <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors">
                {s.distance.toFixed(1)}
            </span>
            <span className="text-[10px] font-black text-emerald-500 block uppercase">KM</span>
        </div>

        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
            <Compass className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{s.name}</h3>

        <div className="flex items-start gap-2 mb-6 h-10">
            <MapPin size={14} className="text-slate-400 mt-1 flex-shrink-0" />
            <p className="text-xs text-slate-500 font-medium line-clamp-2 italic">{s.address}</p>
        </div>

        <div className="mt-auto flex items-center gap-3">
            <button
                onClick={() => onSelect(s)}
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
            >
                Details
            </button>
            {s.phone && (
                <a href={`tel:${s.phone}`} className="w-11 h-11 bg-white rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-all border border-slate-200 shadow-sm">
                    <Phone className="w-4 h-4 text-emerald-600" />
                </a>
            )}
        </div>
    </div>
));

/* ---------------- MAIN APP ---------------- */

export default function App() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [myLocation, setMyLocation] = useState("Detecting...");
    const [storeSearch, setStoreSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [filterDistance, setFilterDistance] = useState(25);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("distance");
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const RADIUS_KM = 50;

    const loadStores = useCallback(async (latitude, longitude) => {
        if (!latitude || !longitude) return;
        
        setLoading(true);
        setError("");
        setSuggestions([]);

        try {
            // Reverse Geocode to show user where they are
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                setMyLocation(geoData.display_name || "Custom Location");
            }

            const bbox = getBoundingBox(latitude, longitude, RADIUS_KM);
            const query = `[out:json][timeout:25];(node["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center tags;`;

            let data;
            for (const url of OVERPASS_SERVERS) {
                try {
                    const res = await fetch(url, { 
                        method: "POST", 
                        body: `data=${encodeURIComponent(query)}`,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    if (res.ok) { data = await res.json(); break; }
                } catch (e) { continue; }
            }

            if (!data || !data.elements) throw new Error("Servers unreachable");

            const cleaned = data.elements.map((el) => {
                const lat = el.lat || el.center?.lat;
                const lon = el.lon || el.center?.lon;
                const tags = el.tags || {};
                return {
                    id: el.id,
                    name: tags.name || "Local Pharmacy",
                    address: tags["addr:street"] ? `${tags["addr:street"]}, ${tags["addr:city"] || ""}` : "Address in records",
                    phone: tags["contact:phone"] || tags.phone || "",
                    opening: tags.opening_hours || "Contact for hours",
                    distance: distanceKm(latitude, longitude, lat, lon),
                    lat, lon
                };
            }).filter(s => s.distance <= RADIUS_KM);

            setStores(cleaned);
        } catch (e) {
            setError("Unable to sync with medical database. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Geolocation Load
    useEffect(() => {
        let isMounted = true;
        
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (isMounted) loadStores(coords.latitude, coords.longitude);
            },
            () => {
                if (isMounted) {
                    setError("GPS Permission Denied. Please search for a location manually.");
                    setMyLocation("Manual Search Required");
                }
            },
            { timeout: 10000 }
        );

        return () => { isMounted = false; };
    }, [loadStores]);

    // Nominatim Autocomplete Logic
    useEffect(() => {
        if (locationInput.length <= 3) {
            setSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=5`);
                const data = await res.json();
                setSuggestions(data);
            } catch (e) { console.error(e); }
        }, 500);
        return () => clearTimeout(timer);
    }, [locationInput]);

    // Derived State for Filtering/Sorting
    const displayList = useMemo(() => {
        return stores
            .filter(s => s.distance <= Number(filterDistance))
            .filter(s => !filterOpen || s.opening !== "Contact for hours")
            .filter(s => s.name.toLowerCase().includes(storeSearch.toLowerCase()))
            .sort((a, b) => sortOption === "distance" ? a.distance - b.distance : a.name.localeCompare(b.name));
    }, [stores, filterDistance, filterOpen, sortOption, storeSearch]);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased text-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64 transition-all duration-300">

                {/* HEADER */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 sticky top-0 pt-20 md:pt-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex flex-col lg:flex-row gap-3 items-center">

                            <div className="relative w-full lg:flex-1">
                                <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                    <MapPin className="w-4 h-4 text-emerald-500 mr-2" />
                                    <input
                                        className="bg-transparent w-full text-sm font-medium outline-none"
                                        placeholder="Search location (City, Street...)"
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                    />
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-1 overflow-hidden z-50">
                                        {suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setLocationInput(item.display_name);
                                                    loadStores(parseFloat(item.lat), parseFloat(item.lon));
                                                }}
                                                className="w-full text-left px-4 py-3 text-xs font-medium text-slate-600 hover:bg-emerald-50 border-b border-slate-50 last:border-none"
                                            >
                                                {item.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative w-full lg:flex-1">
                                <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                    <Search className="w-4 h-4 text-slate-400 mr-2" />
                                    <input
                                        className="bg-transparent w-full text-sm font-medium outline-none"
                                        placeholder="Filter by name..."
                                        value={storeSearch}
                                        onChange={(e) => setStoreSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 w-full lg:w-auto">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${showFilters ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                                >
                                    <Filter size={16} /> Filters
                                </button>
                                <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                    <Navigation className="w-3 h-3 text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">{displayList.length} Found</span>
                                </div>
                            </div>
                        </div>

                        {/* FILTER PANEL */}
                        <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radius: {filterDistance}km</label>
                                    <input type="range" min="1" max="50" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none accent-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort By</label>
                                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none">
                                        <option value="distance">Nearest First</option>
                                        <option value="name">Alphabetical</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between bg-white px-4 rounded-lg border border-slate-200 h-10 self-end">
                                    <span className="text-xs font-bold text-slate-600">Open Now Only</span>
                                    <input type="checkbox" checked={filterOpen} onChange={(e) => setFilterOpen(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                <h3 className="font-bold text-slate-800 tracking-tight">Syncing with Medical Database...</h3>
                            </div>
                        ) : error ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <AlertTriangle className="text-red-500 mb-4" size={48} />
                                <p className="text-slate-600 font-medium max-w-sm">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase">Retry Discovery</button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Results in your proximity</h2>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 max-w-xs sm:max-w-md">
                                        <Globe size={12} className="text-emerald-500" />
                                        <span className="truncate">{myLocation}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayList.map((s) => (
                                        <PharmacyCard key={s.id} s={s} onSelect={setSelectedHospital} />
                                    ))}
                                </div>

                                {displayList.length === 0 && (
                                    <div className="py-20 text-center">
                                        <p className="text-slate-400 font-bold text-sm uppercase">No medical units found in this range</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                {/* MODAL */}
                {selectedHospital && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
                        <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
                            <div className="h-48 bg-slate-100 relative">
                                <iframe
                                    title="map"
                                    width="100%" height="100%" frameBorder="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lon - 0.005},${selectedHospital.lat - 0.005},${selectedHospital.lon + 0.005},${selectedHospital.lat + 0.005}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lon}`}
                                    className="grayscale opacity-80"
                                />
                                <button onClick={() => setSelectedHospital(null)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="flex gap-2 mb-4">
                                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase">Pharmacy</span>
                                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">{selectedHospital.distance.toFixed(2)} KM Away</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedHospital.name}</h2>
                                <p className="text-sm text-slate-500 mb-6 flex items-start gap-2">
                                    <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    {selectedHospital.address}
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <a href={`tel:${selectedHospital.phone}`} className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase transition-all ${selectedHospital.phone ? "border-slate-200 hover:bg-emerald-50" : "opacity-30 pointer-events-none"}`}>
                                        <Phone size={14} /> Call Store
                                    </a>
                                    <button onClick={() => { navigator.clipboard.writeText(selectedHospital.address); alert("Address Copied!"); }} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase hover:bg-blue-50 transition-all">
                                        <Copy size={14} /> Copy Addr
                                    </button>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
                                >
                                    Open in Google Maps <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}