import React, { useEffect, useState, useMemo } from 'react';
import { Search, Pill, Droplets, Thermometer, Info, ChevronRight, Activity, Database, Server, Cpu, ShieldCheck, Loader2 } from 'lucide-react';
import Header from '../Components/Header';

const MedicineFinderOurData = () => {
    const [data, setData] = useState([]);
    const [selectedMed, setSelectedMed] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadStage, setLoadStage] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoadStage(1);
                const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/medicine/getmedicine`);
                const result = await response.json();
                const allMedicines = result.data || result;

                if (Array.isArray(allMedicines)) {
                    setData(allMedicines);
                    if (allMedicines.length > 0) setSelectedMed(allMedicines[0]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const filteredList = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return data.slice(0, 100);

        return data
            .filter(m => {
                const medName = (m["Medicine Name"] || m["Medicine_Name"] || "").toLowerCase();
                return medName.includes(term);
            })
            .slice(0, 100);
    }, [searchTerm, data]);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden">
            <Header />
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative flex flex-col items-center max-w-md text-center px-6">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-indigo-100 rounded-3xl rotate-6 animate-pulse"></div>
                    <div className="absolute inset-0 bg-indigo-50 rounded-3xl -rotate-6 animate-pulse delay-75"></div>
                    <div className="relative bg-white border border-indigo-100 p-8 rounded-3xl shadow-xl shadow-indigo-100/50 z-10">
                        <Database className="text-indigo-600 animate-bounce" size={48} />
                    </div>
                    <div className="absolute -top-4 -right-4 bg-emerald-500 p-2 rounded-full text-white shadow-lg animate-bounce delay-150">
                        <ShieldCheck size={16} />
                    </div>
                    <div className="absolute -bottom-2 -left-4 bg-blue-500 p-2 rounded-full text-white shadow-lg animate-bounce delay-300">
                        <Server size={16} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight italic">
                        Synchronizing MediVault<span className="text-indigo-600">.</span>
                    </h2>

                    <div className="bg-slate-100 h-1.5 w-64 rounded-full mx-auto overflow-hidden">
                        <div className="bg-indigo-600 h-full w-full origin-left animate-[loading-bar_3s_ease-in-out_infinite]"></div>
                    </div>

                    <div className="min-h-[60px]">
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-1 animate-pulse">
                            System Operations
                        </p>
                        <p className="text-indigo-600 font-semibold text-sm transition-all duration-500 ease-in-out">
                            {[
                                "Connecting to secure medicine vault...",
                                "Fetching 11,826 clinical records...",
                                "Indexing manufacturer data...",
                                "Optimizing database for search speed...",
                                "Finalizing clinical dashboard..."
                            ][loadStage]}
                        </p>
                    </div>
                </div>
                <div className="mt-12 p-4 rounded-2xl bg-amber-50 border border-amber-100 inline-flex items-center gap-3">
                    <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                        <Cpu size={14} />
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium text-left">
                        We are loading <span className="font-bold underline">11,826 clinical items</span> from our secure
                        local database. This ensures high-speed offline search once completed.
                        Please stay on this page.
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900 pt-16">
            <Header />
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl z-10">
                <div className="p-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-indigo-200 shadow-lg">
                            <Pill className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">MediVault<span className="text-indigo-600">.</span></h1>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm} // Controlled input
                            placeholder={`Search ${data.length} medicines...`}
                            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                            Showing {filteredList.length} matches
                        </p>
                        {isSyncing && (
                            <div className="flex items-center gap-1 text-indigo-500 animate-pulse">
                                <Loader2 size={10} className="animate-spin" />
                                <span className="text-[8px] font-bold uppercase">Syncing...</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredList.map((med) => (
                        <button
                            key={med._id}
                            onClick={() => setSelectedMed(med)}
                            className={`w-full flex items-center justify-between p-4 transition-all border-b border-gray-50 ${selectedMed?._id === med._id ? "bg-indigo-50 border-r-4 border-r-indigo-600" : "hover:bg-gray-50"
                                }`}
                        >
                            <div className="text-left overflow-hidden">
                                <p className={`font-semibold text-sm truncate ${selectedMed?._id === med._id ? "text-indigo-700" : "text-gray-700"}`}>
                                    {med["Medicine Name"] || med["Medicine_Name"]}
                                </p>
                                <p className="text-xs text-gray-400 uppercase mt-1 truncate">{med["Manufacturer"]}</p>
                            </div>
                            <ChevronRight size={14} className={selectedMed?._id === med._id ? "text-indigo-600" : "text-gray-300"} />
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                {selectedMed ? (
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-10 text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 space-y-2 max-w-[70%]">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                                    Data ID: {selectedMed._id.slice(-6)}
                                </span>
                                <h2 className="text-5xl font-extrabold tracking-tight leading-tight">
                                    {selectedMed["Medicine Name"] || selectedMed["Medicine_Name"]}
                                </h2>
                                <p className="text-indigo-100 text-lg opacity-90 italic font-light">
                                    {selectedMed["Manufacturer"]} • {selectedMed["Composition"]}
                                </p>
                            </div>
                            <div className="relative z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner">
                                <img
                                    src={selectedMed["Image_URL"] || selectedMed["Image URL"]}
                                    alt="Product"
                                    className="w-40 h-40 object-contain rounded-lg drop-shadow-2xl"
                                />
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Info size={16} /> Therapeutic Usage
                                    </h3>
                                    <p className="text-xl text-slate-700 leading-relaxed font-medium">{selectedMed["Uses"]}</p>
                                </section>

                                <section className="bg-red-50/30 p-8 rounded-3xl border border-red-100">
                                    <h3 className="text-red-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Thermometer size={16} /> Adverse Effects
                                    </h3>
                                    <p className="text-red-900 font-medium leading-relaxed">{selectedMed["Side_effects"]}</p>
                                </section>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 h-fit">
                                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Activity size={16} /> Patient Satisfaction
                                </h3>
                                <div className="space-y-6">
                                    <SatisfactionBar label="Excellent" value={selectedMed["Excellent_Review_%"] || selectedMed["Excellent Review %"]} color="#4F46E5" />
                                    <SatisfactionBar label="Average" value={selectedMed["Average_Review_%"] || selectedMed["Average Review %"]} color="#94A3B8" />
                                    <SatisfactionBar label="Poor" value={selectedMed["Poor_Review_%"] || selectedMed["Poor Review %"] || selectedMed["Poor _eview_%"]} color="#FDA4AF" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <Droplets size={80} className="mb-4 animate-pulse" />
                        <p className="text-xl font-light tracking-widest uppercase">Select Record</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const SatisfactionBar = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-900">{value || 0}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${value || 0}%`, backgroundColor: color }}
            ></div>
        </div>
    </div>
);

export default MedicineFinderOurData;