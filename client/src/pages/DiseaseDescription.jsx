import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, Search } from "lucide-react";
import Header from "../Components/Header";

const DiseaseInfo = () => {
  const [data, setData] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsListLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URI}/api/diseasedesc/list`)
      .then(res => res.json())
      .then(list => {
        setDiseaseList(list);
        setIsListLoading(false);
      })
      .catch(err => {
        console.error("Error fetching list:", err);
        setIsListLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const queryParam = selectedFilter !== "All" ? `?name=${encodeURIComponent(selectedFilter)}` : "";

    fetch(`${import.meta.env.VITE_BASE_URI}/api/diseasedesc/${queryParam}`)
      .then(res => res.json())
      .then(results => {
        setData(results);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800">
      <Header />

      {/* Dense Workspace Frame */}
      <div className="flex-1 transition-all duration-300">
        <main className="max-w-screen mx-auto p-3 sm:p-5">

          {/* Minimalist Navigation Action */}


          {/* Compact Dashboard Control Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-5">
            <div className="flex items-center gap-2.5">

              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Medical <span className="text-indigo-600">Encyclopedia</span>
                </h1>
                <p className="text-slate-500 text-[11px] font-medium hidden md:block">
                  Verified functional profiles and diagnostic summaries.
                </p>
              </div>
            </div>

            {/* Compact Filter Tool */}
            <div className="w-full sm:w-60 shrink-0">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Search size={12} />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  disabled={isListLoading}
                  className={`w-full appearance-none bg-white border border-slate-200 py-1.5 pl-8 pr-8 rounded-lg text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all
                  ${isListLoading ? 'bg-slate-50 text-slate-400 cursor-not-allowed italic' : 'text-slate-700 cursor-pointer'}`}
                >
                  <option value="All">
                    {isListLoading ? "Syncing..." : "All Conditions"}
                  </option>
                  {!isListLoading && diseaseList.map((disease, idx) => (
                    <option key={idx} value={disease}>{disease}</option>
                  ))}
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Entry Logic Router */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-2.5" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Decrypting Repositories...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="group bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors first-letter:uppercase mb-1.5">
                        {item.Disease}
                      </h2>
                      <p className="text-slate-500 text-[11px] leading-normal font-medium line-clamp-3 group-hover:line-clamp-none transition-all">
                        {item.Description}
                      </p>
                    </div>

                    {/* Dense Ledger Stamp */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                        Verified Ledger Entry
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                  <p className="text-slate-400 font-medium text-xs">
                    No records match: <span className="font-semibold text-slate-600">"{selectedFilter}"</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DiseaseInfo;