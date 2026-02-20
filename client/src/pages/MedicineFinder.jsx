import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import Header from "../Components/Header";
import { ArrowRight, Camera, ChevronRight, Pill, Search } from "lucide-react";
import Sidebar from "../Components/Sidebar";

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
      if (drugName.length < 2) {
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
    <div>
      <Sidebar />
      <div className="ml-0 md:ml-64 pt-16 md:pt-16 pb-8 md:pb-12 px-4 md:px-10 bg-white/50 backdrop-blur-sm border-b border-slate-100 mb-8">
        <div className="max-w-screen mx-auto ">


          <div className="max-w-6xl mx-auto mb-16 px-4">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">MedScan Intelligence</h2>
              <p className="text-slate-500 font-medium">Scan labels or search the global FDA & MediVault registry.</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
              <div className="relative flex-1 w-full group">
                <div className="relative bg-white rounded-[2.5rem] md:rounded-full p-2 md:p-3 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-slate-100 transition-all duration-500 group-hover:shadow-indigo-500/10 group-hover:border-indigo-100">

                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        <Search
                          size={20}
                          className={`${loading ? "animate-spin text-indigo-500" : "text-slate-300"} transition-colors`}
                        />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-transparent border-none rounded-full pl-14 pr-6 py-4 md:py-6 text-base md:text-lg font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0"
                        placeholder="Search medication..."
                        value={drugName}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onChange={(e) => setDrugName(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 p-1 w-full md:w-auto">
                      <label className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-500 px-5 md:px-6 py-4 rounded-2xl md:rounded-full font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 border border-slate-100 shrink-0">
                        <Camera size={18} />
                        <span className="hidden sm:inline">Scan</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>

                      <button
                        onClick={() => searchDrug(drugName)}
                        className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-8 md:px-10 py-4 rounded-2xl md:rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 whitespace-nowrap"
                      >
                        {loading ? "Analyzing" : "Find Data"}
                        {!loading && <ChevronRight size={18} className="hidden sm:block" />}
                      </button>
                    </div>
                  </div>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 md:left-4 md:right-4 top-[105%] md:top-[90%] z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Matched Records</span>
                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{suggestions.length} Found</span>
                      </div>

                      <div className="max-h-[280px] overflow-y-auto">
                        {suggestions.map((s, i) => (
                          <div
                            key={i}
                            onMouseDown={() => { setDrugName(s); searchDrug(s); }}
                            className="group px-5 py-4 hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-none"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Pill size={16} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{s}</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FDA Live Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neural OCR Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-100 text-red-500 p-5 rounded-2xl text-center mb-8 font-bold text-sm">{error}</div>}

          {(loading || ocrLoading) && (
            <div className="text-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase">Accessing FDA Records...</p>
            </div>
          )}

          {drugData && (
            <div className="bg-white rounded-xl shadow-2xl border border-blue-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900 text-white p-10 md:p-14">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-blue-400 font-black text-[10px] tracking-[0.4em] uppercase">Verified Record</span>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter mt-2">{drugData.brandName}</h2>
                    <p className="text-xl text-slate-400 font-bold mt-2 uppercase">{drugData.genericName}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-blue-300 uppercase mb-2">Manufacturer</p>
                    <p className="text-sm font-bold">{drugData.manufacturer}</p>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-4 bg-slate-50 p-10 border-r border-slate-100">
                  <div className="space-y-6">
                    <SideItem label="Active Ingredients" value={drugData.active} color="text-blue-600" />
                    <SideItem label="Inactive Compounds" value={drugData.inactive} />
                    <SideItem label="Environmental Storage" value={drugData.storage} />
                    <SideItem label="Support" value={drugData.questions} />
                  </div>
                </div>

                <div className="lg:col-span-8 p-10 md:p-14 space-y-12">
                  <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-slate-200"></span> Usage & Purpose
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <InfoBlock title="Purpose" content={drugData.purpose} />
                      <InfoBlock title="Indications" content={drugData.indications} />
                      <div className="md:col-span-2">
                        <InfoBlock title="Dosage & Administration" content={drugData.dosage} />
                      </div>
                    </div>
                  </section>

                  <section className="bg-amber-50/50 p-8 md:p-12 rounded-[2.5rem] border border-amber-100">
                    <h3 className="text-xs font-black text-amber-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                      <span className="w-8 h-[1px] bg-amber-200"></span> Safety Protocols
                    </h3>
                    <div className="space-y-8">
                      <SafetyRow label="General Warnings" text={drugData.warnings} />
                      <SafetyRow label="Do Not Use" text={drugData.doNotUse} />
                      <SafetyRow label="Consult Physician If" text={drugData.askDoctor} />
                      <SafetyRow label="Stop Use Condition" text={drugData.stopUse} />
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="p-4 bg-white rounded-2xl border border-amber-100">
                          <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Pregnancy/Breastfeeding</p>
                          <p className="text-xs font-medium">{drugData.pregnancy}</p>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-amber-100">
                          <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Child Safety</p>
                          <p className="text-xs font-medium">{drugData.keepOutReach}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {drugData.overdose && (
                    <section className="bg-red-600/80 text-white p-8 rounded-[2rem] flex items-center gap-6 shadow-lg shadow-red-200">
                      <div className="text-3xl">⚠️</div>
                      <div>
                        <h4 className="font-black uppercase tracking-widest text-xs mb-1">Emergency Overdosage Protocol</h4>
                        <p className="text-sm font-bold opacity-95">{drugData.overdose}</p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

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

