import { useState, useEffect } from "react";
import Header from "../Components/Header";
import { 
  Database, 
  Binary, 
  FlaskConical, 
  LayoutGrid, 
  Fingerprint, 
  Dna,
  Search
} from "lucide-react";

const SymptomNavigator = () => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [uniqueDiseases, setUniqueDiseases] = useState([]);
  const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);

const [cache, setCache] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/symptoms/list`)
      .then(res => res.json())
      .then(data => {
        setUniqueDiseases(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const handleDiseaseChange = async (e) => {
    const disease = e.target.value;
    setSelectedDisease(disease);
    if (!disease) { 
      setDiseaseSymptoms([]); 
      return; 
    }

    // 2. CHECK CACHE FIRST
    if (cache[disease]) {
      setDiseaseSymptoms(cache[disease]);
      return;
    }

    setFetchingDetails(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/symptoms?disease=${encodeURIComponent(disease)}`);
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];
      
      // 3. STORE IN CACHE
      setCache(prev => ({ ...prev, [disease]: results }));
      setDiseaseSymptoms(results);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetchingDetails(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-300/40">
      {/* CSS Injection for the custom loading bar animation */}
      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-loading-bar {
          animation: loading-slide 1.5s infinite linear;
        }
      `}</style>

      <Header />

      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20 pointer-events-none z-0"></div>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-slate-200 pb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-cyan-600 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <Dna size={24} className="animate-pulse" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.4em]">
                Symptoms Data Core
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
              SYMPTOM <span className="text-cyan-600">COLLECTIONS</span>
            </h1>
          </div>

          <div className="w-full md:w-96">
            <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <Search size={12} /> Identifier Selection
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-cyan-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition"></div>
              <select
                value={selectedDisease}
                onChange={handleDiseaseChange}
                disabled={loading}
                className="relative w-full bg-white border border-slate-300 py-4 px-6 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-cyan-500 outline-none appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loading ? "SCANNING DATABASE..." : "SELECT CONDITION..."}
                </option>
                {uniqueDiseases.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {!selectedDisease ? (
          /* Empty State - Dashboard Stats */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Database />, title: "Dataset", val: "Verified" },
              { icon: <Binary />, title: "Protocol", val: "v4.0.2" },
              { icon: <FlaskConical />, title: "Lab Status", val: "Online" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col items-center text-center shadow-sm">
                <div className="text-cyan-600 mb-4">{stat.icon}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {stat.title}
                </div>
                <div className="text-xl font-black text-slate-900">{stat.val}</div>
              </div>
            ))}
          </div>
        ) : fetchingDetails ? (
          /* Fixed Loader Animation */
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1/3 h-full bg-cyan-500 animate-loading-bar"></div>
            </div>
            <span className="text-[10px] text-cyan-600 font-bold tracking-[0.5em] animate-pulse">
              DECRYPTING CLINICAL PATTERNS
            </span>
          </div>
        ) : (
          /* Results Grid */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Fingerprint size={18} className="text-cyan-600" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Signature: <span className="text-cyan-600 ml-1">{selectedDisease}</span>
                </span>
              </div>

              <div className="bg-white border border-slate-300 px-6 py-3 rounded-2xl flex items-center gap-3">
                <LayoutGrid size={18} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Variants Found: <span className="text-slate-900 ml-1">{diseaseSymptoms.length}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {diseaseSymptoms.map((row, idx) => (
                <div key={idx} className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-cyan-500/50 transition-all shadow-sm hover:shadow-md">
                  {/* Background Index Number - Adjusted for readability */}
                  <span className="absolute right-4 top-2 text-6xl font-black text-slate-100 pointer-events-none select-none">
                    {idx + 1}
                  </span>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Symptom Bundle
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {row.map((sym, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 uppercase">
                          {sym}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Analysis Verified
                      </span>
                      <Binary size={14} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SymptomNavigator;