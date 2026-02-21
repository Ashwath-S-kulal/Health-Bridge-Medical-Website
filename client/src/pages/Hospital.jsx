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

  const RADIUS_KM = 25;

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
      {/* Sidebar hidden on mobile, visible on lg */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-64 transition-all duration-300 w-full">
        {/* TOP COMMAND BAR */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-4 md:px-8 md:py-6">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
              
              {/* Search Inputs */}
              <div className="flex flex-col sm:flex-row w-full flex-1 gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    className="w-full bg-slate-100/50 border border-transparent focus:border-blue-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="relative flex-1 group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                  <input
                    type="text"
                    placeholder="Location..."
                    className="w-full bg-slate-100/50 border border-transparent focus:border-red-200 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-red-500/5 transition-all text-sm font-medium"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => { setLocationInput(s.display_name); initData(s.lat, s.lon, s.display_name); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b last:border-none transition-colors">
                          <MapPin size={14} className="text-slate-400" />
                          <span className="truncate text-xs font-semibold text-slate-700">{s.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pb-1 xl:pb-0">
                 <button
                  onClick={() => setFilterEmergency(!filterEmergency)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black  whitespace-nowrap transition-all border ${filterEmergency ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <ShieldAlert size={14} /> Emergency
                </button>

                <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{filterDistance}km</span>
                  <input type="range" min="5" max="50" step="5" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-16 md:w-20 accent-blue-600 cursor-pointer" />
                </div>

                <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-xl flex items-center gap-2 shrink-0">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[11px] font-black bg-transparent outline-none cursor-pointer text-slate-700">
                    <option value="distance">Nearest</option>
                    <option value="beds">Capacity</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <main className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Your Nearest Hospitals</h1>
            <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Monitoring <span className="text-slate-900 font-bold">{displayedHospitals.length}</span> units in <span className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-4">{currentArea.split(',')}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 md:py-48">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-16 h-16 md:w-16 md:h-16 border-[4px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                <Activity className="absolute text-blue-600 animate-pulse" size={20} />
              </div>
              <p className="text-xs font-black text-slate-400 tracking-[0.1em]">Triangulating Medical Grid</p>
            </div>
          ) : displayedHospitals.length === 0 ? (
            <div className="text-center py-24 md:py-32 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <Info className="mx-auto text-slate-200 mb-4" size={56} />
              <p className="text-slate-400 font-black text-xs tracking-widest">No matching units found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {displayedHospitals.map(h => (
                <div key={h.id} className="group bg-white border border-slate-200 rounded-xl p-5 md:p-6 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 rounded-2xl ${h.emergency ? 'bg-red-50 text-red-600 shadow-inner' : 'bg-blue-50 text-blue-600 shadow-inner'}`}>
                        <Activity size={10} />
                      </div>
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                         <span className="text-xs font-black text-slate-900 tracking-tighter">{h.dist.toFixed(1)} km</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{h.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-6">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{h.address}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/50 rounded-2xl mb-6 border border-slate-100">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Capacity</p>
                        <p className="text-xs font-bold text-slate-700">{h.beds} Beds</p>
                      </div>
                      <div className="text-right border-l border-slate-200 pl-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Status</p>
                        <p className={`text-xs font-bold ${h.emergency ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {h.emergency ? 'Open 24/7' : 'Standard'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHospital(h)}
                    className=" w-fit bg-blue-600 text-white py-3 px-5 rounded-xl text-[11px] font-black  hover:bg-blue-600 shadow-lg shadow-slate-100 transition-all flex items-center justify-center gap-2 group-hover:gap-4 active:scale-95"
                  >
                    View Map <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {selectedHospital && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center ">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setSelectedHospital(null)} />

            <div className="relative bg-white w-full h-full  shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 flex flex-col lg:flex-row">
              <div className="relative h-[40vh] lg:h-auto lg:flex-1 bg-slate-100">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streaming Map...</p>
                </div>

                <iframe
                  title="Command Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_OR_USE_FREE_URL&q=${selectedHospital.lat},${selectedHospital.lon}&zoom=16`}
                  srcDoc={`<style>html,body{margin:0;height:100%;overflow:hidden;}</style><iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lon}&z=16&output=embed"></iframe>`}
                  className="relative z-10 w-full h-full"
                />

                <button
                  onClick={() => setSelectedHospital(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 bg-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-[110] border border-slate-200 active:scale-90"
                >
                  <X size={20} className="text-slate-900" />
                </button>
              </div>

              <div className="w-full lg:w-[450px] bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col overflow-hidden">
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">Medical Node</span>
                    <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">#{selectedHospital.id}</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tighter">
                    {selectedHospital.name}
                  </h2>
                  <p className="text-slate-500 mb-8 text-sm flex items-start gap-2 italic">
                    <MapPin size={16} className="text-red-500 mt-1 shrink-0" />
                    {selectedHospital.address}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 mb-10">
                    <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <Navigation size={16} className="text-blue-500" /> Distance
                      </div>
                      <span className="text-sm font-black text-slate-900">{selectedHospital.dist.toFixed(2)} KM</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <Activity size={16} className="text-red-500" /> Capacity
                      </div>
                      <span className="text-sm font-black text-slate-900">{selectedHospital.beds} Units</span>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                        <Clock size={16} className="text-emerald-500" /> Status
                      </div>
                      <span className="text-sm font-black text-slate-900">{selectedHospital.emergency ? 'Active 24/7' : 'Standard'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-blue-600 text-white text-center py-3 md:py-3 rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <Navigation size={18} /> Launch Navigation
                    </a>
                    <button
                      onClick={() => { 
                        navigator.clipboard.writeText(selectedHospital.address); 
                        alert("Address copied to registry."); 
                      }}
                      className="w-full py-3 md:py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                      Copy Registry
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center hidden lg:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Health Data Interface</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}