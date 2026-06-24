import React, { useEffect, useState, useCallback } from 'react';
import { Search, ChevronRight, Loader2, Pill, Database, Cpu, X } from 'lucide-react';
import debounce from 'lodash.debounce';
import Header from '../Components/Header';

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
    <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800">
        <Header/>

        {/* Main Content Area */}
        <div className="transition-all duration-300 pb-16">
            
            {/* Professional Header Section */}
            <header className="pt-16 md:pt-10 pb-6 px-4 md:px-8 bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    
                    {/* Brand & Search Block */}
                    <div className="flex-1 space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                         
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                                    MediVault<span className="text-indigo-600">.</span>
                                </h1>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Verified Clinical Intelligence
                                </p>
                            </div>
                        </div>

                        {/* Streamlined Search Bar */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                                placeholder="Search clinical records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {loading && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <Loader2 className="animate-spin text-indigo-500" size={16} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compact AI Consultant Banner */}
                    <div 
                        onClick={() => window.location.href = '/medicinefinder'}
                        className="lg:w-[320px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 cursor-pointer transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border border-slate-200 group-hover:border-indigo-200 text-indigo-600 shrink-0">
                                <Cpu size={16} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Missing a Medicine?</h4>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    Consult our <span className="text-indigo-600 font-semibold">Clinical AI</span>
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                </div>
            </header>

            {/* Grid Area */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {medicines.map((med) => (
                        <button 
                            key={med._id} 
                            onClick={() => handleSelect(med._id)} 
                            className="group bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all text-left flex flex-col h-full"
                        >
                            <div className="aspect-[4/3] bg-slate-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden p-2 border border-slate-100">
                                {med.Image_URL ? (
                                    <img src={med.Image_URL} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <Pill size={24} className="text-slate-300" />
                                )}
                            </div>
                            <h3 className="font-semibold text-xs text-slate-900 uppercase truncate mb-0.5 group-hover:text-indigo-600 transition-colors">{med.Medicine_Name}</h3>
                            <p className="text-[10px] text-slate-400 font-medium truncate mb-3">{med.Manufacturer}</p>
                            
                            <div className="mt-auto pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                <span className="group-hover:text-indigo-600 transition-colors">Profile</span>
                                <ChevronRight size={12} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>

                {hasMore && !loading && medicines.length > 0 && (
                    <button
                        onClick={() => { setPage(p => p + 1); fetchMedicines(searchTerm, page + 1, true); }}
                        className="mt-8 mx-auto block px-6 py-2 bg-white border border-slate-200 rounded-full font-semibold text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                    >
                        Load More Records
                    </button>
                )}
            </main>
        </div>

        {/* Polished Detailed View Modal */}
        {selectedMed && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedMed(null)} />
                <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Close Button Mobile */}
                    <button 
                        onClick={() => setSelectedMed(null)}
                        className="absolute top-3 right-3 z-50 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full md:hidden text-slate-500"
                    >
                        <X size={16} />
                    </button>

                    {/* Modal Sidebar (Metrics & Visuals) */}
                    <div className="w-full md:w-[260px] bg-slate-50 p-5 flex flex-col border-b md:border-b-0 md:border-r border-slate-200/80 overflow-y-auto">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-5 flex justify-center items-center aspect-[4/3] md:aspect-square">
                            <img
                                src={selectedMed.Image_URL}
                                alt=""
                                className="max-h-28 md:max-h-36 object-contain mix-blend-multiply"
                            />
                        </div>
                        
                        {/* Sentiment Section - Refactored into Visual Bars */}
                        <div className="w-full space-y-3 mt-auto">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Sentiment</p>
                            <div className="space-y-2.5">
                                {[
                                    { type: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-700' },
                                    { type: 'Average', color: 'bg-amber-500', text: 'text-amber-700' },
                                    { type: 'Poor', color: 'bg-rose-500', text: 'text-rose-700' }
                                ].map(({ type, color, text }) => {
                                    const percentage = selectedMed[`${type}_Review_%`] || 0;
                                    return (
                                        <div key={type} className="space-y-1">
                                            <div className="flex justify-between text-[11px] font-medium text-slate-600">
                                                <span>{type}</span>
                                                <span className={`font-semibold ${text}`}>{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Modal Main Clinical Content */}
                    <div className="flex-1 p-6 md:p-7 overflow-y-auto flex flex-col justify-between">
                        <div>
                            <div className="hidden md:flex justify-end mb-2">
                                <button onClick={() => setSelectedMed(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                            </div>

                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedMed.Medicine_Name}</h2>
                                <p className="text-indigo-600 font-semibold text-[11px] tracking-wider uppercase mt-0.5">{selectedMed.Manufacturer}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chemical Composition</h4>
                                    <p className="text-slate-800 font-semibold text-sm">{selectedMed.Composition}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Clinical Uses</h4>
                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{selectedMed.Uses}</p>
                                </div>
                            </div>
                        </div>

                        {/* Context Warnings */}
                        <div className="mt-6 p-3.5 bg-rose-50/60 rounded-xl border border-rose-100">
                            <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Warnings & Side Effects</h4>
                            <p className="text-rose-950 text-xs font-medium leading-relaxed">{selectedMed.Side_effects}</p>
                        </div>
                    </div>

                </div>
            </div>
        )}
    </div>
);
};

export default MedicineFinderOurData;