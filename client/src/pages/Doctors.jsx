import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Loader2, Award, ShieldCheck, Sparkles, Filter, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

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
    <div>
      <Header />
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">

        {/* Dense Workspace Frame */}
        <div className="flex-1 w-full px-3 md:px-14">
          <main className="max-w-screen mx-auto p-3 sm:p-5">

            {/* Compact Header Dashboard Row */}
            <header className="pt-4 md:pt-6 mb-4 border-b border-slate-200/60 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  {/* Micro Clinical Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F6CBD]/5 text-[#0F6CBD] text-[9px] font-bold tracking-wider mb-2 border border-[#0F6CBD]/10 uppercase">
                    <Sparkles size={10} className="text-emerald-500" /> Clinical Directory
                  </div>
                  <h1 className="text-lg font-bold tracking-tight text-[#0F172A] leading-tight">
                    Our Expert <span className="text-[#0F6CBD]">Specialists</span>
                  </h1>
                  <p className="text-[11px] text-[#64748B] mt-0.5 hidden md:block">
                    Verify credentials, specialized domains, and registry listings.
                  </p>
                </div>

                {/* High-Density Search Tools */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64 group">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-[#0F6CBD] transition-colors"
                      size={12}
                    />
                    <input
                      type="text"
                      placeholder="Search by physician or keyword..."
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:border-[#0F6CBD] focus:ring-2 focus:ring-[#0F6CBD]/5 transition-all font-semibold text-xs text-[#0F172A] placeholder-[#64748B]/60"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Mobile Adaptive Action Trigger */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden p-2 bg-white border border-slate-200 rounded-lg text-[#0F172A] shadow-sm hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    {showFilters ? <X size={14} /> : <Filter size={14} />}
                  </button>
                </div>
              </div>
            </header>

            {/* Dense Contextual Filter Grid */}
            <div className={`${showFilters ? 'grid' : 'hidden'} md:grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 p-4 bg-white border border-slate-200/80 rounded-lg shadow-sm transition-all`}>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Medical Field</label>
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#0F6CBD] focus:bg-white focus:ring-2 focus:ring-[#0F6CBD]/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Specialties</option>
                  {uniqueSpecialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Accreditation</label>
                <select
                  value={filterEducation}
                  onChange={(e) => setFilterEducation(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#0F6CBD] focus:bg-white focus:ring-2 focus:ring-[#0F6CBD]/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Any Education</option>
                  <option value="MBBS">MBBS</option>
                  <option value="MD">MD</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Clinical Tenure</label>
                <select
                  value={filterExp}
                  onChange={(e) => setFilterExp(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#0F6CBD] focus:bg-white focus:ring-2 focus:ring-[#0F6CBD]/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Any Experience</option>
                  {[5, 10, 15, 20].map(v => <option key={v} value={v}>{v}+ Years</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Registry Status</label>
                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#0F6CBD] focus:bg-white focus:ring-2 focus:ring-[#0F6CBD]/5 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Verified Only</option>
                </select>
              </div>
            </div>

            {/* Dynamic State Entry Logic */}
            {loading ? (
              <div className="flex flex-col items-center py-16 justify-center bg-white border border-slate-200 rounded-lg shadow-sm">
                <Loader2 className="animate-spin text-[#0F6CBD] w-6 h-6 mb-2.5" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Syncing Specialist Registry...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
                {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => navigate(`/doctors/${doctor._id}`, { state: { doctor } })}
                    className="group bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[#0F6CBD]/30 transition-all flex flex-col items-center text-center sm:items-start sm:text-left"
                  >
                    {/* Dense Avatar Wrapper */}
                    <div className="relative mb-3">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-50 shadow-sm group-hover:scale-[1.02] transition-transform"
                      />
                      {doctor.verified && (
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-0.5 rounded-full border border-white shadow-sm" title="Verified Specialist">
                          <ShieldCheck size={10} strokeWidth={2.5} />
                        </div>
                      )}
                    </div>

                    {/* Specialist Profile Details */}
                    <span className="text-[#0F6CBD] font-bold text-[9px] uppercase tracking-wider mb-1 bg-[#0F6CBD]/5 px-2 py-0.5 rounded">
                      {doctor.specialty}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-[#0F6CBD] transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-slate-400 text-[11px] font-medium mb-4">
                      {doctor.education}
                    </p>

                    {/* Micro Action Cards Footer */}
                    <div className="mt-auto w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Award size={12} className="text-slate-400 shrink-0" /> {doctor.experience} Exp
                      </span>
                      <span className="text-[#0F6CBD] font-bold text-[10px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        View Profile
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12 border border-dashed border-slate-200 bg-slate-50 rounded-lg p-5">
                    <p className="text-slate-400 font-medium text-xs">No specialized practitioners match your specific filters.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

    </div>

  );
};

export default DoctorDirectory;