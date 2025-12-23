import { useState, useEffect, useMemo } from "react";
import Header from "../Components/Header";

const DiseaseInfo = () => {
  const [data, setData] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // 1. Fetch the unique list of diseases for the dropdown
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URI}/api/diseasedesc/list`)
      .then(res => res.json())
      .then(list => setDiseaseList(list))
      .catch(err => console.error("Error fetching list:", err));
  }, []);

  // 2. Fetch the actual content whenever the filter changes
  useEffect(() => {
    setLoading(true);
    const queryParam = selectedFilter !== "All" ? `?name=${selectedFilter}` : "";

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
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <Header />
      <div className="w-full mx-auto pt-16">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Medical <span className="text-indigo-600">Encyclopedia</span>
            </h1>
            <p className="text-slate-500 mt-2">Browse the official database or filter by condition.</p>
          </div>

          <div className="relative min-w-[280px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Filter by Disease
            </label>
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3 px-4 pr-10 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium"
              >
                <option value="All">All Diseases</option>
                {diseaseList.map((disease, idx) => (
                  <option key={idx} value={disease}>{disease}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="mt-4 text-indigo-600 font-bold uppercase tracking-widest">
              Accessing Medical Records...
            </div>
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {data.map((item, idx) => (
              <div
                key={item._id || idx}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Icon */}
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-3">{item.Disease}</h2>
                <p className="text-slate-500 leading-relaxed">{item.Description}</p>

             
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseInfo;