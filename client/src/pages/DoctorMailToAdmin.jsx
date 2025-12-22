import React from 'react';
import { Mail, ClipboardCheck, User, Stethoscope, Briefcase, GraduationCap, Globe, Clock, MapPin, ShieldCheck, Copy, ChevronRight, Heart } from 'lucide-react';
import Header from '../Components/Header';

const DoctorOnboardingPage = () => {
    const adminEmail = "ashwathkulal2004@gmail.com";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(adminEmail);
        alert("Email copied to clipboard!");
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">
            <Header />
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden pt-16">
                <div className="lg:w-1/2 bg-slate-900 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" className="text-blue-500" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
                            <Heart size={14} className="fill-current" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Medical Excellence</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
                            Your expertise is the <span className="text-blue-500">healing touch</span> the world needs.
                        </h1>

                        <div className="space-y-4 max-w-md">
                            <p className="text-base text-slate-400 leading-relaxed">
                                Medicine is more than a profession—it’s a profound commitment to humanity. Join our network to bridge the gap between world-class care and those who need it most.
                            </p>
                            <p className="text-sm text-slate-500 italic border-l-2 border-blue-500 pl-4">
                                "The best way to find yourself is to lose yourself in the service of others."
                            </p>
                        </div>

                        <div className="mt-8 flex gap-8">
                            <div>
                                <div className="text-2xl font-bold text-white">24/7</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Global Support</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">100%</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Volunteer Driven</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Action Area */}
                <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center bg-slate-50 overflow-y-auto">
                    <div className="max-w-md mx-auto lg:mx-0 w-full space-y-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">How to Apply</h2>
                            <p className="text-sm text-slate-500">Forward your professional profile for verification.</p>
                        </div>

                        {/* Email Box */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group transition-all hover:border-blue-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Official Admin Email</p>
                                    <p className="text-base font-mono text-slate-800">{adminEmail}</p>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-slate-100 p-3 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submission Requirements</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <CheckItem text="Personal & Contact Info" />
                                <CheckItem text="Specialty & Experience" />
                                <CheckItem text="Education & Languages" />
                                <CheckItem text="Availability & Timing" />
                                <CheckItem text="Clinic/Home Address" />
                                <CheckItem text="Professional Bio" />
                            </div>
                        </div>

                        {/* Attachment Notice */}
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                            <div className="flex gap-3">
                                <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-blue-900 text-xs uppercase tracking-wider">Mandatory Proof</p>
                                    <p className="text-blue-800/70 text-xs mt-0.5 leading-relaxed">
                                        Attach a <strong>Profile Picture</strong> and your <strong>Medical License</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                            <a
                                href={`mailto:${adminEmail}?subject=Volunteer Doctor Application&body=Name: %0D%0ASpecialty: %0D%0AExperience: %0D%0A...`}
                                className="group flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-slate-200"
                            >
                                Draft Application Email
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                            <p className="text-center mt-4 text-slate-400 text-[10px]">
                                Review period: 48-72 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckItem = ({ text }) => (
    <div className="flex items-center gap-2 text-slate-700">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
        <span className="text-sm font-medium">{text}</span>
    </div>
);

export default DoctorOnboardingPage;