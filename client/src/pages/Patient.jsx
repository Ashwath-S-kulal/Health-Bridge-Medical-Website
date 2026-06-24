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
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../Components/Header";

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

    if (view === "list") {
        return (
            <div>
                <Header />
                <div className="flex min-h-screen bg-[#F1F5F9]">
                    <div className="flex-1  transition-all duration-300">
                        <main className="max-w-7xl mx-auto p-4 md:p-6 pt-16 md:pt-4">



                            {/* Registry Title and Stats Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Registry</h1>
                                    <p className="text-xs text-slate-500 mt-1">Monitor and manage active care cases</p>
                                </div>

                                <div className="flex gap-2">
                                    {isInitialLoading ? (
                                        <>
                                            <Skeleton className="w-20 h-12 rounded-lg" />
                                            <Skeleton className="w-20 h-12 rounded-lg" />
                                        </>
                                    ) : (
                                        <>
                                            <div className="bg-white px-4 py-1.5 rounded-lg shadow-sm border border-slate-200 flex flex-col justify-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Active Cases: <span className="text-lg font-black text-slate-800 block sm:inline"> {stats.active}</span></p>
                                            </div>
                                            <div className="bg-emerald-600 px-4 py-1.5 rounded-lg shadow-md shadow-emerald-100 text-white flex flex-col justify-center">
                                                <p className="text-[9px] font-bold text-emerald-100 uppercase">Recovered: <span className="text-lg font-black block sm:inline"> {stats.recovered}</span></p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Search & Actions - Tightened spacing */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                        placeholder="Search by name or condition..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-slate-900 hover:bg-indigo-600 text-white flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shrink-0">
                                    {isFormOpen ? <X size={16} /> : <Plus size={16} />}
                                    {isFormOpen ? "Cancel" : "New Entry"}
                                </button>
                            </div>

                            {/* Expandable Form - Compressed Grid Layout */}
                            {isFormOpen && (
                                <div className="bg-white border border-indigo-100 rounded-2xl p-5 mb-6 shadow-lg animate-in fade-in zoom-in duration-300">
                                    <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5"><User className="text-indigo-500" size={16} /> Patient Information</h2>
                                    <form onSubmit={submitNewCareRequest} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Full Name</label>
                                            <input required className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs focus:bg-white transition-all" placeholder="John Smith" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Age</label>
                                            <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs" placeholder="25" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Gender</label>
                                            <select className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select>
                                        </div>
                                        <div className="space-y-1 sm:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Medical Condition</label>
                                            <div className="relative">
                                                <select required className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs appearance-none cursor-pointer" value={formData.disease} onChange={e => setFormData({ ...formData, disease: e.target.value })} disabled={isListLoading}>
                                                    <option value="" disabled>{isListLoading ? "Fetching Database..." : "Select a diagnosed condition"}</option>
                                                    {diseaseList.map((disease, index) => <option key={index} value={disease}>{disease}</option>)}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                    {isListLoading ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} className="rotate-90" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 ml-1">Residence</label>
                                            <input required className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs" placeholder="City, State" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                        </div>
                                        <div className="sm:col-span-2 md:col-span-3 pt-2 flex justify-end">
                                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">Register Patient Record</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* List Grid with Skeletons */}
                            <div className="grid grid-cols-1 gap-3">
                                {isInitialLoading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3 w-full">
                                                <Skeleton className="w-10 h-10 rounded-xl" />
                                                <div className="space-y-1.5 flex-1">
                                                    <Skeleton className="w-36 h-4" />
                                                    <Skeleton className="w-24 h-3" />
                                                </div>
                                            </div>
                                            <Skeleton className="w-24 h-8 rounded-lg" />
                                        </div>
                                    ))
                                ) : (
                                    filteredPatients.map(p => (
                                        <div key={p._id} onClick={() => handleOpenCard(p)} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${p.isCured ? 'bg-white/60 border-slate-200 grayscale opacity-70' : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${p.isCured ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                                    {p.isCured ? <CheckCircle2 size={20} /> : <User size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className={`text-sm font-bold ${p.isCured ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{p.name}</h3>
                                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                                                        <span className="text-[10px] font-medium text-indigo-500 flex items-center gap-1 uppercase tracking-wider"><Activity size={10} /> {p.disease}</span>
                                                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1"><MapPin size={10} /> {p.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-2">
                                                <button onClick={(e) => toggleCured(e, p._id, p.isCured)} className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${p.isCured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white'}`}>
                                                    {p.isCured ? 'Successfully Recovered' : 'Mark as Cured'}
                                                </button>
                                                {!p.isCured && <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5 hidden sm:block" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </main>
                    </div>
                </div>

            </div>

        );
    }

    return (
        <div>
            <Header />
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <div className="flex-1 ">
                    {/* Top Navigation - Slimmed */}
                    <nav className="h-14 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-5 flex items-center justify-between border-b border-slate-200">
                        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-bold text-xs transition-all group">
                            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50"><ArrowLeft size={14} /></div>
                            Back to Registry
                        </button>
                        <div className="flex gap-2">
                            <NavLink to="/doctors">
                                <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100"><MessageSquare size={14} /> Consult Specialist</button>
                            </NavLink>
                        </div>
                    </nav>

                    <div className="p-4 md:p-6 max-w-screen mx-auto">
                        {/* Patient Summary Header - Compressed layout */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-slate-900">{selectedPatient.name}</h1>
                                    <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-0.5">{selectedPatient.disease}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                                <div className="bg-slate-50 p-2.5 rounded-xl min-w-[100px]">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Patient Age</p>
                                    <p className="text-sm font-bold text-slate-800">{selectedPatient.age} Years</p>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl min-w-[100px]">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Residence</p>
                                    <p className="text-sm font-bold text-slate-800">{selectedPatient.location.split(',')[0]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Intel Content Column */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loadingIntel ? (
                                    <Skeleton className="w-full aspect-video md:aspect-auto md:h-64 rounded-2xl" />
                                ) : wikiData?.originalimage && (
                                    <div className="rounded-2xl overflow-hidden border-2 border-white shadow-lg h-48 md:h-64">
                                        <img
                                            src={wikiData.originalimage.source}
                                            alt="Visual"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Local Resources Box - Densified interface */}
                                <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg border border-slate-800 h-64 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-sm flex items-center gap-1.5">
                                            <MapPin size={16} className="text-indigo-400" /> Local Resources
                                        </h3>
                                        {!loadingIntel && (
                                            <NavLink to="/doctors">
                                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-bold">
                                                    More Data
                                                </span>
                                            </NavLink>
                                        )}
                                    </div>

                                    {loadingIntel ? (
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="w-full h-16 bg-slate-800 rounded-xl" />
                                            <Skeleton className="w-full h-16 bg-slate-800 rounded-xl" />
                                        </div>
                                    ) : (
                                        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                                            <div className="group">
                                                <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-rose-500"></div> Urgent Care & Hospitals
                                                </h4>
                                                {nearbyData.hospitals.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {nearbyData.hospitals.slice(0, 2).map((h, i) => (
                                                            <a key={i} href={`https://www.google.com/maps?q=${h.lat},${h.lon}`} target="_blank" rel="noreferrer" className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] hover:bg-white/10 transition-all">
                                                                <span className="truncate pr-2 text-slate-200">{h.tags.name || "Medical Center"}</span>
                                                                <Navigation size={12} className="text-slate-500 shrink-0" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-500 italic pl-2.5">No hospitals found.</p>
                                                )}
                                            </div>

                                            <div className="group">
                                                <h4 className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Nearby Pharmacies
                                                </h4>
                                                {nearbyData.pharmacies.length > 0 ? (
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {nearbyData.pharmacies.slice(0, 2).map((p, i) => (
                                                            <a key={i} href={`https://www.google.com/maps?q=${p.lat},${p.lon}`} target="_blank" rel="noreferrer" className="flex justify-between items-center p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] hover:bg-white/10 transition-all">
                                                                <span className="truncate pr-2 text-slate-200">{p.tags.name || "Local Pharmacy"}</span>
                                                                <Navigation size={12} className="text-slate-500 shrink-0" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-500 italic pl-2.5">No pharmacies listed.</p>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-white/5">
                                                <div className="flex items-start gap-2 p-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                                    <LifeBuoy size={12} className="text-rose-500 shrink-0 mt-0.5" />
                                                    <p className="text-[9px] leading-tight text-rose-200/70 font-medium">
                                                        <strong>Emergency?</strong> Dial local emergency number immediately.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Clinical Overview Panel */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                    <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Overview</h2>
                                    <div className="h-px flex-1 bg-slate-200"></div>
                                </div>
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                                    {loadingIntel ? (
                                        <Skeleton className="w-full h-20 rounded-xl" />
                                    ) : (
                                        <div className="text-slate-600 text-sm leading-relaxed prose prose-indigo max-w-none" dangerouslySetInnerHTML={{ __html: wikiData?.extract || "No data." }} />
                                    )}
                                </div>
                            </section>

                            {/* Care Protocols Array Layout */}
                            <section>
                                <h2 className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-4"><ShieldCheck className="text-indigo-500" size={16} /> Care protocols</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {loadingIntel ? (
                                        [1, 2].map(i => <Skeleton key={i} className="w-full h-24 rounded-xl" />)
                                    ) : (
                                        nihSections?.map((section, idx) => (
                                            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                                                <h3 className="text-indigo-600 font-bold text-sm mb-1.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>{section.title}</h3>
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">{section.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Symptoms & Precautions Combined Blocks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100">
                                    <h3 className="text-amber-700 text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5"><Activity size={14} /> Key Symptoms</h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {loadingIntel ? <Skeleton className="w-full h-12" /> : internalData.symptoms ? Object.values(internalData.symptoms).filter(v => typeof v === 'string' && v.length > 1).map((s, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white text-amber-800 text-[10px] font-bold rounded-lg shadow-sm border border-amber-100">{s}</span>
                                        )) : <p className="text-[11px] text-slate-400">N/A</p>}
                                    </div>
                                </div>
                                <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                                    <h3 className="text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-1.5"><ShieldCheck size={14} /> Precautions</h3>
                                    {loadingIntel ? <Skeleton className="w-full h-12" /> : (
                                        <ul className="space-y-1.5">
                                            {internalData.precautions ? Object.entries(internalData.precautions).filter(([k, v]) => !['_id', '__v', 'Disease'].includes(k) && typeof v === 'string' && v.length > 1).map(([k, p], i) => (
                                                <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-700"><CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" /> {p}</li>
                                            )) : <p className="text-[11px] text-slate-400">N/A</p>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Component */}
                    <footer className="mt-8 border-t border-slate-200 bg-white p-5">
                        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><Microscope size={16} /></div>
                                <p className="text-[11px] font-bold text-slate-500">AI Patient Insight Engine v2.4</p>
                            </div>
                            <p className="text-[9px] font-medium text-slate-400 text-center sm:text-right max-w-sm leading-normal">
                                Open clinical source data context. Always consult a licensed medical professional before beginning treatments.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>

    );
};

export default PatientSupportHub;