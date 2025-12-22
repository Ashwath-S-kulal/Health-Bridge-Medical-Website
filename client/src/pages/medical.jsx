import { useEffect, useState, useMemo, useCallback } from "react";
import Header from "../Components/Header";
import { X, MapPin, Phone, Copy, ExternalLink, Navigation, Search, AlertTriangle, Menu, Filter } from "lucide-react";

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

async function geocodeLocation(place) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`);
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
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
    const [filterDistance, setFilterDistance] = useState(50);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("distance");
    const [selectedHospital, setSelectedHospital] = useState(null);
    
    // UI State for Responsiveness
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const RADIUS_KM = 50;

    useEffect(() => {
        setLoading(true)
        if (locationInput.length <= 2) {
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
        setLoading(false)
    }, [locationInput]);

    const loadStores = useCallback(async (latitude, longitude) => {
        setLoading(true);
        setError("");
        setCoords({ latitude, longitude });
        setStoreSearch("");
        setSuggestions([]);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection

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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => loadStores(coords.latitude, coords.longitude),
            () => setError("GPS Permission Denied")
        );
    }, [loadStores]);

    const handleSearch = async () => {
        if (!locationInput.trim()) return;
        try {
            const { lat, lon } = await geocodeLocation(locationInput);
            loadStores(lat, lon);
        } catch {
            setError("Location not found");
        }
    };

    const displayList = useMemo(() => {
        let list = stores.filter(s => s.distance <= Number(filterDistance));
        if (filterOpen) list = list.filter(s => s.opening !== "Contact for hours");
        if (storeSearch) list = list.filter(s => s.name.toLowerCase().includes(storeSearch.toLowerCase()));

        return list.sort((a, b) => sortOption === "distance" ? a.distance - b.distance : a.name.localeCompare(b.name));
    }, [stores, filterDistance, filterOpen, sortOption, storeSearch]);

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden relative">
            <Header />
            
            <div className="flex flex-1 pt-16 overflow-hidden relative">
                
                {/* SIDEBAR - MOBILE DRAWER LOGIC */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 pt-16 lg:pt-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="flex flex-col h-full shadow-sm">
                        <div className="p-4 lg:p-6 border-b border-slate-100">
                            <div className="relative">
                                <div className="relative">
                                    <input
                                        className="w-full bg-slate-100 border border-transparent rounded-xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                        placeholder="Change Area..."
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                                </div>

                                {suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-2xl rounded-xl mt-2 overflow-hidden z-50">
                                        {suggestions.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setLocationInput(item.display_name);
                                                    loadStores(parseFloat(item.lat), parseFloat(item.lon));
                                                }}
                                                className="w-full text-left px-4 py-3 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border-b border-slate-50 last:border-none"
                                            >
                                                {item.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <section>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Discovery Filters</h4>
                                <div className="space-y-6">
                                    <label className="flex items-center justify-between cursor-pointer group p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <span className="text-sm font-bold text-slate-600">Open Now Only</span>
                                        <div className="relative inline-flex items-center">
                                            <input type="checkbox" checked={filterOpen} onChange={(e) => setFilterOpen(e.target.checked)} className="sr-only peer" />
                                            <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                                        </div>
                                    </label>
                                    <div className="items-center justify-between cursor-pointer group p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="flex justify-between text-xs font-bold mb-3">
                                            <span className="text-slate-500">Radius</span>
                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{filterDistance} KM</span>
                                        </div>
                                        <input type="range" min="1" max="50" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Current Stats</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-xl font-bold text-slate-800">{displayList.length}</div>
                                        <div className="text-[10px] text-slate-400 uppercase">Nearby</div>
                                    </div>
                                    <div className="border-l border-slate-200">
                                        <div className="text-xl font-bold text-green-600">{filterDistance}</div>
                                        <div className="text-[10px] text-slate-400 uppercase">Range km</div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Signal:</p>
                            <p className="text-[11px] text-slate-600 font-bold leading-relaxed line-clamp-2">{myLocation}</p>
                        </div>
                    </div>
                </aside>

                {/* MOBILE SIDEBAR OVERLAY */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* MAIN CONTENT */}
                <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50 w-full">
                    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-20 gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-white border border-slate-200 rounded-xl px-2 lg:px-4 py-2 text-[10px] lg:text-xs font-bold text-slate-600 outline-none hover:border-emerald-500 cursor-pointer"
                            >
                                <option value="distance">Proximity</option>
                                <option value="name">A-Z Name</option>
                            </select>
                        </div>

                        <div className="flex-1 max-w-xl relative">
                            <input
                                type="text"
                                placeholder="Search pharmacy..."
                                value={storeSearch}
                                onChange={(e) => setStoreSearch(e.target.value)}
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-[10px] lg:text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                        </div>
                    </nav>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                                <div className="w-12 h-12 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                                    Syncing New Location...
                                </span>
                            </div>
                        ) : error ? (
                            <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                                <div className="bg-red-50 text-red-500 w-12 h-12 flex items-center justify-center rounded-full mb-4"><AlertTriangle /></div>
                                <h3 className="font-black text-slate-800 uppercase text-sm">System Error</h3>
                                <p className="text-slate-500 text-xs mt-2">{error}</p>
                                <button onClick={() => window.location.reload()} className="mt-6 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Re-initialize</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                {displayList.map((s) => (
                                    <div key={s.id} className="bg-white rounded-[1.5rem] p-5 lg:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                <Navigation className="w-5 h-5" />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-black text-slate-900 leading-none">{s.distance.toFixed(1)}</span>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase">KM</span>
                                            </div>
                                        </div>

                                        <h3 className="text-sm lg:text-base font-black text-slate-800 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">{s.name}</h3>
                                        <p className="text-[10px] lg:text-[11px] text-slate-400 font-medium mb-6 line-clamp-2 italic">{s.address}</p>

                                        <div className="mt-auto space-y-4 pt-4 border-t border-slate-50">
                                            <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${s.opening === "Contact for hours" ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-600"}`}>
                                                {s.opening === "Contact for hours" ? "Closed/Unknown" : "Verify Hours"}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedHospital(s)}
                                                    className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all cursor-pointer"
                                                >
                                                    Action Center
                                                </button>
                                                {s.phone && (
                                                    <a href={`tel:${s.phone}`} className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-200">
                                                        <Phone className="w-4 h-4 text-emerald-600" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {displayList.length === 0 && (
                                    <div className="col-span-full py-20 text-center opacity-40">
                                        <div className="text-4xl mb-3">💊</div>
                                        <p className="font-black uppercase text-[10px] tracking-[0.3em]">No Medical Sources Found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* MODAL - RESPONSIVE WIDTHS */}
            {selectedHospital && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedHospital(null)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
                        <div className="h-32 lg:h-44 bg-slate-100 relative">
                            <iframe
                                title="Mini Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lon - 0.005},${selectedHospital.lat - 0.005},${selectedHospital.lon + 0.005},${selectedHospital.lat + 0.005}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lon}`}
                                className="grayscale opacity-70 pointer-events-none"
                            />
                            <button onClick={() => setSelectedHospital(null)} className="absolute top-4 right-4 bg-white shadow-xl p-2 rounded-xl lg:rounded-2xl hover:text-red-600 transition-all"><X size={18} /></button>
                        </div>

                        <div className="p-6 lg:p-10">
                            <div className="flex items-center gap-3 mb-4 lg:mb-6">
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Active Route Found</span>
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedHospital.distance.toFixed(1)} KM</span>
                            </div>

                            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-3 tracking-tight">{selectedHospital.name}</h2>
                            <div className="flex items-start gap-2 text-slate-500 mb-6 lg:mb-8">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                <p className="text-xs font-medium leading-relaxed italic">{selectedHospital.address}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 lg:mb-8">
                                <a
                                    href={selectedHospital.phone ? `tel:${selectedHospital.phone}` : "#"}
                                    onClick={(e) => !selectedHospital.phone && e.preventDefault()}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 lg:p-6 rounded-3xl border-2 transition-all ${selectedHospital.phone ? "bg-white border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-900" : "bg-slate-50 border-transparent opacity-50 cursor-not-allowed"}`}
                                >
                                    <Phone className={`w-5 h-5 lg:w-6 h-6 ${selectedHospital.phone ? "text-emerald-500" : "text-slate-300"}`} />
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">{selectedHospital.phone ? "Call Facility" : "No Phone"}</span>
                                </a>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedHospital.address);
                                        alert("Address copied!");
                                    }}
                                    className="flex flex-col items-center justify-center gap-3 p-4 lg:p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <Copy className="w-5 h-5 lg:w-6 h-6 text-blue-500" />
                                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-900">Copy Address</span>
                                </button>
                            </div>

                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                            >
                                Launch Navigation <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}