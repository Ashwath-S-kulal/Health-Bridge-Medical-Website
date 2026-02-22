import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Heart, Search, Plus, MapPin, ChevronRight, X,
    MessageSquare, Info, ArrowLeft, LifeBuoy,
    CheckCircle2, Activity, ShieldCheck, Loader2,
    User, Calendar, Navigation, Printer,
    Microscope,
    Sparkles
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { NavLink, useNavigate } from "react-router-dom";

const PatientSupportHub = () => {
    const [view, setView] = useState("list");
    const [patients, setPatients] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true); // New for main list skeleton
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loadingIntel, setLoadingIntel] = useState(false);

    const [diseaseList, setDiseaseList] = useState([]);
    const [isListLoading, setIsListLoading] = useState(false);

    const [nihSections, setNihSections] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [nearbyData, setNearbyData] = useState({ hospitals: [], pharmacies: [] });
    const [internalData, setInternalData] = useState({ desc: null, precautions: [], symptoms: [] });

    const [formData, setFormData] = useState({
        name: "", age: "", gender: "Male", disease: "", location: ""
    });
    const navigate = useNavigate();

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    // Skeleton Component
    const Skeleton = ({ className }) => (
        <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
    );

    useEffect(() => {
        setIsListLoading(true);
        fetch(`${import.meta.env.VITE_BASE_URI}/api/precaution/list`)
            .then((res) => res.json())
            .then((list) => {
                setDiseaseList(list);
                setIsListLoading(false);
            })
            .catch((err) => {
                console.error("List Fetch Error:", err);
                setIsListLoading(false);
            });
    }, []);

    const fetchPatients = async () => {
        setIsInitialLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/patient/get`, getAuthHeaders());
            setPatients(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
        finally { setIsInitialLoading(false); }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchSupportIntelligence = async (patient) => {
        setLoadingIntel(true);
        const diseaseName = patient.disease;
        const location = patient.location;
        const wikiTerm = diseaseName.split('(')[0].trim().replace(/\s+/g, '_');

        try {
            const wikiPromise = axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTerm}`)
                .then(res => setWikiData(res.data)).catch(() => setWikiData(null));

            const nihPromise = axios.get(`${import.meta.env.VITE_BASE_URI}/api/patient/nih-proxy?term=${encodeURIComponent(diseaseName)}`, getAuthHeaders())
                .then(res => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(res.data, "text/xml");
                    const firstDoc = xmlDoc.getElementsByTagName("document")[0];
                    if (!firstDoc) return;
                    const contentTags = firstDoc.getElementsByTagName("content");
                    let fullSummary = "";
                    for (let tag of contentTags) {
                        if (tag.getAttribute("name") === "FullSummary") { fullSummary = tag.textContent; break; }
                    }
                    if (fullSummary) {
                        const parts = fullSummary.split(/(?=What is|What are|What causes|How is|How can|Signs and symptoms|Diagnosis|Treatment|Prevention)/g);
                        setNihSections(parts.map(p => {
                            const rawTitle = p.match(/^.*?[?.!:]/)?.[0] || "Support Advice";
                            return {
                                title: rawTitle.replace(/<[^>]*>?/gm, '').trim(),
                                content: p.replace(/<[^>]*>?/gm, '').trim()
                            };
                        }).filter(s => s.content.length > 20));
                    }
                }
                ).catch(() => setNihSections(null));


            const nearbyPromise = axios.get(`${import.meta.env.VITE_BASE_URI}/api/patient/nearby?location=${encodeURIComponent(location)}`, getAuthHeaders())
                .then(res => setNearbyData(res.data)).catch(() => setNearbyData({ hospitals: [], pharmacies: [] }));

            const internalPromise = Promise.all([
                axios.get(`${import.meta.env.VITE_BASE_URI}/api/diseasedesc?name=${encodeURIComponent(diseaseName)}`, getAuthHeaders()),
                axios.get(`${import.meta.env.VITE_BASE_URI}/api/precaution?disease=${encodeURIComponent(diseaseName)}`, getAuthHeaders()),
                axios.get(`${import.meta.env.VITE_BASE_URI}/api/symptoms?disease=${encodeURIComponent(diseaseName)}`, getAuthHeaders())
            ]).then(([descRes, precRes, sympRes]) => {
                const extract = (res) => {
                    if (res.data.data && Array.isArray(res.data.data)) return res.data.data[0];
                    if (Array.isArray(res.data)) return res.data[0];
                    return res.data;
                };
                setInternalData({
                    desc: extract(descRes)?.description || null,
                    precautions: extract(precRes) || null,
                    symptoms: extract(sympRes) || null
                });
            }).catch(() => setInternalData({ desc: null, precautions: null, symptoms: null }));

            await Promise.all([wikiPromise, nihPromise, nearbyPromise, internalPromise]);
            console.log(wikiPromise, nihPromise, nearbyPromise, internalPromise)

        } finally {
            setLoadingIntel(false);
        }
    };

    const handleOpenCard = (patient) => {
        if (patient.isCured) return;
        setSelectedPatient(patient);
        fetchSupportIntelligence(patient);
        setView("details");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleCured = async (e, patientId, currentStatus) => {
        e.stopPropagation();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URI}/api/patient/update/${patientId}`, { isCured: !currentStatus }, getAuthHeaders());
            fetchPatients();
        } catch (err) { alert("Status update failed"); }
    };

    const submitNewCareRequest = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URI}/api/patient/add`, formData, getAuthHeaders());
            setIsFormOpen(false);
            setFormData({ name: "", age: "", gender: "Male", disease: "", location: "" });
            fetchPatients();
        } catch (err) { alert("Error adding patient"); }
    };

    const stats = {
        total: patients.length,
        recovered: patients.filter(p => p.isCured).length,
        active: patients.filter(p => !p.isCured).length
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.disease.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- VIEW 1: LIST VIEW ---
    if (view === "list") {
        return (
            <div className="flex min-h-screen bg-[#F1F5F9]">
                <Sidebar />
                <div className="flex-1 lg:ml-64 transition-all duration-300">
                    <main className="max-w-7xl mx-auto p-6 md:p-10 pt-20 md:pt-6">

                        <div className="mb-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-8 shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Register your disease here</h2>
                                    <p className="text-indigo-100 font-medium opacity-90">Our AI engine will analyze your condition and provide a personalized recovery guide.</p>
                                </div>
                                <button onClick={() => setIsFormOpen(true)} className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap">
                                    Start AI Analysis
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>

                                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
                                <p className="text-slate-500 mt-2">Monitor and manage active care cases</p>
                            </div>

                            <div className="flex gap-3">
                                {isInitialLoading ? (
                                    <>
                                        <Skeleton className="w-24 h-20" />
                                        <Skeleton className="w-24 h-20" />
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-white px-6 py-2 rounded-xl shadow-sm border border-slate-200">
                                            <p className="text-[10px] font-bold text-slate-400 ">Active Cases: <span className="text-2xl font-black"> {stats.active}</span></p>
                                        </div>
                                        <div className="bg-emerald-600 px-6 py-2 rounded-xl shadow-lg shadow-emerald-100 text-white">
                                            <p className="text-[10px] font-bold text-emerald-100 ">Recovered: <span className="text-2xl font-black"> {stats.recovered}</span></p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                    placeholder="Search by name or condition..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-xl">
                                {isFormOpen ? <X size={20} /> : <Plus size={20} />}
                                {isFormOpen ? "Cancel" : "New Entry"}
                            </button>
                        </div>

                        {/* Expandable Form (Same as previous) */}
                        {isFormOpen && (
                            <div className="bg-white border border-indigo-100 rounded-3xl p-8 mb-10 shadow-xl animate-in fade-in zoom-in duration-300">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><User className="text-indigo-500" size={20} /> Patient Information</h2>
                                <form onSubmit={submitNewCareRequest} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                        <input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:bg-white transition-all" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Age</label><input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="25" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Gender</label><select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Medical Condition</label>
                                        <div className="relative">
                                            <select required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm appearance-none cursor-pointer" value={formData.disease} onChange={e => setFormData({ ...formData, disease: e.target.value })} disabled={isListLoading}>
                                                <option value="" disabled>{isListLoading ? "Fetching Database..." : "Select a diagnosed condition"}</option>
                                                {diseaseList.map((disease, index) => <option key={index} value={disease}>{disease}</option>)}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                {isListLoading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} className="rotate-90" />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-slate-500 ml-1">Residence</label><input required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="City, State" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
                                    <div className="md:col-span-3 pt-4 flex justify-end"><button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Register Patient Record</button></div>
                                </form>
                            </div>
                        )}

                        {/* List Grid with Skeletons */}
                        <div className="grid grid-cols-1 gap-4">
                            {isInitialLoading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-5 w-full">
                                            <Skeleton className="w-14 h-14 rounded-2xl" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="w-48 h-5" />
                                                <Skeleton className="w-32 h-3" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-32 h-10 mt-4 md:mt-0" />
                                    </div>
                                ))
                            ) : (
                                filteredPatients.map(p => (
                                    <div key={p._id} onClick={() => handleOpenCard(p)} className={`group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${p.isCured ? 'bg-white/60 border-slate-200 grayscale opacity-70' : 'bg-white border-transparent shadow-sm hover:shadow-xl hover:border-indigo-100 cursor-pointer'}`}>
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${p.isCured ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                                {p.isCured ? <CheckCircle2 size={28} /> : <User size={28} />}
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold ${p.isCured ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{p.name}</h3>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                    <span className="text-xs font-medium text-indigo-500 flex items-center gap-1 uppercase tracking-wider"><Activity size={12} /> {p.disease}</span>
                                                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                                            <button onClick={(e) => toggleCured(e, p._id, p.isCured)} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${p.isCured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white'}`}>
                                                {p.isCured ? 'Successfully Recovered' : 'Mark as Cured'}
                                            </button>
                                            {!p.isCured && <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <nav className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between border-b border-slate-200">
                    <button onClick={() => setView("list")} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all group">
                        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50"><ArrowLeft size={18} /></div>
                        Back to Registry
                    </button>
                    <div className="flex gap-3">
                        <NavLink to="/doctors">
                            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"><MessageSquare size={16} /> Consult Specialist</button>
                        </NavLink>
                    </div>
                </nav>


                <div className="p-6 md:p-10 max-w-6xl mx-auto">
                    {/* Patient Summary Header */}
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                                <User size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">{selectedPatient.name}</h1>
                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">{selectedPatient.disease}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-slate-50 p-4 rounded-2xl min-w-[120px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Age</p>
                                <p className="text-lg font-bold text-slate-800">{selectedPatient.age} Years</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl min-w-[120px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Residence</p>
                                <p className="text-lg font-bold text-slate-800">{selectedPatient.location.split(',')[0]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols- gap-10">
                        <div className="lg:col-span-2 space-y-10">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                                    {loadingIntel ? (
                                        <Skeleton className="w-full aspect-square rounded-[2.5rem]" />
                                    ) : wikiData?.originalimage && (
                                        <div className="rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl h-full">
                                            <img
                                                src={wikiData.originalimage.source}
                                                alt="Visual"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full flex flex-col shadow-2xl border border-slate-800">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <MapPin size={20} className="text-indigo-400" />
                                                Local Resources
                                            </h3>
                                            {!loadingIntel && (
                                                <NavLink to="/doctors">
                                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-4 py-3 rounded-full font-bold tracking-tighter">
                                                        For More Data
                                                    </span>
                                                </NavLink>
                                            )}
                                        </div>

                                        {loadingIntel ? (
                                            <div className="space-y-4">
                                                <Skeleton className="w-full h-32 bg-slate-800 rounded-3xl" />
                                                <Skeleton className="w-full h-32 bg-slate-800 rounded-3xl" />
                                            </div>
                                        ) : (
                                            <div className="space-y-6 flex-1">
                                                <div className="group">
                                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 group-hover:text-rose-400 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                        Urgent Care & Hospitals
                                                    </h4>

                                                    {nearbyData.hospitals.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {nearbyData.hospitals.slice(0, 4).map((h, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={`https://www.google.com/maps?q=${h.lat},${h.lon}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/item"
                                                                >
                                                                    <span className="text-xs font-semibold text-slate-200 truncate pr-4">
                                                                        {h.tags.name || "Medical Center"}
                                                                    </span>
                                                                    <Navigation size={14} className="text-slate-500 group-hover/item:text-indigo-400 transition-colors shrink-0" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                                            <Info size={20} className="text-slate-600 mb-2" />
                                                            <p className="text-[11px] text-slate-500 font-medium">No hospitals found in this immediate area.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="group">
                                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 group-hover:text-emerald-400 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                        Nearby Pharmacies
                                                    </h4>

                                                    {nearbyData.pharmacies.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {nearbyData.pharmacies.slice(0, 4).map((p, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={`https://www.google.com/maps?q=${p.lat},${p.lon}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group/item"
                                                                >
                                                                    <span className="text-xs font-semibold text-slate-200 truncate pr-4">
                                                                        {p.tags.name || "Local Pharmacy"}
                                                                    </span>
                                                                    <Navigation size={14} className="text-slate-500 group-hover/item:text-emerald-400 transition-colors shrink-0" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                                            <Info size={20} className="text-slate-600 mb-2" />
                                                            <p className="text-[11px] text-slate-500 font-medium">No pharmacies listed in this vicinity.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-white/5">
                                                    <div className="flex items-start gap-3 p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                                        <LifeBuoy size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] leading-relaxed text-rose-200/70 font-medium">
                                                            <strong>Emergency?</strong> Please dial your local emergency number (e.g., 911) immediately if the patient is in critical condition.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Clinical Overview</h2>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                    {loadingIntel ? (
                                        <Skeleton className="w-full h-32 rounded-3xl" />
                                    ) : (
                                        <div className="text-slate-600 text-lg leading-relaxed prose prose-indigo" dangerouslySetInnerHTML={{ __html: wikiData?.extract || "No data." }} />
                                    )}
                                </div>
                            </section>

                            <section>
                                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-6"><ShieldCheck className="text-indigo-500" /> Care protocols</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {loadingIntel ? (
                                        [1, 2].map(i => <Skeleton key={i} className="w-full h-32 rounded-3xl" />)
                                    ) : (
                                        nihSections?.map((section, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                                                <h3 className="text-indigo-600 font-bold text-lg mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400"></div>{section.title}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
                                            </div>

                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Internal Stats Skeletons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-amber-50/50 rounded-[2.5rem] p-8 border border-amber-100">
                                    <h3 className="text-amber-700 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={18} /> Key Symptoms</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {loadingIntel ? <Skeleton className="w-full h-20" /> : internalData.symptoms ? Object.values(internalData.symptoms).filter(v => typeof v === 'string' && v.length > 1).map((s, i) => (
                                            <span key={i} className="px-4 py-2 bg-white text-amber-800 text-xs font-bold rounded-xl shadow-sm border border-amber-100">{s}</span>
                                        )) : <p className="text-xs text-slate-400">N/A</p>}
                                    </div>
                                </div>
                                <div className="bg-emerald-50/50 rounded-[2.5rem] p-8 border border-emerald-100">
                                    <h3 className="text-emerald-700 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><ShieldCheck size={18} /> Precautions</h3>
                                    {loadingIntel ? <Skeleton className="w-full h-20" /> : (
                                        <ul className="space-y-3">
                                            {internalData.precautions ? Object.entries(internalData.precautions).filter(([k, v]) => !['_id', '__v', 'Disease'].includes(k) && typeof v === 'string' && v.length > 1).map(([k, p], i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700"><CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {p}</li>
                                            )) : <p className="text-xs text-slate-400">N/A</p>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Footer Section */}
                <footer className="mt-10 border-t border-slate-200 bg-white p-8">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Microscope size={20} /></div>
                            <p className="text-xs font-bold text-slate-500">AI-Powered Patient Insight Engine v2.4</p>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 text-center md:text-right max-w-md">
                            The information provided is gathered from open clinical databases and Wikipedia.
                            Always consult with a licensed medical professional before beginning any treatment protocol.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PatientSupportHub;