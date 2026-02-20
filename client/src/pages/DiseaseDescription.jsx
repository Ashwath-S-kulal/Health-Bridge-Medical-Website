import { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Search } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      {/* Main Container: Dynamic margin based on Sidebar */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-12">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>

          {/* Header Section: Stacks on mobile, row on tablet+ */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg shadow-indigo-100">
                  <BookOpen className="text-cyan-400 w-5 h-5" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">
                  Medical <span className="text-indigo-600">Encyclopedia</span>
                </h1>
              </div>
              <p className="text-slate-500 text-sm font-medium max-w-lg">
                Access official descriptions and diagnostic summaries from our central clinical database.
              </p>
            </div>

            {/* Dropdown/Filter Section */}
            <div className="w-full xl:max-w-xs">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                Select Pathology
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Search size={16} />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  disabled={isListLoading}
                  className={`w-full appearance-none bg-white border border-slate-200 text-slate-700 py-4 pl-12 pr-10 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-sm ${isListLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <option value="All">{isListLoading ? "Scanning Database..." : "All Conditions"}</option>
                  {!isListLoading && diseaseList.map((disease, idx) => (
                    <option key={idx} value={disease}>{disease}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white border border-slate-100 rounded-[2.5rem]">
              <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Decrypting Medical Records...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {item.Disease}
                      </h2>
                    </div>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                      {item.Description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Entry</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-bold">No records found for "{selectedFilter}"</p>
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