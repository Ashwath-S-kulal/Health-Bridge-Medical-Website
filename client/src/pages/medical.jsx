import { useEffect, useState, useMemo, useCallback } from "react";
import { X, MapPin, Phone, Copy, ExternalLink, Navigation, Search, AlertTriangle, Filter, ChevronDown, Compass, Globe } from "lucide-react";
import Sidebar from "../Components/Sidebar";

/* ---------------- HELPERS ---------------- */
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

const OVERPASS_SERVERS = ["https://overpass.kumi.systems/api/interpreter", "https://lz4.overpass-api.de/api/interpreter"];

async function fetchOverpass(query) {
    for (const url of OVERPASS_SERVERS) {
        try {
            const res = await fetch(url, { method: "POST", body: `data=${encodeURIComponent(query)}` });
            if (res.ok) return await res.json();
        } catch (e) { continue; }
    }
    throw new Error("Data sync failed.");
}

async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        return data.display_name || "Unknown location";
    } catch { return "Unknown location"; }
}

/* ---------------- APP ---------------- */

export default function App() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const [myLocation, setMyLocation] = useState("Detecting...");
    const [coords, setCoords] = useState(null);
    const [storeSearch, setStoreSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [filterDistance, setFilterDistance] = useState(25);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("distance");
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const RADIUS_KM = 50;

    // Suggestion logic
    useEffect(() => {
        if (locationInput.length <= 3) {
            setSuggestions([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(locationInput)}&limit=5`);
                const data = await res.json();
                setSuggestions(data);
            } catch (e) { console.error("Suggestion fetch failed"); }
        }, 400);
        return () => clearTimeout(timer);
    }, [locationInput]);

    const loadStores = useCallback(async (latitude, longitude) => {
        setLoading(true);
        setError("");
        setCoords({ latitude, longitude });
        setStoreSearch("");
        setSuggestions([]);

        try {
            const placeName = await reverseGeocode(latitude, longitude);
            setMyLocation(placeName);

            const bbox = getBoundingBox(latitude, longitude, RADIUS_KM);
            const query = `[out:json][timeout:25];(node["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"="pharmacy"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center tags;`;

            const data = await fetchOverpass(query);
            const cleaned = data.elements.map((el) => {
                const lat = el.lat || el.center?.lat;
                const lon = el.lon || el.center?.lon;
                const tags = el.tags || {};
                return {
                    id: el.id,
                    name: tags.name || "Local Pharmacy",
                    address: tags["addr:street"] ? `${tags["addr:street"]}, ${tags["addr:city"] || ""}` : "Address details in records",
                    phone: tags["contact:phone"] || tags.phone || "",
                    website: tags["contact:website"] || tags.website || "",
                    opening: tags.opening_hours || "Contact for hours",
                    distance: distanceKm(latitude, longitude, lat, lon),
                    lat, lon
                };
            }).filter(s => s.distance <= RADIUS_KM);

            setStores(cleaned);
        } catch (e) {
            setError("Failed to sync with medical database.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => loadStores(coords.latitude, coords.longitude),
            () => setError("GPS Permission Denied. Please search for a location manually.")
        );
    }, [loadStores]);

    const displayList = useMemo(() => {
        let list = stores.filter(s => s.distance <= Number(filterDistance));
        if (filterOpen) list = list.filter(s => s.opening !== "Contact for hours");
        if (storeSearch) list = list.filter(s => s.name.toLowerCase().includes(storeSearch.toLowerCase()));

        return list.sort((a, b) => sortOption === "distance" ? a.distance - b.distance : a.name.localeCompare(b.name));
    }, [stores, filterDistance, filterOpen, sortOption, storeSearch]);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased text-slate-900">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64 transition-all duration-300">

                {/* TOP BAR: SEARCH & FILTERS */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 sticky top-0 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">

                            {/* Location Input Group */}
                            <div className="relative w-full lg:w-1/3">
                                <div className="flex items-center bg-slate-100 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-inner">
                                    <MapPin className="w-5 h-5 text-emerald-500 mr-3" />
                                    <input
                                        className="bg-transparent w-full text-sm font-semibold outline-none"
                                        placeholder="Enter your location..."
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                    />
                                    {locationInput && <X className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500" onClick={() => setLocationInput("")} />}
                                </div>

                                {suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-2xl rounded-2xl mt-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        {suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setLocationInput(item.display_name);
                                                    loadStores(parseFloat(item.lat), parseFloat(item.lon));
                                                }}
                                                className="w-full text-left px-5 py-3 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border-b border-slate-50 last:border-none transition-colors"
                                            >
                                                {item.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pharmacy Search */}
                            <div className="relative w-full lg:w-1/3">
                                <div className="flex items-center bg-slate-100 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
                                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                                    <input
                                        className="bg-transparent w-full text-sm font-semibold outline-none"
                                        placeholder="Find pharmacy by name..."
                                        value={storeSearch}
                                        onChange={(e) => setStoreSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between w-full lg:w-1/3 gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${showFilters ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                                >
                                    <Filter size={18} />
                                    {showFilters ? 'Hide Filters' : 'Filters'}
                                </button>

                                <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100">
                                    <Navigation className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-tight">
                                        {displayList.length} Units Found
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Filter Panel */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Search Radius</label>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="1" max="50" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                        <span className="text-sm font-bold text-emerald-600 min-w-[50px]">{filterDistance} KM</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sort Results</label>
                                    <div className="relative">
                                        <select
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                                        >
                                            <option value="distance">Nearest First</option>
                                            <option value="name">Alphabetical</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-white px-5 rounded-2xl border border-slate-200 self-end h-[46px]">
                                    <span className="text-sm font-bold text-slate-600">Open Now Only</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={filterOpen} onChange={(e) => setFilterOpen(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-sm"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="h-[70vh] flex flex-col items-center justify-center gap-6 ">
                                <div className="relative">
                                    <div className="w-20 h-20 border-[6px] border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                                    <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 w-8 h-8 animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-slate-800  tracking-tighter">Scanning for Pharmacies</h3>
                                    <p className="text-xs text-slate-400 font-bold tracking-widest animate-pulse mt-2">Retrieving real-time location data...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                                <div className="bg-red-50 text-red-500 p-8 rounded-[3rem] mb-6 shadow-xl shadow-red-100 ring-4 ring-white"><AlertTriangle size={64} /></div>
                                <h3 className="text-2xl font-black text-slate-800 uppercase">System Error</h3>
                                <p className="text-slate-500 text-sm mt-3 font-medium leading-relaxed">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl hover:scale-105 active:scale-95">Restart Scanner</button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Live Feed: {displayList.length} Locations</h2>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-[11px] text-slate-400 font-bold italic shadow-sm max-w-md">
                                        <Globe size={14} className="text-emerald-400" />
                                        <span className="truncate">{myLocation}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {displayList.map((s) => (
                                        <div key={s.id} className="group bg-white rounded-xl p-8 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden ring-1 ring-slate-100 hover:ring-emerald-200">
                                            <div className="absolute top-0 right-0 p-8">
                                                <div className="text-right">
                                                    <span className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors">{s.distance.toFixed(1)}</span>
                                                    <span className="text-[10px] font-black text-emerald-500 block uppercase ml-1">KM</span>
                                                </div>
                                            </div>

                                            <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 ">
                                                <Compass className="w-8 h-8" />
                                            </div>

                                            <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">{s.name}</h3>
                                            <div className="flex items-start gap-2 mb-8 h-10">
                                                <MapPin size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
                                                <p className="text-xs text-slate-400 font-semibold line-clamp-2 italic">{s.address}</p>
                                            </div>

                                            <div className="mt-auto flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${s.opening === "Contact for hours" ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"}`}>
                                                        {s.opening === "Contact for hours" ? "Unverified" : "Verified Open"}
                                                    </span>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setSelectedHospital(s)}
                                                        className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
                                                    >
                                                        View Details
                                                    </button>
                                                    {s.phone && (
                                                        <a href={`tel:${s.phone}`} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border-2 border-slate-100 hover:border-emerald-500 shadow-sm group/phone">
                                                            <Phone className="w-5 h-5 text-emerald-600 group-hover/phone:text-white" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {displayList.length === 0 && (
                                    <div className="py-32 flex flex-col items-center justify-center text-center">
                                        <p className="font-black uppercase text-sm tracking-[0.4em] text-slate-300">No Pharmacies in this range</p>
                                        <button
                                            onClick={() => setFilterDistance(50)}
                                            className="mt-6 text-emerald-500 font-bold text-xs uppercase underline tracking-widest hover:text-emerald-600"
                                        >
                                            Expand Search Radius
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                {/* MODAL: ACTION CENTER */}
                {selectedHospital && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center transition-all animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedHospital(null)} />
                        <div className="relative bg-white w-full max-w-lg rounded-xl sm:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500 max-h-[95vh] flex flex-col">
                            <div className="h-40 sm:h-56 bg-slate-100 relative group overflow-hidden shrink-0">
                                <iframe
                                    title="Location Map"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lon - 0.005},${selectedHospital.lat - 0.005},${selectedHospital.lon + 0.005},${selectedHospital.lat + 0.005}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lon}`}
                                    className="grayscale contrast-125 opacity-90 scale-110 group-hover:scale-100 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                                <button
                                    onClick={() => setSelectedHospital(null)}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-lg p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-5 pb-6 sm:px-10 sm:pb-10 -mt-8 relative z-10 overflow-y-auto">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">Medical Facility</span>
                                    <span className="bg-white text-slate-600 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-slate-200 shadow-sm">{selectedHospital.distance.toFixed(2)} KM Away</span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight leading-tight">{selectedHospital.name}</h2>
                                <div className="flex items-start gap-3 text-slate-500 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <MapPin size={18} className="mt-1 text-emerald-500 shrink-0" />
                                    <p className="text-xs font-bold leading-relaxed">{selectedHospital.address}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <a
                                        href={selectedHospital.phone ? `tel:${selectedHospital.phone}` : "#"}
                                        onClick={(e) => !selectedHospital.phone && e.preventDefault()}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedHospital.phone ? "bg-white border-slate-100 hover:border-emerald-500 text-slate-900 active:scale-95" : "bg-slate-50 border-transparent opacity-50 cursor-not-allowed"}`}
                                    >
                                        <Phone size={16} className={selectedHospital.phone ? "text-emerald-500" : "text-slate-300"} />
                                        <span className="text-[10px] font-black uppercase">Call</span>
                                    </a>

                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedHospital.address);
                                            alert("Address copied!");
                                        }}
                                        className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-500 active:scale-95 transition-all"
                                    >
                                        <Copy size={16} className="text-blue-500" />
                                        <span className="text-[10px] font-black uppercase">Copy</span>
                                    </button>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95 group"
                                >
                                    Start Navigation <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}