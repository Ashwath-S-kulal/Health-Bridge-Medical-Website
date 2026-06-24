import { useState, useEffect } from "react";
import Header from "../Components/Header";
import {
  Database,
  Binary,
  FlaskConical,
  LayoutGrid,
  Fingerprint,
  Dna,
  Search,
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SymptomNavigator = () => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [uniqueDiseases, setUniqueDiseases] = useState([]);
  const [diseaseSymptoms, setDiseaseSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [cache, setCache] = useState({});
  const navigate = useNavigate();

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

    if (cache[disease]) {
      setDiseaseSymptoms(cache[disease]);
      return;
    }

    setFetchingDetails(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/symptoms?disease=${encodeURIComponent(disease)}`);
      const data = await res.json();
      const results = Array.isArray(data) ? data : [];
      setCache(prev => ({ ...prev, [disease]: results }));
      setDiseaseSymptoms(results);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetchingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800">
      <Header />

      {/* Main Content Pane */}
      <div className="transition-all duration-300">

        <main className="max-w-screen mx-auto px-4 md:px-8 py-8">


          {/* Section Header Controls */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 border-b border-slate-200 pb-6 mb-8">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Symptom Collections
              </h1>
              <div className="flex items-center gap-2 text-cyan-600 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                  Symptoms Core Engine
                </span>
              </div>
            </div>

            {/* Pathology Selection Dropdown */}
            <div className="w-full md:w-72 shrink-0">
              <div className="relative">
                <select
                  value={selectedDisease}
                  onChange={handleDiseaseChange}
                  disabled={loading}
                  className="w-full bg-white border border-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-slate-800 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
                >
                  <option value="">
                    {loading ? "Scanning Registries..." : "Select Pathology..."}
                  </option>
                  {uniqueDiseases.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Display Wrapper */}
          {!selectedDisease ? (
            /* Empty/Initial Analytics Overview States */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Database size={16} />, title: "Dataset Registry", val: "Verified Records" },
                { icon: <Binary size={16} />, title: "Protocol Schema", val: "v4.0.2 Engine" },
                { icon: <FlaskConical size={16} />, title: "System Status", val: "Operational" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-cyan-200 transition-colors">
                  <div className="p-2.5 bg-cyan-50/60 text-cyan-600 rounded-lg border border-cyan-100">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {stat.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : fetchingDetails ? (
            /* Loading Context View */
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-3" />
              <span className="text-[10px] text-cyan-600 font-bold tracking-wider uppercase">
                Mapping Clinical Presentation Variants...
              </span>
            </div>
          ) : (
            /* Symptom Results Grid View */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Context Meta Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide">
                  <Fingerprint size={14} className="text-cyan-600" />
                  <span>ID Target: <span className="text-slate-800 font-semibold normal-case ml-0.5">{selectedDisease}</span></span>
                </div>

                <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <LayoutGrid size={14} className="text-slate-400" />
                  <span>Identified Bundles: <span className="text-slate-800 font-semibold ml-0.5">{diseaseSymptoms.length}</span></span>
                </div>
              </div>

              {/* Diagnostic Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {diseaseSymptoms.map((row, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Bundle Descriptor Title Bar */}
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Presentation Variant
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-500 transition-colors">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Array Content Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {row.map((sym, i) => (
                          <span
                            key={i}
                            className="bg-slate-50 text-slate-600 border border-slate-200/60 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footing Validation Stamp */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Clinical Verification</span>
                      <Binary size={12} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default SymptomNavigator;