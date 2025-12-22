import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Phone, Mail, MessageCircle, MapPin, Star, Clock, GraduationCap,
  Calendar, Search, Loader2, Award, ShieldCheck, Globe, ArrowRight,
  ExternalLink, Sparkles, ShieldAlert, Filter, X, Share2, Stethoscope, CheckCircle,
  Languages
} from 'lucide-react';
import Header from '../Components/Header';

const DoctorDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterExp, setFilterExp] = useState("");
  const [filterEducation, setFilterEducation] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterVerified, setFilterVerified] = useState(""); // New Filter State

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/doctors/getdoctor');
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const uniqueSpecialties = [...new Set(doctors.map(doc => doc.specialty))].filter(Boolean);

  // Enhanced Filtering Logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExp = filterExp === "" || doc.experience?.toLowerCase().includes(filterExp.toLowerCase());
    const matchesEdu = filterEducation === "" || doc.education?.toLowerCase().includes(filterEducation.toLowerCase());
    const matchesSpec = filterSpecialty === "" || doc.specialty === filterSpecialty;

    // Verification logic
    const matchesVerified = filterVerified === "" ||
      (filterVerified === "true" ? doc.verified === true : doc.verified === false);

    return matchesSearch && matchesExp && matchesEdu && matchesSpec && matchesVerified;
  });

  const handleShare = async (doctor) => {
    const shareData = {
      title: `Dr. ${doctor.name} - ${doctor.specialty}`,
      text: `Consult with ${doctor.name}, ${doctor.specialty}. Contact: ${doctor.phone}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-20">
      <Header />
      <div className="fixed inset-0 -z-10 overflow-hidden ">
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
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Our Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Specialists</span>
              </h1>
            </div>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Updated Filter Section */}
        <div className="mb-12 p-5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-xl shadow-indigo-500/5">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Filter size={16} className="text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Refine Search</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

            {/* Specialty Dropdown */}
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Specialties</option>
              {uniqueSpecialties.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>

            {/* Education Dropdown */}
            <select
              value={filterEducation}
              onChange={(e) => setFilterEducation(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Any Education</option>
              <option value="MBBS">MBBS</option>
              <option value="MD">MD</option>
              <option value="PhD">PhD</option>
              <option value="FCPS">FCPS</option>
            </select>

            {/* Experience Dropdown */}
            <select
              value={filterExp}
              onChange={(e) => setFilterExp(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">Any Experience</option>
              {Array.from({ length: 25 }, (_, i) => i + 1).map((val) => (
                <option key={val} value={val}>
                  {val} {val === 1 ? "Year" : "Years"}
                </option>
              ))}


            </select>

            {/* Verification Status Dropdown */}
            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="true">Verified Only</option>
              <option value="false">Not Verified</option>
            </select>

          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-indigo-600 w-10 h-10 mb-4" />
            <p className="font-bold text-slate-400 animate-pulse text-sm">Synchronizing database...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="text-slate-300" size={24} />
            </div>
            <p className="text-slate-400 font-bold">No specialists match your current filters.</p>
            <button
              onClick={() => { setFilterExp(""); setFilterEducation(""); setFilterSpecialty(""); setFilterVerified(""); setSearchTerm(""); }}
              className="mt-4 text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-700 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="group bg-white border border-slate-200 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden">

                {/* Header Section */}
                <div className="p-6 pb-4 flex gap-6">
                  <div className="relative shrink-0">
                    <img
                      src={doctor.image || 'https://via.placeholder.com/150'}
                      alt={doctor.name}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-md border-2 border-slate-50"
                    />
                    {doctor.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg border-2 border-white">
                        <ShieldCheck size={14} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{doctor.specialty}</p>
                        {doctor.verified ? (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck size={10} /> VERIFIED
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldAlert size={10} /> PENDING
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-amber-600">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{doctor.rating || '5.0'}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 truncate mb-2">{doctor.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge icon={<Award size={12} />} text={`${doctor.experience}`} color="bg-amber-50/60 text-amber-700" />
                      <Badge icon={<GraduationCap size={12} />} text={doctor.education} color="bg-blue-50/60 text-blue-700" />
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.map((lang, index) => (
                          <Badge
                            key={index}
                            icon={<Languages size={12} />}
                            text={lang}
                            color="bg-emerald-50/60 text-emerald-700 border border-emerald-100"
                          />
                        ))}
                      </div>                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-50 bg-slate-50/30">
                  <InfoBlock icon={<Mail size={14} className="text-indigo-400" />} label="Email Address" value={doctor.email} />
                  <InfoBlock icon={<Phone size={14} className="text-indigo-400" />} label="Direct Phone" value={doctor.phone} />
                  <InfoBlock icon={<MessageCircle size={14} className="text-emerald-500" />} label="WhatsApp" value={doctor.whatsapp} />
                  <InfoBlock icon={<Calendar size={14} className="text-rose-400" />} label="Availability" value={doctor.contactDays} />
                  <InfoBlock icon={<Clock size={14} className="text-slate-400" />} label="Office Hours" value={doctor.contactTime} />
                  <InfoBlock icon={<MapPin size={14} className="text-slate-400" />} label="Clinic Location" value={doctor.address} />
                </div>

                {/* Bio & Footer */}
                <div className="p-6 pt-4 mt-auto">
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm mb-6">
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 italic">
                      "{doctor.about || 'Specialist practitioner dedicated to providing high-quality medical care.'}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a href={`tel:${doctor.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md">
                      <Phone size={14} /> Call Now
                    </a>
                    <a href={`https://wa.me/${doctor.whatsapp}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md">
                      <MessageCircle size={14} /> Message
                    </a>
                    <button
                      onClick={() => handleShare(doctor)}
                      className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Badge = ({ icon, text, color }) => (
  <span className={`${color} px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-current/10`}>
    {icon} {text}
  </span>
);

const InfoBlock = ({ icon, label, value }) => (
  <div className="flex gap-3 min-w-0">
    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/50 shadow-sm flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-[11px] font-bold text-slate-700 truncate">{value || 'Not provided'}</p>
    </div>
  </div>
);

export default DoctorDirectory;