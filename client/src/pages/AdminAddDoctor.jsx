import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Briefcase, GraduationCap, Globe, Mail, Phone,
    MessageCircle, MapPin, Calendar, Clock, Image as ImageIcon,
    CheckCircle2, Sparkles, HeartPulse, ShieldCheck, Trash2, Edit3, XCircle, Loader2, Award
} from 'lucide-react';
import Header from '../Components/Header';

// --- HELPERS ---
const InputField = ({ label, icon, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-gray-800/80 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                {icon}
            </div>
            <input
                {...props}
                required
                className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-600/60 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
            />
        </div>
    </div>
);

const FormSection = ({ title, description, icon, bgColor, children }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-4">
            <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed">{description}</p>
        </div>
        <div className="lg:col-span-8">{children}</div>
    </div>
);

// --- MAIN COMPONENT ---
const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [isListLoading, setIsListLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '', specialty: '', experience: '', education: '',
        languages: '', email: '', phone: '', whatsapp: '',
        address: '', about: '', image: '', verified: true,
        contactDays: '', contactTime: ''
    });

    // Fetch Doctors
    const fetchDoctors = async () => {
        try {
            setIsListLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/doctors/getdoctor`);
            setDoctors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setIsListLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditId(null);
        setFormData({
            name: '', specialty: '', experience: '', education: '', languages: '',
            email: '', phone: '', whatsapp: '', address: '', about: '',
            image: '', verified: true, contactDays: '', contactTime: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const processedData = {
                ...formData,
                languages: typeof formData.languages === 'string'
                    ? formData.languages.split(',').map(l => l.trim()).filter(Boolean)
                    : formData.languages
            };

            if (editId) {
                // Update Logic
                const token = localStorage.getItem("token");

                await axios.put(
                    `${import.meta.env.VITE_BASE_URI}/api/doctors/update/${editId}`,
                    processedData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("Profile updated successfully");
            } else {
                // Create Logic
                const token = localStorage.getItem("token");

                await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/api/doctors/adddoctor`,
                    processedData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("Doctor profile successfully synchronized.");
            }

            resetForm();
            fetchDoctors();
        } catch (error) {
            alert("Sync failed: " + (error.response?.data?.message || "Verify your connection"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (doctor) => {
        setEditId(doctor._id);
        setFormData({
            ...doctor,
            languages: Array.isArray(doctor.languages) ? doctor.languages.join(', ') : doctor.languages
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this provider?")) return;
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${import.meta.env.VITE_BASE_URI}/api/doctors/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchDoctors();
        } catch (error) {
            alert("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20 selection:bg-indigo-100">
            <Header />
            <main className="max-w-7xl mx-auto px-6 pt-32 relative">

                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-indigo-600 text-xs font-bold mb-4 border border-indigo-100 shadow-sm">
                            <Sparkles size={14} /> SYSTEM ADMINISTRATION
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                            Provider <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
                                {editId ? "Modification" : "Onboarding"}
                            </span>
                        </h1>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-blue-100/50 rounded-xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] border border-slate-100 space-y-8 mb-24"
                >
                    {/* Medical Identity Section */}
                    <FormSection
                        title="Medical Identity"
                        description="Core professional credentials."
                        icon={<HeartPulse className="text-rose-500" size={16} />}
                        bgColor="bg-rose-50/50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Doctor Name" name="name" icon={<User size={14} />} value={formData.name} onChange={handleChange} placeholder="Dr. Jhon" />
                            <InputField label="Specialty" name="specialty" icon={<Briefcase size={14} />} value={formData.specialty} onChange={handleChange} placeholder="Cardiology" />
                            <InputField label="Experience" name="experience" icon={<Award size={14} />} value={formData.experience} onChange={handleChange} placeholder="10+ Years" />
                            <InputField label="Education" name="education" icon={<GraduationCap size={14} />} value={formData.education} onChange={handleChange} placeholder="MBBS, MD" />
                        </div>
                    </FormSection>

                    <div className="relative py-10">
                        <div className="w-full h-[1px] bg-slate-100 flex items-center justify-center">
                            <div className="relative h-[2px] w-1/3 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 blur-[2px] opacity-40"></div>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Section */}
                    <FormSection
                        title="Consultation"
                        description="Availability settings."
                        icon={<Calendar className="text-indigo-500" size={16} />}
                        bgColor="bg-indigo-50/50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Available Days" name="contactDays" icon={<Calendar size={14} />} value={formData.contactDays} onChange={handleChange} placeholder="Tue - Sat" />
                            <InputField label="Shift Timing" name="contactTime" icon={<Clock size={14} />} value={formData.contactTime} onChange={handleChange} placeholder="10:00 PM - 12:00 AM" />
                            <div className="sm:col-span-2">
                                <InputField label="Languages" name="languages" icon={<Globe size={14} />} value={formData.languages} onChange={handleChange} placeholder="English, Hindi, Kannada" />
                            </div>
                        </div>
                    </FormSection>

                    <div className="relative py-10">
                        <div className="w-full h-[1px] bg-slate-100 flex items-center justify-center">
                            <div className="relative h-[2px] w-1/3 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 blur-[2px] opacity-40"></div>
                            </div>
                        </div>
                    </div>


                    {/* Patient Access Section */}
                    <FormSection
                        title="Patient Access"
                        description="Direct contact methods."
                        icon={<MessageCircle className="text-emerald-500" size={16} />}
                        bgColor="bg-emerald-50/50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Email" name="email" type="email" icon={<Mail size={14} />} value={formData.email} onChange={handleChange} />
                            <InputField label="Phone" name="phone" icon={<Phone size={14} />} value={formData.phone} onChange={handleChange} />
                            <InputField label="WhatsApp" name="whatsapp" icon={<MessageCircle size={14} />} value={formData.whatsapp} onChange={handleChange} />
                            <InputField label="Clinic Address" name="address" icon={<MapPin size={14} />} value={formData.address} onChange={handleChange} />
                        </div>
                    </FormSection>

                    <div className="relative py-10">
                        <div className="w-full h-[1px] bg-slate-100 flex items-center justify-center">
                            <div className="relative h-[2px] w-1/3 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] rounded-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 blur-[2px] opacity-40"></div>
                            </div>
                        </div>
                    </div>


                    {/* Bio Section */}
                    <FormSection
                        title="Media & Bio"
                        description="Public summary."
                        icon={<ImageIcon className="text-amber-500" size={16} />}
                        bgColor="bg-amber-50/50"
                    >
                        <div className="space-y-4">
                            <InputField label="Profile Photo URL" name="image" icon={<ImageIcon size={14} />} value={formData.image} onChange={handleChange} placeholder="Paste link..." />
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Biography</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none h-24 resize-none"
                                    placeholder="Medical philosophy..."
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Small Footer Actions */}
                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                Discard Changes
                            </button>
                        )}
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="px-8 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-indigo-600 transition-all flex items-center gap-2 disabled:bg-slate-300 shadow-sm"
                        >
                            {isSubmitting ? "Syncing..." : (
                                <>{editId ? <Edit3 size={14} /> : <CheckCircle2 size={14} />} {editId ? "Update Profile" : "Save Profile"}</>
                            )}
                        </button>
                    </div>
                </form>
                {/* --- DOCTOR LIST SECTION --- */}
                <div className="mt-32">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Current Directory</h2>
                            <p className="text-slate-500 text-sm font-medium">Manage existing medical provider profiles.</p>
                        </div>
                    </div>

                    {isListLoading ? (
                        <div className="flex flex-col items-center py-20">
                            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Records...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctors.map((doc) => (
                                <div key={doc._id} className="group bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={doc.image || 'https://via.placeholder.com/150'} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-50" />
                                                {doc.verified && <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-lg border-2 border-white"><ShieldCheck size={12} /></div>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base leading-tight">{doc.name}</h4>
                                                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider">{doc.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(doc)} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(doc._id)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">{doc.education}</span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">{doc.experience}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DoctorManagement;