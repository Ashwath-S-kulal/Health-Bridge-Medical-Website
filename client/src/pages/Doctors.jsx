import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Phone, Mail, MessageCircle, MapPin, Star, Clock, GraduationCap,
  Calendar, Search, Loader2, Award, ShieldCheck, ArrowRight,
  Sparkles, ShieldAlert, Filter, X, Share2, Languages, User
} from 'lucide-react';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State for Modal

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

  const handleShare = async (e, doctor) => {
    e.stopPropagation(); // Prevent modal from opening when sharing
    const shareData = {
      title: `Dr. ${doctor.name} - ${doctor.specialty}`,
      text: `Consult with ${doctor.name}, ${doctor.specialty}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Link copied!");
      }
    } catch (err) { console.error("Error sharing:", err); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-20">
      <Header />

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50/60 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-rose-50/60 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <header className="pt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest mb-4 border border-indigo-100 uppercase">
                <Sparkles size={12} /> Medical Directory
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Our Expert <span className="text-indigo-600">Specialists</span>
              </h1>
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
              <input
                type="text"
                placeholder="Search name or specialty..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Filters Area */}
        <div className="mb-12 p-5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-xl shadow-indigo-500/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600">
            <option value="">All Specialties</option>
            {uniqueSpecialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
          </select>
          <select value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600">
            <option value="">Any Education</option>
            <option value="MBBS">MBBS</option><option value="MD">MD</option><option value="PhD">PhD</option>
          </select>
          <select value={filterExp} onChange={(e) => setFilterExp(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600">
            <option value="">Any Experience</option>
            {[5, 10, 15, 20].map(v => <option key={v} value={v}>{v}+ Years</option>)}
          </select>
          <select value={filterVerified} onChange={(e) => setFilterVerified(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600">
            <option value="">All Statuses</option>
            <option value="true">Verified Only</option>
          </select>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-32">
            <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-2" />
            <p className="font-bold text-slate-400 text-sm">Loading Specialists...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                onClick={() => navigate(`/doctor/${doctor._id}`, { state: { doctor } })}
                className="group bg-white border border-slate-200 rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >

                <div className="relative mb-4">
                  <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-inner" />
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

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components
const Badge = ({ icon, text, color }) => (
  <span className={`${color} px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5`}>
    {icon} {text}
  </span>
);

const InfoBlock = ({ icon, label, value }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[13px] font-bold text-slate-700 truncate">{value || 'Not provided'}</p>
    </div>
  </div>
);

export default DoctorDirectory;