import React, { useEffect, useState, useCallback } from 'react';
import { Search, ChevronRight, Loader2, Pill, Database, Cpu, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import debounce from 'lodash.debounce';

const MedicineFinderOurData = () => {
    const [medicines, setMedicines] = useState([]);
    const [selectedMed, setSelectedMed] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMedicines = async (query, pageNum, append = false) => {
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_BASE_URI}/api/medicine/suggestions?q=${query}&page=${pageNum}&limit=20`;
            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setMedicines(prev => append ? [...prev, ...result.data] : result.data);
                setHasMore(result.currentPage < result.totalPages);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            setPage(1);
            fetchMedicines(query, 1, false);
        }, 400),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleSelect = async (id) => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URI}/api/medicine/${id}`);
        const result = await response.json();
        if (result.success) setSelectedMed(result.data);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div className="lg:ml-64 transition-all duration-300 pb-20">
                
                <header className=" pt-20 md:pt-16 pb-8 md:pb-12 px-4 md:px-10 bg-white/50 backdrop-blur-sm border-b border-slate-100 mb-8">
                    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-start xl:items-center gap-8 md:gap-10">

                        <div className="flex-1 w-full space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 hidden md:block">
                                    <Database size={24} className="text-white " />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 leading-none">
                                        MediVault<span className="text-indigo-600">.</span>
                                    </h1>
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">
                                        Verified Clinical Intelligence
                                    </p>
                                </div>
                            </div>

                            <div className="relative group w-full">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[1.5rem] md:rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
                                <div className="relative bg-white border border-slate-200 rounded-[1.2rem] md:rounded-full flex items-center p-1 shadow-sm transition-all focus-within:border-indigo-300">
                                    <Search className="ml-3 md:ml-5 text-slate-300 shrink-0" size={18} />
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent border-none py-3 md:py-4 px-3 md:px-5 text-sm md:text-lg font-bold placeholder:text-slate-300 outline-none focus:ring-0"
                                        placeholder="Search clinical records..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {loading && <Loader2 className="animate-spin text-indigo-500 mr-4" size={20} />}
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => window.location.href = '/medicinefinder'}
                            className="w-full xl:w-[380px] group cursor-pointer"
                        >
                            <div className="relative bg-[#F9F9F7] rounded-xl md:rounded-2xl p-5 md:p-6 border border-[#E5E5DE] transition-all hover:bg-[#F2F2EB]">
                                <div className="flex gap-4 md:gap-5 items-center relative z-10">
                                    <div className="shrink-0 bg-white border border-[#E5E5DE] p-3 md:p-4 rounded-2xl group-hover:bg-indigo-50 transition-all">
                                        <Cpu size={22} className="text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-slate-800 font-black text-sm md:text-base uppercase">Missing a Medicine?</h3>
                                        <p className="text-slate-500 text-[10px] md:text-[11px] leading-relaxed mt-1 font-medium">
                                            Consult our <span className="text-indigo-600 font-bold">Clinical AI</span>
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {medicines.map((med) => (
                            <button key={med._id} onClick={() => handleSelect(med._id)} className="group bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col h-full">
                                <div className="aspect-square bg-slate-50 rounded-xl md:rounded-2xl mb-4 flex items-center justify-center overflow-hidden p-2">
                                    {med.Image_URL ? (
                                        <img src={med.Image_URL} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                                    ) : (
                                        <Pill size={32} className="text-slate-200" />
                                    )}
                                </div>
                                <h3 className="font-bold text-[11px] md:text-sm uppercase truncate mb-1">{med.Medicine_Name}</h3>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase truncate">{med.Manufacturer}</p>
                                <div className="mt-auto pt-3 md:pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase">Profile</span>
                                    <ChevronRight size={12} className="text-slate-300" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {hasMore && !loading && medicines.length > 0 && (
                        <button
                            onClick={() => { setPage(p => p + 1); fetchMedicines(searchTerm, page + 1, true); }}
                            className="mt-12 mx-auto block px-8 py-3 bg-white border border-slate-200 rounded-full font-bold text-xs md:text-sm hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Load More Records
                        </button>
                    )}
                </main>
            </div>

            {selectedMed && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedMed(null)} />
                    <div className="relative w-full max-w-4xl bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] animate-in fade-in zoom-in duration-200">
                                                <button 
                            onClick={() => setSelectedMed(null)}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full md:hidden"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-full md:w-1/3 bg-slate-50 p-6 md:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto">
                            <div className="bg-white p-4 h-fit rounded-2xl shadow-sm mb-6 w-full flex justify-center aspect-square md:aspect-auto">
                                <img
                                    src={selectedMed.Image_URL}
                                    alt=""
                                    className="max-h-32 md:max-h-48 object-contain mix-blend-multiply"
                                />
                            </div>
                            <div className="w-full space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Sentiment</p>
                                <div className="space-y-2">
                                    {['Excellent', 'Average', 'Poor'].map((type) => (
                                        <div key={type} className="flex justify-between text-xs font-bold">
                                            <span>{type}:</span>
                                            <span className={type === 'Excellent' ? 'text-emerald-600' : type === 'Average' ? 'text-amber-600' : 'text-rose-600'}>
                                                {selectedMed[`${type}_Review_%`]}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <div className="hidden md:flex justify-end mb-4">
                                <button onClick={() => setSelectedMed(null)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{selectedMed.Medicine_Name}</h2>
                                <p className="text-indigo-600 font-bold text-xs md:text-sm tracking-widest uppercase">{selectedMed.Manufacturer}</p>
                            </div>

                            <div className="space-y-6 md:space-y-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Chemical Composition</h4>
                                    <p className="text-slate-800 font-bold text-base md:text-lg">{selectedMed.Composition}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Primary Clinical Uses</h4>
                                    <p className="text-slate-700 text-sm md:text-base leading-relaxed">{selectedMed.Uses}</p>
                                </div>
                                <div className="p-4 md:p-6 bg-rose-50 rounded-xl md:rounded-2xl border border-rose-100">
                                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Warnings & Side Effects</h4>
                                    <p className="text-rose-900 text-xs md:text-sm font-medium leading-relaxed">{selectedMed.Side_effects}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicineFinderOurData;