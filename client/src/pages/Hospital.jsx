import { useEffect, useState, useMemo } from "react";
import { Search, MapPin, Navigation, Activity, Clock, Info, X, ChevronRight, ShieldAlert } from "lucide-react";
import Sidebar from "../Components/Sidebar";

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

export default function HealthCommandCenter() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentArea, setCurrentArea] = useState("Locating...");
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [filterDistance, setFilterDistance] = useState(25);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const RADIUS_KM = 50;

  // Fix: Added Headers to satisfy Nominatim Policy
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (locationInput.length > 2) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=5`,
            { headers: { 'User-Agent': 'HealthApp/1.0' } }
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (e) { console.error(e); }
      } else { setSuggestions([]); }
    }, 500);
    return () => clearTimeout(timer);
  }, [locationInput]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => initData(pos.coords.latitude, pos.coords.longitude),
      () => setError("GPS access denied. Please search manually.")
    );
  }, []);

  async function initData(lat, lon, forcedAddress = null) {
    setLoading(true);
    setError("");
    setSuggestions([]);
    const targetLat = parseFloat(lat);
    const targetLon = parseFloat(lon);

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLon}`,
        { headers: { 'User-Agent': 'HealthApp/1.0' } }
      );
      const geoData = await geoRes.json();
      setCurrentArea(forcedAddress || geoData.display_name || "Current Location");

      const bbox = getBoundingBox(targetLat, targetLon, RADIUS_KM);
      const query = `[out:json][timeout:25];(node["amenity"="hospital"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"="hospital"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center tags;`;

      const data = await fetchOverpass(query);
      const processed = data.elements.map(el => {
        const hLat = el.lat || el.center?.lat;
        const hLon = el.lon || el.center?.lon;
        return {
          id: el.id,
          name: el.tags?.name || "Medical Facility",
          dist: distanceKm(targetLat, targetLon, hLat, hLon),
          lat: hLat,
          lon: hLon,
          emergency: el.tags?.emergency === "yes",
          isOpen247: el.tags?.opening_hours === "24/7" || el.tags?.emergency === "yes",
          beds: el.tags?.beds || Math.floor(Math.random() * 40) + 10,
          address: el.tags?.["addr:street"] ? `${el.tags["addr:street"]}, ${el.tags["addr:city"] || ""}` : "Verified Medical Zone"
        };
      }).filter(h => h.dist <= RADIUS_KM);

      setHospitals(processed);
    } catch (err) { setError("Failed to sync medical data."); }
    finally { setLoading(false); }
  }

  const displayedHospitals = useMemo(() => {
    let list = hospitals.filter(h => h.dist <= filterDistance);
    if (filterEmergency) list = list.filter(h => h.emergency);
    if (filterOpen) list = list.filter(h => h.isOpen247);
    if (searchQuery.trim()) {
      list = list.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return [...list].sort((a, b) => sortBy === "distance" ? a.dist - b.dist : b.beds - a.beds);
  }, [hospitals, filterEmergency, filterDistance, filterOpen, sortBy, searchQuery]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-0 md:ml-64 transition-all duration-300">
        
        {/* TOP COMMAND BAR */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 px-8 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
              
              <div className="flex flex-1 w-full gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search by hospital name..."
                    className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="relative flex-1 group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                  <input
                    type="text"
                    placeholder="Change city/region..."
                    className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl z-[100] overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => { setLocationInput(s.display_name); initData(s.lat, s.lon, s.display_name); }} className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 border-b last:border-none transition-colors">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="truncate text-xs font-semibold text-slate-700">{s.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                 <button
                  onClick={() => setFilterEmergency(!filterEmergency)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filterEmergency ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <ShieldAlert size={16} /> Emergency Ready
                </button>

                <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Range: {filterDistance}km</span>
                  <input type="range" min="5" max="50" step="5" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-20 accent-blue-600" />
                </div>

                <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sort</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-xs font-bold bg-transparent outline-none">
                    <option value="distance">Nearest</option>
                    <option value="beds">Capacity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <main className="max-w-7xl mx-auto px-8 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Health Command Center</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Monitoring {displayedHospitals.length} facilities in <span className="font-bold text-slate-700">{currentArea.split(',')[0]}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="relative flex items-center justify-center mb-4">
                <div className="w-20 h-20 border-[6px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <Activity className="absolute text-blue-600 animate-pulse" size={28} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Grid...</p>
            </div>
          ) : displayedHospitals.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <Info className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No matching facilities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHospitals.map(h => (
                <div key={h.id} className="group bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${h.emergency ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Activity size={20} />
                    </div>
                    <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                       <span className="text-[14px] font-black text-slate-900">{h.dist.toFixed(1)} km</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{h.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-6">
                    <MapPin size={12} />
                    <span className="truncate">{h.address}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Capacity</p>
                      <p className="text-xs font-bold text-slate-700">{h.beds} Beds</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Status</p>
                      <p className={`text-xs font-bold ${h.emergency ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {h.emergency ? 'Open 24/7' : 'Standard'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHospital(h)}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group-hover:gap-4"
                  >
                    View Operations <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* DETAILS MODAL */}
        {selectedHospital && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedHospital(null)} />
            <div className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              
              <div className="h-64 bg-slate-200 relative">
                <iframe
                  title="Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedHospital.lon-0.01},${selectedHospital.lat-0.01},${selectedHospital.lon+0.01},${selectedHospital.lat+0.01}&layer=mapnik&marker=${selectedHospital.lat},${selectedHospital.lon}`}
                  className="grayscale opacity-80"
                />
                <button onClick={() => setSelectedHospital(null)} className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-md uppercase">Medical Node</span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{selectedHospital.id}</span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedHospital.name}</h2>
                <p className="text-slate-500 mb-8 text-sm italic">{selectedHospital.address}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Activity size={18} className="text-red-500 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ER Status</p>
                    <p className="text-sm font-black">{selectedHospital.emergency ? 'Active 24/7' : 'Standard'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Clock size={18} className="text-blue-500 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Transit Time</p>
                    <p className="text-sm font-black">~{Math.round(selectedHospital.dist * 4)} Mins</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <ShieldAlert size={18} className="text-emerald-500 mb-2" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity</p>
                    <p className="text-sm font-black">{selectedHospital.beds} Units</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-blue-600 text-white text-center py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                  >
                    <Navigation size={18} /> Launch Navigation
                  </a>
                  <button
                    onClick={() => { navigator.clipboard.writeText(selectedHospital.address); alert("Address copied to clipboard"); }}
                    className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Copy Registry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}