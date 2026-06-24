import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MessageCircle, MapPin, Star, Clock,
  GraduationCap, Calendar, Award, ShieldCheck, Share2, Languages
} from 'lucide-react';
import Header from './Header';

const DoctorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return (
      <div className="p-12 text-center text-xs font-semibold text-slate-500 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        Doctor record not found within active clinical framework.
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex min-h-screen w-full bg-[#F8FAFC] overflow-x-hidden px-0 md:px-20">
        <div className="flex-1 transition-all duration-300 pb-12 flex flex-col w-full">
          <div className="w-full px-6 pt-6 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Left Panel: Profile Quick View Card */}
              <div className="lg:col-span-4 xl:col-span-3">
                <div className="bg-white border border-slate-200/80 rounded-[16px] p-5 shadow-[0_4px_12px_rgba(15,23,42,0.01)] text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                    />
                    {doctor.verified && (
                      <div className="absolute bottom-0.5 right-0.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Professional">
                        <ShieldCheck size={12} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  <h1 className="text-base font-bold text-[#0F172A] mb-1">{doctor.name}</h1>
                  <p className="inline-block text-[#0F6CBD] font-bold text-[10px] uppercase tracking-wider mb-5 bg-[#0F6CBD]/5 px-2.5 py-0.5 rounded-md">
                    {doctor.specialty}
                  </p>

                  {/* Compact Strategic Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a
                      href={`tel:${doctor.phone}`}
                      className="flex items-center justify-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white py-2 rounded-[10px] text-xs font-semibold transition-colors shadow-sm"
                    >
                      <Phone size={12} className="text-[#0F6CBD] shrink-0" />
                      <span>Direct Call</span>
                    </a>

                    <a
                      href={`https://wa.me/${doctor.whatsapp}`}
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-[10px] text-xs font-semibold transition-colors shadow-sm"
                    >
                      <MessageCircle size={12} className="shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Dashboard Metrics Panel */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <div className="text-center border-r border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                      <p className="font-bold text-[#0F172A] text-sm mt-0.5">{doctor.experience}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peer Rating</p>
                      <p className="font-bold text-[#0F172A] text-sm mt-0.5 flex items-center justify-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" /> 5.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Complete Clinical Breakdown */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">

                {/* Professional Summary Section */}
                <section>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-300" /> Professional Summary
                  </h3>
                  <div className="bg-white rounded-[16px] p-5 border border-slate-200/80 shadow-[0_4px_12px_rgba(15,23,42,0.01)]">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      {doctor.about || 'This specialist has provided expert medical services for over a decade, focusing on patient-centered care and advanced clinical methodologies.'}
                    </p>
                  </div>
                </section>

                {/* Core Attributes High-Density Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <DetailCard icon={<GraduationCap className="text-[#0F6CBD]" />} title="Education & Credentials" value={doctor.education} />
                  <DetailCard icon={<Languages className="text-emerald-600" />} title="Languages Spoken" value={doctor.languages?.join(", ")} />
                  <DetailCard icon={<Calendar className="text-slate-600" />} title="Consultation Days" value={doctor.contactDays} />
                  <DetailCard icon={<Clock className="text-slate-600" />} title="Clinical Hours" value={doctor.contactTime} />
                </div>

                {/* Premium Practice Location & Dynamic Metadata Box */}
                <section>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-300" /> Practice Location & Registration
                  </h3>
                  <div className="bg-[#0F172A] rounded-[16px] p-5 text-white border border-slate-800 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      <div className="md:col-span-6 space-y-1.5">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Clinic Address</p>
                        <div className="flex gap-2.5 items-start">
                          <MapPin className="shrink-0 text-[#0F6CBD] w-4 h-4 mt-0.5" />
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">{doctor.address}</p>
                        </div>
                      </div>

                      <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Secure Email</p>
                          <p className="text-xs text-slate-200 break-all font-medium">{doctor.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Direct Line</p>
                          <p className="text-xs text-slate-200 font-medium">{doctor.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Redesigned Premium High-Density Grid Card Component */
const DetailCard = ({ icon, title, value }) => (
  <div className="bg-white border border-slate-200/80 p-4 rounded-[14px] shadow-[0_4px_12px_rgba(15,23,42,0.01)] flex items-center gap-3.5 hover:border-[#0F6CBD]/30 hover:shadow-md transition-all duration-200 w-full group">
    <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-[10px] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="font-bold text-slate-800 text-xs truncate mt-0.5" title={value}>
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

export default DoctorProfile;