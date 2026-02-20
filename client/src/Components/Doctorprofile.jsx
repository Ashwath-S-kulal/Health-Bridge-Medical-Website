import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MessageCircle, MapPin, Star, Clock,
  GraduationCap, Calendar, Award, ShieldCheck, Share2, Languages, X
} from 'lucide-react';
import Sidebar from './Sidebar';

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) return <div className="p-20 text-center font-bold">Doctor not found.</div>;

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      
      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300 pb-20">
                <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Back to Directory</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                <Share2 size={18} />
              </button>
              <a 
                href={`tel:${doctor.phone}`} 
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all"
              >
                Contact Now
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32 bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-indigo-500/5 text-center">
                <div className="relative inline-block mb-6">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2.5rem] object-cover border-8 border-slate-50 shadow-inner" 
                  />
                  {doctor.verified && (
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 text-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border-4 border-white">
                      <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight">{doctor.name}</h1>
                <p className="text-indigo-600 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-8">{doctor.specialty}</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="relative overflow-hidden group flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl active:scale-95 transition-all shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-500" />
                    <Phone size={14} fill="currentColor" className="text-blue-400 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-tight italic">Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${doctor.whatsapp}`}
                    className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl active:scale-95 transition-all shadow-lg"
                  >
                    <MessageCircle size={16} fill="currentColor" className="shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-tight italic">Chat</span>
                  </a>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-around">
                  <div className="text-center">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Experience</p>
                    <p className="font-bold text-slate-700 text-sm sm:text-base">{doctor.experience}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div className="text-center">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rating</p>
                    <p className="font-bold text-slate-700 text-sm sm:text-base">★ 5.0</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <section className="mb-10 sm:mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-indigo-100" /> Professional Summary
                </h3>
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
                    "{doctor.about || 'This specialist has provided expert medical services for over a decade, focusing on patient-centered care and advanced clinical methodologies.'}"
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-12">
                <DetailCard icon={<GraduationCap className="text-blue-500" />} title="Education" value={doctor.education} />
                <DetailCard icon={<Languages className="text-emerald-500" />} title="Languages" value={doctor.languages?.join(", ")} />
                <DetailCard icon={<Calendar className="text-rose-500" />} title="Available Days" value={doctor.contactDays} />
                <DetailCard icon={<Clock className="text-amber-500" />} title="Working Hours" value={doctor.contactTime} />
              </div>

              <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-indigo-100" /> Practice Location
                </h3>
                <div className="bg-indigo-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-4">
                      <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">Clinic Address</p>
                      <div className="flex gap-4">
                        <MapPin className="shrink-0 text-indigo-400 w-6 h-6" />
                        <p className="text-base sm:text-lg font-bold leading-snug">{doctor.address}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                      <div>
                        <p className="text-indigo-300 text-[10px] font-black uppercase mb-1 tracking-widest">Email</p>
                        <p className="font-bold text-sm sm:text-base break-all">{doctor.email}</p>
                      </div>
                      <div>
                        <p className="text-indigo-300 text-[10px] font-black uppercase mb-1 tracking-widest">Direct Line</p>
                        <p className="font-bold text-sm sm:text-base">{doctor.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ icon, title, value }) => (
  <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm flex items-start gap-4 sm:gap-5 transition-all hover:border-indigo-100">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-slate-50">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="font-bold text-slate-800 leading-tight text-sm sm:text-base break-words">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

export default DoctorProfile;