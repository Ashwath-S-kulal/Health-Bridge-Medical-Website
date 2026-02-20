import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Loader2, Award, ShieldCheck, Sparkles, Filter, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Toggle for mobile filters

  // Filter States
  const [filterExp, setFilterExp] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterVerified, setFilterVerified] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/doctors/getdoctor`);
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const uniqueSpecialties = [...new Set(doctors.map(doc => doc.specialty))].filter(Boolean);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExp = filterExp === "" || doc.experience?.toLowerCase().includes(filterExp.toLowerCase());
    const matchesEdu = filterEducation === "" || doc.education?.toLowerCase().includes(filterEducation.toLowerCase());
    const matchesSpec = filterSpecialty === "" || doc.specialty === filterSpecialty;
    const matchesVerified = filterVerified === "" || (filterVerified === "true" ? doc.verified === true : doc.verified === false);
    return matchesSearch && matchesExp && matchesEdu && matchesSpec && matchesVerified;
  });

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      
      {/* Responsive Main Content: ml-0 on mobile, lg:ml-64 on desktop */}
      <div className="flex-1 lg:ml-64 transition-all duration-300 pb-20">

        {/* Background Decorations */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] w-[50%] md:w-[30%] h-[30%] rounded-full bg-indigo-50/60 blur-[80px] md:blur-[100px]" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[50%] md:w-[30%] h-[30%] rounded-full bg-rose-50/60 blur-[80px] md:blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="pt-8 md:pt-16 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest mb-3 border border-indigo-100 uppercase">
                  <Sparkles size={12} /> Medical Directory
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  Our Expert <span className="text-indigo-600">Specialists</span>
                </h1>
              </div>

              {/* Search and Mobile Filter Toggle */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search doctor..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 active:bg-slate-50"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>
            </div>
          </header>

          {/* Responsive Filters Area */}
          <div className={`${showFilters ? 'grid' : 'hidden'} md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 p-4 md:p-5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-indigo-500/5 transition-all`}>
            <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100">
              <option value="">All Specialties</option>
              {uniqueSpecialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
            </select>
            <select value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
              <option value="">Any Education</option>
              <option value="MBBS">MBBS</option><option value="MD">MD</option><option value="PhD">PhD</option>
            </select>
            <select value={filterExp} onChange={(e) => setFilterExp(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
              <option value="">Any Experience</option>
              {[5, 10, 15, 20].map(v => <option key={v} value={v}>{v}+ Years</option>)}
            </select>
            <select value={filterVerified} onChange={(e) => setFilterVerified(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none">
              <option value="">All Statuses</option>
              <option value="true">Verified Only</option>
            </select>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="flex flex-col items-center py-20 md:py-32">
              <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-2" />
              <p className="font-bold text-slate-400 text-sm">Loading Specialists...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => navigate(`/doctor/${doctor._id}`, { state: { doctor } })}
                  className="group bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center md:items-start md:text-left"
                >
                  <div className="relative mb-4">
                    <img src={doctor.image} alt={doctor.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-slate-50 shadow-inner" />
                    {doctor.verified && (
                      <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                        <ShieldCheck size={12} />
                      </div>
                    )}
                  </div>
                  <p className="text-indigo-600 font-black text-[9px] uppercase tracking-widest mb-1">{doctor.specialty}</p>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{doctor.name}</h3>
                  <p className="text-slate-400 text-[11px] font-medium mb-4">{doctor.education}</p>
                  <div className="mt-auto w-full pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><Award size={12} /> {doctor.experience} Exp</span>
                    <span className="text-indigo-600 group-hover:underline">View Profile</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20">
                    <p className="text-slate-400 font-bold">No doctors found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDirectory;