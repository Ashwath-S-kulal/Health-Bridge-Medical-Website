import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Activity, ChevronDown } from "lucide-react";
import Header from "../Components/Header";

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
    <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800">
      <Header />

      {/* Main View Container */}
      <div className=" transition-all duration-300">
        <main className="max-w-screen mx-auto px-4 md:px-8 py-8">



          {/* Section Title & Dashboard Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-8">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Precautionary Protocols
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isListLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {isListLoading ? "Syncing Active Registries..." : "Verified Safety Controls"}
                </span>
              </div>
            </div>

            {/* Condition Filter Block */}
            <div className="w-full md:w-72 shrink-0">
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  disabled={isListLoading}
                  className={`w-full appearance-none bg-white border border-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all
                  ${isListLoading ? "bg-slate-50 text-slate-400 cursor-not-allowed italic" : "text-slate-700 cursor-pointer"}`}
                >
                  <option value="All">
                    {isListLoading ? "Updating Indexes..." : "All Pathologies"}
                  </option>
                  {!isListLoading && diseaseList.map((disease, idx) => (
                    <option key={idx} value={disease}>{disease}</option>
                  ))}
                </select>

                {/* Status Graphic Overlay */}
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  {isListLoading ? (
                    <div className="h-3 w-3 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Layout Logic Gate */}
          {loading && page === 1 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-3" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accessing Clinical Guidelines...</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Medical Protocols Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-indigo-200 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div>
                      {/* Protocol Meta Group */}
                      <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-3">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                          Protocol
                        </span>
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                          {item.Disease}
                        </h3>
                      </div>

                      {/* Direct Precaution Steps */}
                      <ul className="space-y-3.5">
                        {[item.Precaution_1, item.Precaution_2, item.Precaution_3, item.Precaution_4].map((step, i) => (
                          step && (
                            <li key={i} className="flex items-start gap-3 group/item">
                              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 group-hover/item:scale-110 transition-transform" />
                              <p className="text-xs text-slate-600 font-medium leading-relaxed first-letter:uppercase">
                                {step.replace(/_/g, ' ')}
                              </p>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls Layer */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-3 w-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Load More Guidelines</span>
                    )}
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