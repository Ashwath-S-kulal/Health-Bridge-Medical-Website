import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import Header from "../Components/Header";
import { ArrowRight, Camera, ChevronRight, Pill, Search } from "lucide-react";

const App = () => {
  const [drugName, setDrugName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [drugData, setDrugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (drugName.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const url = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:${drugName}*+openfda.generic_name:${drugName}*)&limit=10`;
        const res = await axios.get(url);
        const brandNames = res.data.results.map(r => r.openfda?.brand_name?.[0]).filter(Boolean);
        const genericNames = res.data.results.map(r => r.openfda?.generic_name?.[0]).filter(Boolean);
        const combined = [...new Set([...brandNames, ...genericNames])]
          .filter(name => name.toLowerCase().includes(drugName.toLowerCase()))
          .slice(0, 6);
        setSuggestions(combined);
      } catch (err) {
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeoutId);
  }, [drugName]);

  const searchDrug = async (name) => {
    if (!name) return false;
    setLoading(true);
    setError("");
    setShowSuggestions(false);
    try {
      const url = `https://api.fda.gov/drug/label.json?search=(openfda.brand_name:"${name}"+openfda.generic_name:"${name}")&limit=1`;
      const res = await axios.get(url);
      if (res.data.results && res.data.results[0]) {
        const item = res.data.results[0];
        setDrugData({
          brandName: item.openfda?.brand_name?.[0] || "Unknown",
          genericName: item.openfda?.generic_name?.[0] || "N/A",
          manufacturer: item.openfda?.manufacturer_name?.[0] || "N/A",
          purpose: item.purpose?.[0],
          indications: item.indications_and_usage?.[0],
          dosage: item.dosage_and_administration?.[0],
          warnings: item.warnings?.[0],
          doNotUse: item.do_not_use?.[0],
          askDoctor: item.ask_doctor?.[0],
          stopUse: item.stop_use?.[0],
          pregnancy: item.pregnancy_or_breast_feeding?.[0],
          keepOutReach: item.keep_out_of_reach_of_children?.[0],
          overdose: item.overdosage?.[0],
          active: item.active_ingredient?.[0],
          inactive: item.inactive_ingredient?.[0],
          storage: item.storage_and_handling?.[0],
          questions: item.questions?.[0],
          img: `https://dailymed.nlm.nih.gov/dailymed/image.cfm?setid=${item.set_id}&type=img`
        });
        setDrugName(item.openfda?.brand_name?.[0] || name);
        return true;
      }
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };

  const optimizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width; canvas.height = img.height;
          ctx.filter = "grayscale(100%) contrast(150%) brightness(110%)";
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    setError("");
    setDrugData(null);
    try {
      const processedImage = await optimizeImage(file);
      setImagePreview(processedImage);
      const { data } = await Tesseract.recognize(processedImage, "eng");
      const words = data.text.split(/[\s\n]+/).map(w => w.replace(/[^A-Za-z]/g, "")).filter(w => w.length > 5);
      let found = false;
      for (const word of words.slice(0, 3)) {
        if (await searchDrug(word)) { found = true; break; }
      }
      if (!found) setError(`Identification failed for: ${words[0] || 'Unknown'}`);
    } catch (err) {
      setError("OCR Analysis failed.");
    } finally {
      setOcrLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800">
    <Header/>
    
    {/* Main Content Pane */}
    <div className="transition-all duration-300 pb-16">
      
      {/* Top Section Header */}
      <header className="pt-3 md:pt-10 pb-6 px-4 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">MedScan Intelligence</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Scan labels or lookup global FDA & MediVault registries instantly.</p>
          </div>
          
          {/* Status Pills */}
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>FDA Live Sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Neural OCR Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Layout Wrapper */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* Search Engine Interface */}
        <div className="w-full relative mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col md:flex-row items-center gap-1.5">
              
              {/* Query Field */}
              <div className="relative flex-1 w-full">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search 
                    size={16} 
                    className={`${loading ? "animate-spin text-indigo-500" : "text-slate-400"} transition-colors`} 
                  />
                </div>
                <input
                  type="text"
                  className="w-full bg-transparent border-none rounded-lg pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  placeholder="Search medication name or ingredient..."
                  value={drugName}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onChange={(e) => setDrugName(e.target.value)}
                />
              </div>

              {/* Functional Actions */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-2 md:pt-0">
                <label className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer transition-all active:scale-[0.98] flex-1 md:flex-none">
                  <Camera size={14} />
                  <span>Scan Label</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <button
                  onClick={() => searchDrug(drugName)}
                  className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>{loading ? "Analyzing" : "Find Records"}</span>
                  {!loading && <ChevronRight size={14} />}
                </button>
              </div>

            </div>
          </div>

          {/* Autocomplete Micro-Overlay */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[105%] z-50 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Matched Registry Records</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{suggestions.length} Match</span>
              </div>
              <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-50">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onMouseDown={() => { setDrugName(s); searchDrug(s); }}
                    className="group px-4 py-2.5 hover:bg-indigo-50/60 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Pill size={12} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{s}</span>
                    </div>
                    <ChevronRight size={12} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Messaging & Indicators */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl text-center mb-6 font-semibold text-xs">
            {error}
          </div>
        )}

        {(loading || ocrLoading) && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-2" />
            <p className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">Querying Active Database...</p>
          </div>
        )}

        {/* FDA Data Document View */}
        {drugData && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Document Header */}
            <div className="bg-slate-900 text-white p-6 md:p-8 border-b border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-md">Verified FDA Clinical Record</span>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight mt-2">{drugData.brandName}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-wide">{drugData.genericName}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg max-w-xs">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Labeler / Manufacturer</p>
                  <p className="text-xs font-semibold text-slate-200">{drugData.manufacturer}</p>
                </div>
              </div>
            </div>

            {/* Document Profile Splitting */}
            <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              {/* Formula & Properties Sidebar */}
              <div className="lg:col-span-4 bg-slate-50/60 p-5 space-y-5">
                <SideItem label="Active Ingredients" value={drugData.active} color="text-indigo-600" />
                <SideItem label="Inactive Compounds" value={drugData.inactive} />
                <SideItem label="Environmental Storage" value={drugData.storage} />
                <SideItem label="Medical Support Contact" value={drugData.questions} />
              </div>

              {/* Core Clinical Parameters */}
              <div className="lg:col-span-8 p-6 md:p-8 space-y-6">
                
                {/* Section: Usage Details */}
                <section>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-slate-200" /> Usage & Administration
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoBlock title="Mechanism / Purpose" content={drugData.purpose} />
                    <InfoBlock title="Clinical Indications" content={drugData.indications} />
                    <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <InfoBlock title="Dosage & Administration Guidelines" content={drugData.dosage} />
                    </div>
                  </div>
                </section>

                {/* Section: Warnings / Safety Protocol */}
                <section className="bg-amber-50/40 p-4 md:p-5 rounded-xl border border-amber-200/60">
                  <h3 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-amber-200" /> Contraindications & Warnings
                  </h3>
                  <div className="space-y-3.5 divide-y divide-amber-100/60">
                    <SafetyRow label="General Warnings" text={drugData.warnings} />
                    <SafetyRow label="Do Not Use" text={drugData.doNotUse} />
                    <SafetyRow label="Consult Physician If" text={drugData.askDoctor} />
                    <SafetyRow label="Stop Use Indicators" text={drugData.stopUse} />
                  </div>
                  
                  {/* Demographic Variables */}
                  <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-amber-200/60 mt-4">
                    <div className="p-3 bg-white rounded-lg border border-amber-100">
                      <p className="text-[9px] font-bold uppercase text-amber-700 mb-0.5">Pregnancy / Lactation</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{drugData.pregnancy}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-amber-100">
                      <p className="text-[9px] font-bold uppercase text-amber-700 mb-0.5">Child Restrictive Controls</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{drugData.keepOutReach}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Critical Incident Controls */}
                {drugData.overdose && (
                  <section className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                    <div className="text-base shrink-0 bg-rose-500 text-white w-6 h-6 rounded-md flex items-center justify-center font-bold">⚠️</div>
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-[10px] text-rose-800">Emergency Overdose Protocol</h4>
                      <p className="text-xs font-medium text-rose-950 mt-0.5 leading-relaxed">{drugData.overdose}</p>
                    </div>
                  </section>
                )}
              </div>

            </div>
          </div>
        )}
      </main>

    </div>
  </div>
);
};

const SideItem = ({ label, value, color = "text-slate-700" }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xs font-bold leading-relaxed ${color}`}>{value || "N/A"}</p>
  </div>
);

const InfoBlock = ({ title, content }) => (
  <div>
    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">{title}</h4>
    <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">{content || "Not specified."}</p>
  </div>
);

const SafetyRow = ({ label, text }) => (
  <div className="border-b border-amber-200/50 pb-4 last:border-0">
    <p className="text-[10px] font-black text-amber-700 uppercase mb-1">{label}</p>
    <p className="text-sm text-slate-800 font-medium leading-relaxed">{text || "No specific restrictions listed."}</p>
  </div>
);

export default App;

