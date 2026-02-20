import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Briefcase, GraduationCap, Globe, Mail, Phone,
    MessageCircle, MapPin, Calendar, Clock, Image as ImageIcon,
    CheckCircle2, Sparkles, HeartPulse, ShieldCheck, Trash2, Edit3, XCircle, Loader2, Award,
    ArrowLeft, Menu
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

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
                className="w-full pl-12 pr-5 py-3.5 md:py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-600/60 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
            />
        </div>
    </div>
);

const FormSection = ({ title, description, icon, bgColor, children }) => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        <div className="lg:col-span-4">
            <div className="flex items-center lg:block gap-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-2xl flex items-center justify-center mb-0 lg:mb-4 shadow-sm shrink-0`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
                    <p className="text-xs md:text-sm font-medium text-slate-400 mt-1 lg:mt-2 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
        <div className="lg:col-span-8">{children}</div>
    </div>
);

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [isListLoading, setIsListLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', specialty: '', experience: '', education: '',
        languages: '', email: '', phone: '', whatsapp: '',
        address: '', about: '', image: '', verified: true,
        contactDays: '', contactTime: ''
    });

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

            const token = localStorage.getItem("token");
            const config = {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            };

            if (editId) {
                await axios.put(`${import.meta.env.VITE_BASE_URI}/api/doctors/update/${editId}`, processedData, config);
                alert("Profile updated successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URI}/api/doctors/adddoctor`, processedData, config);
                alert("Doctor profile successfully synchronized.");
            }
            resetForm();
            fetchDoctors();
        } catch (error) {
            alert("Sync failed: " + (error.response?.data?.message || "Check connection"));
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
        if (!window.confirm("Delete this provider?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BASE_URI}/api/doctors/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchDoctors();
        } catch (error) { alert("Delete failed"); }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            
            {/* Dynamic Margin: 0 on mobile, 64 (16rem) on large screens */}
            <main className="flex-1 w-full lg:ml-64 px-4 sm:px-6 lg:px-10 pt-8 pb-20 relative transition-all duration-300">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors mb-6 text-sm"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                {/* Header Section */}
                <div className="mb-10 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-indigo-600 text-[10px] font-black mb-4 border border-indigo-100 shadow-sm uppercase tracking-widest">
                        <Sparkles size={12} /> System Admin
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Provider <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">
                            {editId ? "Modification" : "Onboarding"}
                        </span>
                    </h1>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 md:p-8 lg:p-10 shadow-sm border border-slate-100 space-y-12 mb-20"
                >
                    <FormSection
                        title="Medical Identity"
                        description="Professional credentials and info."
                        icon={<HeartPulse className="text-rose-500" size={18} />}
                        bgColor="bg-rose-50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <InputField label="Doctor Name" name="name" icon={<User size={14} />} value={formData.name} onChange={handleChange} placeholder="Dr. John Doe" />
                            <InputField label="Specialty" name="specialty" icon={<Briefcase size={14} />} value={formData.specialty} onChange={handleChange} placeholder="Cardiology" />
                            <InputField label="Experience" name="experience" icon={<Award size={14} />} value={formData.experience} onChange={handleChange} placeholder="10+ Years" />
                            <InputField label="Education" name="education" icon={<GraduationCap size={14} />} value={formData.education} onChange={handleChange} placeholder="MBBS, MD" />
                        </div>
                    </FormSection>

                    <FormSection
                        title="Consultation"
                        description="Set availability and shift times."
                        icon={<Calendar className="text-indigo-500" size={18} />}
                        bgColor="bg-indigo-50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <InputField label="Available Days" name="contactDays" icon={<Calendar size={14} />} value={formData.contactDays} onChange={handleChange} placeholder="Mon - Fri" />
                            <InputField label="Shift Timing" name="contactTime" icon={<Clock size={14} />} value={formData.contactTime} onChange={handleChange} placeholder="9:00 AM - 5:00 PM" />
                            <div className="sm:col-span-2">
                                <InputField label="Languages" name="languages" icon={<Globe size={14} />} value={formData.languages} onChange={handleChange} placeholder="English, Spanish..." />
                            </div>
                        </div>
                    </FormSection>

                    <FormSection
                        title="Patient Access"
                        description="Contact and location details."
                        icon={<MessageCircle className="text-emerald-500" size={18} />}
                        bgColor="bg-emerald-50"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <InputField label="Email" name="email" type="email" icon={<Mail size={14} />} value={formData.email} onChange={handleChange} />
                            <InputField label="Phone" name="phone" icon={<Phone size={14} />} value={formData.phone} onChange={handleChange} />
                            <InputField label="WhatsApp" name="whatsapp" icon={<MessageCircle size={14} />} value={formData.whatsapp} onChange={handleChange} />
                            <InputField label="Clinic Address" name="address" icon={<MapPin size={14} />} value={formData.address} onChange={handleChange} />
                        </div>
                    </FormSection>

                    <FormSection
                        title="Media & Bio"
                        description="Public profile details."
                        icon={<ImageIcon className="text-amber-500" size={18} />}
                        bgColor="bg-amber-50"
                    >
                        <div className="space-y-5">
                            <InputField label="Profile Photo URL" name="image" icon={<ImageIcon size={14} />} value={formData.image} onChange={handleChange} placeholder="https://..." />
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Biography</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none h-32 resize-none"
                                    placeholder="Write a brief medical philosophy..."
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Submit Actions */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-slate-100">
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                            >
                                Discard Changes
                            </button>
                        )}
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 shadow-lg shadow-indigo-100"
                        >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : (editId ? <Edit3 size={14} /> : <CheckCircle2 size={14} />)}
                            {isSubmitting ? "Syncing..." : (editId ? "Update Profile" : "Save Profile")}
                        </button>
                    </div>
                </form>

                {/* --- LIST SECTION --- */}
                <div className="mt-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 shrink-0">
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
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Accessing Records...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {doctors.map((doc) => (
                                <div key={doc._id} className="group bg-white border border-slate-200 rounded-[2.5rem] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <img src={doc.image || 'https://via.placeholder.com/150'} alt={doc.name} className="w-16 h-16 rounded-[1.25rem] object-cover border-4 border-slate-50" />
                                                {doc.verified && <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-sm"><ShieldCheck size={12} /></div>}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight truncate">{doc.name}</h4>
                                                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider mt-1">{doc.specialty}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(doc)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(doc._id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-5 border-t border-slate-50">
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{doc.education}</span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{doc.experience} Experience</span>
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