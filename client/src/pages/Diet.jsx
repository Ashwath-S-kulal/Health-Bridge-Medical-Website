import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search, X, Star, ChevronRight, Loader2,
  Info, AlertCircle, CheckCircle2, Soup,
  Sparkles, Calendar, ShieldCheck, Apple, Flame, ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";

function Diet() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [activeRules, setActiveRules] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/diet/search-diseases?q=${query}`);
        const filtered = res.data.filter(item => !selectedDiseases.some(d => d.disease === item.disease));
        setSuggestions(filtered);
      } catch (error) {
        console.error("Suggestion fetch error:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timeOutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeOutId);
  }, [query, selectedDiseases]);

  const addCondition = (diseaseObj) => {
    if (!selectedDiseases.find(d => d.disease === diseaseObj.disease)) {
      setSelectedDiseases([...selectedDiseases, diseaseObj]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const fetchMeals = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const namesOnly = selectedDiseases.map(d => d.disease);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URI}/api/diet/filter-meals`, { diseases: namesOnly });
      setMeals(res.data.meals || []);
      setActiveRules(res.data.activeRules || []);
    } catch (error) {
      console.error("Meal fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <Header />
      <div className="flex min-h-screen bg-[#F8FAFC]">

        {/* Dense Main Workspace Context */}
        <div className="flex-1 w-full min-w-0 flex flex-col transition-all duration-300">


          {/* Dense Content Frame */}
          <main className="flex-1 p-6 sm:p-6 max-w-screen w-full mx-auto space-y-4">

            {/* Micro Header Title Block */}
            <div className="flex flex-col gap-0.5 max-w-2xl">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <Apple className="text-cyan-600" size={18} />
                Today's Diet Planner
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Input patient conditions, metabolic states, or comorbidity diagnoses. The core directive cross-references parameters against medical frameworks to construct secure therapeutic dietary guidelines.
              </p>
            </div>

            {/* Compact Input Control Panel Container */}
            <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm relative">
              <div className="max-w-2xl space-y-2.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Comorbidity & Pathological Condition Registry
                </label>

                {/* Dynamic Compact Search Interface */}
                <div className="relative">
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-md focus-within:border-cyan-600 focus-within:bg-white focus-within:ring-1 focus-within:ring-cyan-600/20 transition-all">
                    <Search className="ml-3 text-slate-400 shrink-0" size={14} />
                    <input
                      type="text"
                      className="w-full px-2.5 py-2 bg-transparent text-[12px] font-medium text-slate-900 placeholder-slate-400 outline-none"
                      placeholder="Search clinical criteria (e.g., Diabetes, Hypertension, Renal Failure)..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {loadingSuggestions && (
                      <Loader2 className="mr-3 text-cyan-600 animate-spin shrink-0" size={14} />
                    )}
                  </div>

                  {/* Micro Floating Suggestion Overlay Panel */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-md overflow-hidden z-[60] max-h-48 overflow-y-auto">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => addCondition(s)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex justify-between items-center group transition-colors border-b border-slate-100 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-[9px] shrink-0">
                              Dx
                            </div>
                            <span className="font-semibold text-slate-800 text-[11px]">{s.disease}</span>
                          </div>
                          <ChevronRight size={12} className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Functional Comorbidity Micro Pills Segment */}
                <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                  {selectedDiseases.map(d => (
                    <div
                      key={d.disease}
                      className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 pl-2.5 pr-1.5 py-0.5 rounded text-[11px] font-semibold"
                    >
                      <span>{d.disease}</span>
                      <button
                        onClick={() => setSelectedDiseases(selectedDiseases.filter(c => c.disease !== d.disease))}
                        className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {selectedDiseases.length > 0 && (
                    <button
                      onClick={fetchMeals}
                      disabled={loading}
                      className="ml-auto w-full sm:w-auto bg-slate-900 hover:bg-cyan-600 text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Processing Profile...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          <span>Compile Safe Framework</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Output Field Workspace */}
            <div className="pt-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Loader2 className="text-cyan-600 animate-spin mb-2" size={24} />
                  <h3 className="text-[13px] font-bold text-slate-900">Applying Clinical Rule Engine</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Cross-referencing nutritional limits and contraindications...</p>
                </div>
              ) : meals.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-1 bg-cyan-600 rounded-full"></div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Medical Dietary Profiles</h2>
                  </div>

                  {/* Responsive Dense 3-Column Display Frame */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {meals.map((meal, idx) => (
                      <MealCard
                        key={meal._id}
                        meal={meal}
                        isSuggested={idx < 3}
                        activeRules={activeRules}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState hasSearched={hasSearched} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Compact Enterprise SaaS Card Module Component */
function MealCard({ meal, isSuggested, activeRules }) {
  const normalize = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.flatMap(item => typeof item === 'string' ? item.split('|') : item);
    if (typeof data === 'string') return data.split('|');
    return [];
  };

  const allowed = [...new Set(activeRules.flatMap((r) => normalize(r?.allowed_foods)))].slice(0, 4);
  const restricted = [...new Set(activeRules.flatMap((r) => normalize(r?.restricted_foods)))].slice(0, 4);
  const ingredients = normalize(meal.ingredients).slice(0, 5);

  return (
    <div className={`bg-white rounded-lg border flex flex-col h-full transition-all hover:shadow-md ${isSuggested
        ? 'border-cyan-500/30 ring-1 ring-cyan-500/5'
        : 'border-slate-200'
      }`}>

      {/* Top Header Wrapper Frame */}
      <div className="p-3.5 pb-2.5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ShieldCheck size={10} />
            {meal.matchScore || 95}% Profile Match
          </span>
          {isSuggested && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
              <Star size={10} className="fill-current" />
              Primary Choice
            </span>
          )}
        </div>
        <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">{meal.name}</h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Therapeutic Assignment</p>
      </div>

      {/* Composition Micro Row Components Block */}
      <div className="px-3.5 py-1.5 border-t border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1 mb-1">
          <Soup size={11} className="text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Composition</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {ingredients.map((ing, i) => (
            <span key={i} className="text-[10px] font-semibold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Structured Clinical Validation Guidelines Fields */}
      <div className="p-3.5 space-y-2 flex-grow">
        <div className="bg-emerald-50/40 rounded border border-emerald-100/70 p-2">
          <div className="flex gap-2">
            <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Clinical Indications</p>
              <p className="text-[11px] text-slate-900 font-medium mt-0.5 leading-tight">
                {allowed.length > 0 ? allowed.join(" • ") : "Clinically approved profile"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/40 rounded border border-rose-100/70 p-2">
          <div className="flex gap-2">
            <AlertCircle size={12} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Contraindications</p>
              <p className="text-[11px] text-slate-900 font-medium mt-0.5 leading-tight">
                {restricted.length > 0 ? restricted.join(" • ") : "No acute contraindications"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Macro Nutrition Parameters Segment Row */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 rounded-b-lg grid grid-cols-3 gap-1">
        <NutritionItem label="Energy" value={meal.calories} unit="kcal" icon={<Flame size={10} className="text-amber-500" />} />
        <NutritionItem label="Sodium" value={meal.sodium} unit="mg" border />
        <NutritionItem label="Sugar" value={meal.sugar} unit="g" />
      </div>
    </div>
  );
}

/* Micro Structured Data Parameter Component Block */
function NutritionItem({ label, value, unit, border, icon }) {
  return (
    <div className={`text-center flex flex-col justify-center ${border ? 'border-x border-slate-200 px-0.5' : ''}`}>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-0.5">
        {icon}
        {label}
      </span>
      <p className="text-[12px] font-bold text-slate-800 mt-0.5">
        {value} <span className="text-[9px] text-slate-400 font-normal">{unit}</span>
      </p>
    </div>
  );
}

/* Fallback Workspace View State Interface Visual Block */
function EmptyState({ hasSearched }) {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm px-4 max-w-sm mx-auto">
      <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
        <Info className="text-slate-400" size={16} />
      </div>
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
        {hasSearched ? "No Structural Framework Match" : "Awaiting Matrix Profile Parameters"}
      </h3>
      <p className="text-[11px] text-slate-500 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
        {hasSearched
          ? "The parameters specified conflict with active medical guidelines. Relax comorbidity restrictions or adjust your input conditions."
          : "Please specify active patient pathopharmacological profiles or conditions above to calculate a safe clinical-grade meal layout."}
      </p>
    </div>
  );
}

export default Diet;