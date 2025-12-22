import { useState, useEffect } from "react";
import Header from "../Components/Header";

const DiseasePrecautions = () => {
  const [data, setData] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch unique names for dropdown
  useEffect(() => {
    fetch('/api/precaution/list')
      .then(res => res.json())
      .then(list => setDiseaseList(list))
      .catch(err => console.error("List Fetch Error:", err));
  }, []);

  // Fetch precaution data based on filter
  useEffect(() => {
    setLoading(true);
    const query = selectedFilter !== "All" ? `?disease=${selectedFilter}` : "";
    
    fetch(`/api/precaution/${query}`)
      .then(res => res.json())
      .then(results => {
        setData(results);
        setLoading(false);
      })
      .catch(err => {
        console.error("Data Fetch Error:", err);
        setLoading(false);
      });
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <Header />
      <div className="max-w-6xl mx-auto pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Safety protocols</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Precautionary <span className="text-emerald-600">Measures</span>
            </h1>
          </div>
          
          <div className="relative min-w-[300px]">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3.5 px-5 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none cursor-pointer font-semibold"
            >
              <option value="All">All Conditions</option>
              {diseaseList.map((disease, idx) => (
                <option key={idx} value={disease}>{disease}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {data.map((item) => (
              <div 
                key={item._id} 
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden flex flex-col"
              >
                <div className="bg-slate-50 p-6 border-b border-slate-100 group-hover:bg-emerald-50 transition-colors">
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 capitalize">
                    {item.Disease}
                  </h2>
                </div>

                <div className="p-6 space-y-4 flex-grow">
                  {/* Manually mapping the 4 precaution fields from your model */}
                  {[1, 2, 3, 4].map((num) => {
                    const fieldName = `Precaution_${num}`;
                    const val = item[fieldName];
                    
                    return val ? (
                      <div key={num} className="flex items-start gap-3 group/item">
                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center group-hover/item:bg-emerald-500 transition-colors">
                          <svg className="h-3 w-3 text-emerald-600 group-hover/item:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600 font-medium capitalize group-hover/item:text-slate-900 transition-colors">
                          {val}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="h-1.5 w-0 bg-emerald-500 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseasePrecautions;