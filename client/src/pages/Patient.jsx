import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Heart, Search, Plus, MapPin, ChevronRight, X,
    MessageSquare, Info, ArrowLeft, LifeBuoy,
    CheckCircle2, Activity, ShieldCheck
} from "lucide-react";
import Sidebar from "../Components/Sidebar";

const PatientSupportHub = () => {
    const [view, setView] = useState("list");
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loadingIntel, setLoadingIntel] = useState(false);
    const [nihSections, setNihSections] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [nearbyData, setNearbyData] = useState({ hospitals: [], pharmacies: [] });
    const [internalData, setInternalData] = useState({ desc: null, precautions: [], symptoms: [] });
    const [formData, setFormData] = useState({
        name: "", age: "", gender: "Male", disease: "", location: ""
    });

    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/patient/get`, getAuthHeaders());
            setPatients(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchSupportIntelligence = async (patient) => {
        setLoadingIntel(true);
        const diseaseName = patient.disease;
        const location = patient.location;
        const queryTerm = diseaseName.toLowerCase().trim();
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
                }).catch(() => setNihSections(null));

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
            }).catch((err) => {
                console.error("Fetch Error:", err);
                setInternalData({ desc: null, precautions: null, symptoms: null });
            });

            await Promise.all([wikiPromise, nihPromise, nearbyPromise, internalPromise]);
            console.log(internalPromise)
        } finally {
            setLoadingIntel(false);
        }
    };

    const handleOpenCard = (patient) => {
        if (patient.isCured) return;
        setSelectedPatient(patient);
        fetchSupportIntelligence(patient);
        setView("details");
        window.scrollTo(0, 0);
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
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <div className="flex-1 w-full lg:ml-64 transition-all duration-300">
                    <main className="p-4 md:p-8 lg:p-12 mt-16 lg:mt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                            <div className="sm:col-span-2 lg:col-span-1">
                                <div className="flex items-center gap-2 text-blue-500 mb-2">
                                    <Heart size={20} fill="currentColor" className="animate-pulse" />
                                    <span className="font-black tracking-[0.2em] text-[9px] uppercase">CareSupport Hub</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Patient Hub</h1>
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Recovered</p>
                                    <p className="text-xl font-black text-slate-900">{stats.recovered}</p>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl flex items-center gap-4 text-white shadow-lg shadow-slate-200">
                                <div className="w-10 h-10 bg-slate-800 text-rose-400 rounded-xl flex items-center justify-center shrink-0"><Activity size={24} /></div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Active</p>
                                    <p className="text-xl font-black">{stats.active}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-100 outline-none transition-all shadow-sm"
                                    placeholder="Search records..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-black transition-all active:scale-95 shadow-md shadow-rose-100">
                                {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                                {isFormOpen ? "Close" : "Add Patient"}
                            </button>
                        </div>

                        {isFormOpen && (
                            <div className="bg-white border-2 border-blue-100 rounded-xl p-6 md:p-8 mb-8 animate-in slide-in-from-top-4 duration-500 shadow-xl">
                                <form onSubmit={submitNewCareRequest} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                                        <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Age</label>
                                        <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="Age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Gender</label>
                                        <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Condition</label>
                                        <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="e.g. GERD" value={formData.disease} onChange={e => setFormData({ ...formData, disease: e.target.value })} />
                                    </div>
                                    <div className="sm:col-span-2 md:col-span-3 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Home Location</label>
                                        <input required className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" placeholder="City, State" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>
                                    <div className="flex items-end">
                                        <button type="submit" className="w-fit bg-slate-900 text-white font-black text-[11px] uppercase px-5 py-3 rounded-md hover:bg-blue-500 transition-all shadow-lg active:scale-95">Register Patient</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredPatients.map(p => (
                                <div
                                    key={p._id}
                                    onClick={() => handleOpenCard(p)}
                                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 md:p-4 rounded-md border transition-all 
                                        ${p.isCured
                                            ? 'bg-slate-50 border-slate-100 opacity-75'
                                            : 'bg-white border-white shadow-sm hover:shadow-md hover:border-rose-100 cursor-pointer'}`}
                                >
                                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                        <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0
                                            ${p.isCured ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                                            {p.isCured ? <CheckCircle2 size={24} /> : <LifeBuoy size={24} />}
                                        </div>
                                        <div>
                                            <h3 className={`text-md font-black ${p.isCured ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{p.name}</h3>
                                            <p className={`text-[9px] font-black uppercase tracking-widest ${p.isCured ? 'text-slate-300' : 'text-blue-400'}`}>
                                                {p.disease} • {p.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4">
                                        <button
                                            onClick={(e) => toggleCured(e, p._id, p.isCured)}
                                            className={`flex-1 sm:flex-none px-5 py-2 rounded-md text-[10px] font-black uppercase transition-all
                                                ${p.isCured
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-green-500 hover:text-white'}`}
                                        >
                                            {p.isCured ? 'Recovered' : 'Mark Cured'}
                                        </button>
                                        {!p.isCured && <ChevronRight size={20} className="text-slate-300 hidden sm:block" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <nav className="h-16 md:h-20 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-12 flex items-center justify-between">
                    <button onClick={() => setView("list")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                        <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Hub</span><span className="sm:hidden">Back</span>
                    </button>
                    <button className="bg-slate-900 text-white px-4 md:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={14} /> <span className="hidden sm:inline">Get Support</span>
                    </button>
                </nav>

                <div className="p-4 md:p-8 lg:p-12">
                    <header className="mb-8 md:mb-12 border-b border-slate-100 pb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Help Guide</h1>
                        <p className="text-slate-500 text-base md:text-lg">Condition: <span className="font-semibold text-slate-800">{selectedPatient.disease}</span> for {selectedPatient.name}</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-2 space-y-8 md:space-y-12">
                            <section>
                                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-rose-500 mb-6">
                                    <Info size={18} /> About this condition
                                </h2>
                                <div className="bg-slate-50 rounded-3xl p-6 md:p-8">
                                    {loadingIntel ? (
                                        <div className="space-y-3">
                                            <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4"></div>
                                            <div className="h-4 bg-slate-200 animate-pulse rounded w-full"></div>
                                            <div className="h-4 bg-slate-200 animate-pulse rounded w-5/6"></div>
                                        </div>
                                    ) : (
                                        <div className="text-slate-700 text-base md:text-lg leading-relaxed prose prose-slate"
                                            dangerouslySetInnerHTML={{ __html: wikiData?.extract || "No description found." }} />
                                    )}
                                </div>
                            </section>

                            <section>
                                <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-rose-500 mb-6">
                                    <Heart size={18} /> Care & Support Steps
                                </h2>
                                <div className="space-y-4">
                                    {loadingIntel ? (
                                        [1, 2].map((i) => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-2xl"></div>)
                                    ) : (
                                        nihSections?.map((section, idx) => (
                                            <div key={idx} className="border border-slate-100 rounded-2xl p-5 md:p-6 bg-white shadow-sm">
                                                <h3 className="text-slate-900 font-bold mb-2">{section.title}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                                <div className="bg-amber-50 rounded-[2rem] p-6 md:p-8 border border-amber-100">
                                    <h3 className="text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Activity size={16} /> Observed Symptoms
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalData.symptoms ? Object.values(internalData.symptoms).filter(v => typeof v === 'string' && v.length > 1).map((s, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/50 p-2 rounded-lg">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></div> {s}
                                            </li>
                                        )) : <p className="text-[10px] text-slate-400">No specific symptoms logged.</p>}
                                    </ul>
                                </div>

                                <div className="bg-emerald-50 rounded-[2rem] p-6 md:p-8 border border-emerald-100">
                                    <h3 className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <ShieldCheck size={16} /> Safety Precautions
                                    </h3>
                                    <ul className="space-y-2">
                                        {internalData.precautions ? Object.entries(internalData.precautions)
                                            .filter(([key, value]) => !['_id', '__v', 'Disease'].includes(key) && typeof value === 'string' && value.length > 1)
                                            .map(([key, p], i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/50 p-2 rounded-lg">
                                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> {p}
                                                </li>
                                            )) : <p className="text-[10px] text-slate-400">No specific precautions logged.</p>}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {!loadingIntel && wikiData?.originalimage && (
                                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-lg">
                                    <img src={wikiData.originalimage.source} alt="Condition" className="w-full h-auto object-cover max-h-64 lg:max-h-none" />
                                </div>
                            )}

                            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl">
                                <h3 className="font-bold mb-4">Patient Profile</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center sm:block">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Location</p>
                                        <p className="text-sm">{selectedPatient.location}</p>
                                    </div>
                                    <div className="flex justify-between items-center sm:block">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Age</p>
                                        <p className="text-sm">{selectedPatient.age} years</p>
                                    </div>
                                    <button className="w-full bg-rose-500 py-4 rounded-2xl text-[10px] font-black uppercase hover:bg-rose-600 transition-all mt-4">
                                        Print Medical Guide
                                    </button>
                                </div>
                            </div>

                            <section className="space-y-6">
                                <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-rose-500">
                                    <MapPin size={18} /> Nearby Resources
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black text-blue-600 uppercase mb-3">Hospitals</p>
                                        <div className="space-y-2">
                                            {nearbyData.hospitals.slice(0, 3).map((h, i) => (
                                                <div key={i} className="text-[11px] font-bold text-slate-600 flex justify-between gap-2">
                                                    <span className="truncate">{h.tags.name}</span>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lon}`} target="_blank" rel="noreferrer" className="text-blue-500 shrink-0">Map</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] font-black text-green-600 uppercase mb-3">Pharmacies</p>
                                        <div className="space-y-2">
                                            {nearbyData.pharmacies.slice(0, 3).map((p, i) => (
                                                <div key={i} className="text-[11px] font-bold text-slate-600 flex justify-between gap-2">
                                                    <span className="truncate">{p.tags.name}</span>
                                                    <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} target="_blank" rel="noreferrer" className="text-green-500 shrink-0">Map</a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSupportHub;