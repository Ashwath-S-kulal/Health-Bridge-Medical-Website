import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Activity } from "lucide-react";

const DiseasePrecautions = () => {
  const [data, setData] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
    const [isListLoading, setIsListLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch the Dropdown List
  useEffect(() => {
    setIsListLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URI}/api/precaution/list`)
      .then((res) => res.json())
      .then((list) => {
        setDiseaseList(list);
        setIsListLoading(false);
      })
      .catch((err) => {
        console.error("List Fetch Error:", err);
        setIsListLoading(false);
      });
  }, []);

  // 2. Fetch Precaution Data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const diseaseQuery = selectedFilter !== "All" ? `&disease=${encodeURIComponent(selectedFilter)}` : "";
        const url = `${import.meta.env.VITE_BASE_URI}/api/precaution?page=${page}${diseaseQuery}`;

        const res = await fetch(url, { signal });
        const result = await res.json();

        if (result.success) {
          setData((prev) => (page === 1 ? result.data : [...prev, ...result.data]));
          setHasMore(result.currentPage < result.totalPages);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error("Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [selectedFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Sidebar />
      
      {/* Main Container: Dynamic margin for Desktop Sidebar */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <main className=" mx-auto p-5 sm:p-8 md:p-12">
          
          {/* Navigation */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Directory
          </button>

          {/* Header Section */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8">
             <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Precautionary <span className="text-emerald-600">Measures</span>
            </h1>
            <div className="flex items-center gap-2 mt-5">
              <span className={`h-2 w-2 rounded-full ${isListLoading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {isListLoading ? "System Scanning..." : "Safety protocols"}
              </span>
            </div>
          </div>

            {/* Filter Dropdown */}
            <div className="relative w-full xl:max-w-xs">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                Filter conditions
              </label>
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  disabled={isListLoading}
                  className={`w-full appearance-none bg-white border border-slate-200 py-4 px-5 rounded-2xl shadow-sm outline-none transition-all font-bold text-sm
                    ${isListLoading
                      ? "cursor-not-allowed opacity-60 text-slate-400 bg-slate-50 italic"
                      : "cursor-pointer text-slate-700 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                    }`}
                >
                  <option value="All">
                    {isListLoading ? "SEARCHING..." : "All Pathologies"}
                  </option>
                  {!isListLoading && diseaseList.map((disease, idx) => (
                    <option key={idx} value={disease}>{disease}</option>
                  ))}
                </select>

                {/* Dropdown Icon / Loader */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {isListLoading ? (
                    <div className="h-4 w-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                  ) : (
                    <Activity size={16} className="text-slate-300" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          {loading && page === 1 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-emerald-500 mb-4"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing records...</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {data.map((item, idx) => (
                  <div 
                    key={item._id || idx} 
                    className="group bg-white border border-slate-100 p-6 sm:p-10 rounded-[2.5rem] transition-all hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">
                        Protocol
                      </span>
                      <h3 className="text-slate-800 font-black italic uppercase tracking-tight text-lg sm:text-xl">
                        {item.Disease}
                      </h3>
                    </div>
                    
                    <ul className="space-y-5">
                      {[item.Precaution_1, item.Precaution_2, item.Precaution_3, item.Precaution_4].map((step, i) => (
                        step && (
                          <li key={i} className="flex items-start gap-4 group/item">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 group-hover/item:scale-150 transition-transform shrink-0" />
                            <p className="text-slate-500 text-sm sm:text-base font-medium leading-relaxed first-letter:uppercase">
                              {step.replace(/_/g, ' ')}
                            </p>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="h-3 w-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : "Load More Guidelines"}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DiseasePrecautions;