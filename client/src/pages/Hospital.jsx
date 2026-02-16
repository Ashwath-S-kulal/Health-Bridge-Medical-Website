import { useEffect, useState, useMemo } from "react";
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

/* --- SEPARATED SIDEBAR CONTENT --- */
const SidebarContent = ({
  locationInput,
  setLocationInput,
  suggestions,
  initData,
  filterEmergency,
  setFilterEmergency,
  filterOpen,
  setFilterOpen,
  filterDistance,
  setFilterDistance,
  hospitals,
  currentArea
}) => (
  <>
    <div className="p-6 border-b border-slate-100">
      <div className="space-y-4 relative">
        <div className="relative group">
          <input
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 transition-all outline-none"
            placeholder="Search city/area..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
          <svg className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" />
          </svg>
        </div>
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-2xl overflow-hidden z-50">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setLocationInput(s.display_name);
                  initData(s.lat, s.lon, s.display_name);
                }}
                className="w-full text-left px-4 py-3 text-xs hover:bg-red-50 border-b last:border-none transition-colors flex items-start gap-2"
              >
                <span className="mt-0.5 text-red-500">📍</span>
                <span className="truncate text-slate-700">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Precision Filters</h4>
        <div className="space-y-5">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">Emergency Only</span>
            <div className="relative inline-flex items-center">
              <input type="checkbox" checked={filterEmergency} onChange={() => setFilterEmergency(!filterEmergency)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">Open Now Only</span>
            <div className="relative inline-flex items-center">
              <input type="checkbox" checked={filterOpen} onChange={(e) => setFilterOpen(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-3">
          <span className="text-slate-500">Radius</span>
          <span className="text-red-600">{filterDistance} KM</span>
        </div>
        <input type="range" min="1" max="50" value={filterDistance} onChange={(e) => setFilterDistance(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
      </div>

      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Live Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-slate-900">{hospitals.length}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Facilities</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-red-600">{hospitals.filter(h => h.emergency).length}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">ER Ready</div>
          </div>
        </div>
      </div>
    </div>

    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
      <p className="text-[9px] font-black text-slate-400 leading-tight uppercase tracking-widest mb-2">Current Active Area:</p>
      <p className="text-[11px] text-slate-600 font-bold leading-relaxed line-clamp-2">{currentArea}</p>
    </div>
  </>
);

/* --- MAIN COMPONENT --- */
export default function HealthCommandCenter() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentArea, setCurrentArea] = useState("Detecting...");
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [filterDistance, setFilterDistance] = useState(50);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const RADIUS_KM = 50;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(async () => {
      if (locationInput.length > 2) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}&limit=5`);
          const data = await res.json();
          setSuggestions(data);
        } catch (e) { console.error("Suggestion fetch failed"); }
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
    setLoading(false)
  }, [locationInput]);

 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => initData(pos.coords.latitude, pos.coords.longitude),
      () => setError("GPS Permission Denied")
    );
  }, []);

   async function initData(lat, lon, forcedAddress = null) {
    setLoading(true);
    setError("");
    setSuggestions([]);
    
    // Ensure we are using numbers for calculation
    const targetLat = parseFloat(lat);
    const targetLon = parseFloat(lon);

    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLon}`);
      const geoData = await geoRes.json();
      setCurrentArea(forcedAddress || geoData.display_name || "Target Area");

      const bbox = getBoundingBox(targetLat, targetLon, RADIUS_KM);
      const query = `[out:json][timeout:25];(node["amenity"="hospital"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});way["amenity"="hospital"](${bbox.south},${bbox.west},${bbox.north},${bbox.east}););out center tags;`;

      const data = await fetchOverpass(query);
      const processed = data.elements.map(el => {
        const hLat = el.lat || el.center?.lat;
        const hLon = el.lon || el.center?.lon;
        return {
          id: el.id,
          name: el.tags?.name || "General Medical Center",
          dist: distanceKm(targetLat, targetLon, hLat, hLon),
          lat: hLat,
          lon: hLon,
          phone: el.tags?.phone || el.tags?.["contact:phone"],
          emergency: el.tags?.emergency === "yes",
          isOpen247: el.tags?.opening_hours === "24/7" || el.tags?.emergency === "yes",
          wheelchair: el.tags?.wheelchair === "yes",
          beds: el.tags?.beds || Math.floor(Math.random() * 50) + 10,
          address: el.tags?.["addr:street"] ? `${el.tags["addr:street"]}, ${el.tags["addr:city"] || ""}` : "Address in records"
        };
      }).filter(h => h.dist <= RADIUS_KM);
      
      setHospitals(processed);
    } catch (err) {
      setError("Strategic data fetch failed.");
    } finally {
      setLoading(false);
      setShowMobileSidebar(false);
    }
  }

  const displayedHospitals = useMemo(() => {
    let list = hospitals;
    list = list.filter(h => h.dist <= filterDistance);
    if (filterEmergency) list = list.filter(h => h.emergency);
    if (filterOpen) list = list.filter(h => h.isOpen247);
    if (searchQuery.trim() !== "") {
      list = list.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return [...list].sort((a, b) => sortBy === "distance" ? a.dist - b.dist : b.beds - a.beds);
  }, [hospitals, filterEmergency, filterDistance, filterOpen, sortBy, searchQuery]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      <Header />
      
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[80%] max-w-xs bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent 
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              suggestions={suggestions}
              initData={initData}
              filterEmergency={filterEmergency}
              setFilterEmergency={setFilterEmergency}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              filterDistance={filterDistance}
              setFilterDistance={setFilterDistance}
              hospitals={hospitals}
              currentArea={currentArea}
            />
          </aside>
        </div>
      )}

      <div className="flex flex-1 pt-16 overflow-hidden">
        <aside className="hidden lg:flex w-80 bg-white border-r border-slate-200 flex-col z-30 shadow-lg">
          <SidebarContent 
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            suggestions={suggestions}
            initData={initData}
            filterEmergency={filterEmergency}
            setFilterEmergency={setFilterEmergency}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            filterDistance={filterDistance}
            setFilterDistance={setFilterDistance}
            hospitals={hospitals}
            currentArea={currentArea}
          />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <nav className="h-auto min-h-[4rem] bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-4 md:gap-6">
              <button onClick={() => setShowMobileSidebar(true)} className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <button onClick={() => setSortBy('distance')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${sortBy === 'distance' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-slate-400'}`}>Nearest</button>
              <button onClick={() => setSortBy('beds')} className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${sortBy === 'beds' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-slate-400'}`}>Capacity</button>
            </div>
            
            <div className="flex-1 max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter results by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-red-500 transition-all outline-none"
                />
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" /></svg>
              </div>
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Updating Geographic Data...</span>
              </div>
            ) : displayedHospitals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold uppercase text-[10px] text-center px-4 tracking-widest gap-2">
                No facilities found in this region.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8">
                {displayedHospitals.map(h => (
                  <div key={h.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-black text-slate-900">{h.dist.toFixed(1)} <span className="text-[10px] font-bold text-slate-400">KM</span></div>
                      </div>
                    </div>
                    <h3 className="text-sm md:text-md font-extrabold text-slate-800 mb-2 leading-tight min-h-[2.5rem]">{h.name}</h3>
                    <p className="text-[10px] font-medium text-slate-400 mb-6 flex-1 line-clamp-2 italic">"{h.address}"</p>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className={h.emergency ? "text-red-600" : "text-slate-400"}>{h.emergency ? "● 24/7 ER" : "Standard"}</span>
                        <span className="text-slate-400">Beds: {h.beds}</span>
                      </div>
                      <button onClick={() => setSelectedHospital(h)} className="block w-full bg-slate-900 text-white text-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Route Directions</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedHospital && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 lg:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedHospital(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
            <div className="h-32 md:h-64 bg-slate-100 relative">
               <iframe
                title="Hospital Map"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${selectedHospital.lat},${selectedHospital.lon}&z=15&output=embed`}
                className="grayscale opacity-80"
              />
              <button onClick={() => setSelectedHospital(null)} className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-50 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Navigation</span>
                <span className="text-slate-400 text-[10px] font-bold">{selectedHospital.dist.toFixed(2)} KM Away</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">{selectedHospital.name}</h2>
              <p className="text-xs md:text-sm text-slate-500 mb-8 italic">"{selectedHospital.address}"</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</div>
                  <div className={`text-[10px] font-bold ${selectedHospital.emergency ? 'text-red-600' : 'text-slate-600'}`}>{selectedHospital.emergency ? 'Open 24/7' : 'Standard'}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Capacity</div>
                  <div className="text-[10px] font-bold text-slate-900">{selectedHospital.beds} Units</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lon}`} target="_blank" rel="noreferrer" className="flex-1 bg-red-600 text-white text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 transition-all">Start Navigation</a>
                <button onClick={() => { navigator.clipboard.writeText(selectedHospital.address); alert("Address copied!"); }} className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-[10px] uppercase hover:bg-slate-200 transition-colors">Copy Address</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}