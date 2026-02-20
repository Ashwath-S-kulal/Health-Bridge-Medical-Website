import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, MessageCircle, MapPin, Star, Clock, 
  GraduationCap, Calendar, Award, ShieldCheck, Share2, Languages 
} from 'lucide-react';
import Sidebar from './Sidebar';

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) return <div className="p-20 text-center font-bold">Doctor not found.</div>;

  return (
    <div>
      <Sidebar/>
       <div className="min-h-screen bg-[#FDFDFF] pb-20 ml-64">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} /> Back to Directory
          </button>
          <div className="flex items-center gap-4">
             <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600"><Share2 size={20}/></button>
             <a href={`tel:${doctor.phone}`} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100">Contact Now</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 2. LEFT COLUMN: PROFILE CARD & ACTIONS */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-xl shadow-indigo-500/5 text-center">
              <div className="relative inline-block mb-6">
                <img src={doctor.image} alt={doctor.name} className="w-48 h-48 rounded-[2.5rem] object-cover border-8 border-slate-50 shadow-inner" />
                {doctor.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl border-4 border-white">
                    <ShieldCheck size={24} />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-black text-slate-900 mb-2">{doctor.name}</h1>
              <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-6">{doctor.specialty}</p>

              <div className="space-y-3 mb-8">
                <a href={`tel:${doctor.phone}`} className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all">
                  <Phone size={18} /> Call Specialist
                </a>
                <a href={`https://wa.me/${doctor.whatsapp}`} className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 rounded-[1.5rem] font-bold hover:bg-emerald-600 transition-all">
                  <MessageCircle size={18} /> WhatsApp Chat
                </a>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-around">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Experience</p>
                  <p className="font-bold text-slate-700">{doctor.experience}</p>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Rating</p>
                  <p className="font-bold text-slate-700">★ 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: FULL BIOGRAPHY & DETAILS */}
          <div className="lg:col-span-8">
            {/* Bio Section */}
            <section className="mb-12">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-100" /> Professional Summary
              </h3>
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                <p className="text-slate-600 text-lg leading-relaxed italic font-medium">
                  "{doctor.about || 'This specialist has provided expert medical services for over a decade, focusing on patient-centered care and advanced clinical methodologies.'}"
                </p>
              </div>
            </section>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <DetailCard icon={<GraduationCap className="text-blue-500"/>} title="Education" value={doctor.education} />
              <DetailCard icon={<Languages className="text-emerald-500"/>} title="Languages" value={doctor.languages?.join(", ")} />
              <DetailCard icon={<Calendar className="text-rose-500"/>} title="Available Days" value={doctor.contactDays} />
              <DetailCard icon={<Clock className="text-amber-500"/>} title="Working Hours" value={doctor.contactTime} />
            </div>

            {/* Location & Contact Section */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-100" /> Practice Location & Contact
              </h3>
              <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <p className="text-indigo-300 text-[10px] font-black uppercase mb-4 tracking-widest">Clinic Address</p>
                    <div className="flex gap-4">
                      <MapPin className="shrink-0 text-indigo-400" />
                      <p className="text-lg font-bold leading-snug">{doctor.address}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-indigo-300 text-[10px] font-black uppercase mb-2 tracking-widest">Email</p>
                      <p className="font-bold">{doctor.email}</p>
                    </div>
                    <div>
                      <p className="text-indigo-300 text-[10px] font-black uppercase mb-2 tracking-widest">Direct Line</p>
                      <p className="font-bold">{doctor.phone}</p>
                    </div>
                  </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
    </div>
   
  );
};

// Internal Helper Component
const DetailCard = ({ icon, title, value }) => (
  <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm flex items-start gap-5">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="font-bold text-slate-800 leading-tight">{value || 'N/A'}</p>
    </div>
  </div>
);

export default DoctorProfile;   