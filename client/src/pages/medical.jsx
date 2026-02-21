import { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
    X, MapPin, Phone, Copy, Navigation, Search,
    AlertTriangle, Filter, Compass, Globe, Clock, Activity
} from "lucide-react";
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

const MetricCard = ({ icon, label, value, isStatus }) => (
    <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
            <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">{label}</span>
        </div>
        <span className={`text-sm font-black tracking-tight ${isStatus ? 'text-blue-600' : 'text-slate-900'}`}>
            {value}
        </span>
    </div>
);

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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => loadStores(coords.latitude, coords.longitude),
            () => {
                setError("GPS Permission Denied. Please search manually.");
                setMyLocation("Manual Search Required");
            },
            { timeout: 10000 }
        );
    }, [loadStores]);

    useEffect(() => {
        if (locationInput.length <= 3) { setSuggestions([]); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=5`);
                const data = await res.json();
                setSuggestions(data);
            } catch (e) { console.error(e); }
        }, 500);
        return () => clearTimeout(timer);
    }, [locationInput]);

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
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 sticky top-0 pt-16 lg:pt-0">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex flex-col lg:flex-row gap-3 items-center">
                            <div className="relative w-full lg:flex-1">
                                <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
                                    <MapPin className="w-4 h-4 text-emerald-500 mr-2" />
                                    <input
                                        className="bg-transparent w-full text-sm font-medium outline-none"
                                        placeholder="Search location..."
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                    />
                                </div>
                                {suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-2xl rounded-xl mt-1 overflow-hidden z-[60]">
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

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border w-full lg:w-auto ${showFilters ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                                <Filter size={16} /> Filters
                            </button>
                        </div>

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

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                                <h3 className="font-bold text-slate-800 tracking-tight">Syncing Medical Database...</h3>
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
                                        <p className="text-slate-400 font-bold text-sm uppercase">No units found in range</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                {/* MODAL */}
                {selectedHospital && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0">
                        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setSelectedHospital(null)} />
                        <div className="relative bg-white w-full h-full md:h-full md:max-w-full  shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row">
                            <div className="relative h-full lg:h-auto  lg:flex-1 bg-slate-950">
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 z-0">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Establishing Uplink...</p>
                                </div>
                                <iframe
                                    title="Command Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    srcDoc={`<style>html,body{margin:0;height:100%;overflow:hidden;background:#0f172a;}</style><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lon}&z=16&output=embed"></iframe>`}
                                    className="relative z-10 w-full h-full "
                                />
                                <button onClick={() => setSelectedHospital(null)}
                                    className="absolute top-4 right-4 md:top-6 md:right-6 bg-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-[110] border border-slate-200 active:scale-90"
                                >                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="w-full lg:w-[480px] bg-white flex flex-col h-[60vh] lg:h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-20">
                                <div className="p-5 md:p-12 flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center justify-between mb-4 md:mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                            <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                                                Medical Node
                                            </span>
                                        </div>
                                        <span className="text-slate-300 text-[10px] font-mono font-bold tracking-widest">
                                            ID-{selectedHospital.id}
                                        </span>
                                    </div>

                                    <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
                                        {selectedHospital.name}
                                    </h2>

                                    <div className="inline-flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-6 md:mb-10 w-full">
                                        <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                                            {selectedHospital.address}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 md:gap-4 mb-8 md:mb-12">
                                        <MetricCard
                                            icon={<Navigation size={16} className="text-blue-500" />}
                                            label="Proximity"
                                            value={`${selectedHospital.distance.toFixed(2)} KM`}
                                        />
                                        <MetricCard
                                            icon={<Activity size={16} className="text-rose-500" />}
                                            label="Availability"
                                            value={selectedHospital.opening}
                                        />
                                        <MetricCard
                                            icon={<Clock size={16} className="text-emerald-500" />}
                                            label="Status"
                                            value="Ready"
                                            isStatus
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-blue-600 text-white py-3.5 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.1em] hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95"
                                        >
                                            <Navigation size={18} fill="white" /> Dispatch
                                        </a>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedHospital.address);
                                                alert("Registry copied.");
                                            }}
                                            className="w-full py-3.5 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.1em] hover:bg-slate-800 flex items-center justify-center gap-3 transition-all active:scale-95"
                                        >
                                            <Copy size={18} /> Copy Registry
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:block p-6 bg-slate-50 border-t border-slate-100 text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                        Operational Health Data Interface
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}