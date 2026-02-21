import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, X, Activity, Star, Zap, ChevronRight, Loader2, Info, AlertCircle, CheckCircle2, Soup, ArrowLeft } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useNavigate } from "react-router-dom";

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
        const res = await axios.get(`/api/diet/search-diseases?q=${query}`);
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
      const res = await axios.post("/api/diet/filter-meals", { diseases: namesOnly });
      setMeals(res.data.meals || []);
      setActiveRules(res.data.activeRules || []);
    } catch (error) {
      console.error("Meal fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 selection:bg-emerald-100 md:ml-64 transition-all duration-300 pt-10 md:pt-0">
        <div className="max-w-screen mx-auto px-4 md:px-6 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors"
          >
            <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Hub
          </button>
        </div>
        <div className="max-w-screen mx-auto px-4 md:px-6  text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Plan your todays diet</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium mb-10 px-2">Select your conditions to generate a clinically-safe Indian meal plan.</p>

          <div className="relative group max-w-2xl mx-auto px-2">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 p-1 md:p-1">
              <Search className="ml-3 md:ml-4 text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                className="w-full px-3 md:px-4 py-2 md:py-3 outline-none text-base md:text-lg font-medium"
                placeholder="Enter condition..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loadingSuggestions && <Loader2 className="mr-4 text-emerald-500 animate-spin shrink-0" size={20} />}
            </div>

            {suggestions.length > 0 && (
              <div className="absolute w-[calc(100%-1rem)] left-2 mt-3 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-[60]">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => addCondition(s)}
                    className="w-full text-left px-4 md:px-6 py-3 md:py-4 hover:bg-slate-50 flex justify-between items-center group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs italic shrink-0">Rx</div>
                      <span className="font-semibold text-slate-700 text-sm md:text-base">{s.disease}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mt-8 min-h-[50px] px-2">
            {selectedDiseases.map(d => (
              <div key={d.disease} className="flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide">
                {d.disease}
                <button onClick={() => setSelectedDiseases(selectedDiseases.filter(c => c.disease !== d.disease))}>
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            {selectedDiseases.length > 0 && (
              <button
                onClick={fetchMeals}
                disabled={loading}
                className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 mt-2 md:mt-0"
              >
                {loading ? "Analyzing..." : "Find Safe Meals"}
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mt-10">
          {loading ? (
            <div className="flex flex-col items-center py-20 md:py-40">
              <Loader2 className="text-emerald-500 animate-spin mb-6" size={50} />
              <h3 className="text-lg md:text-xl font-bold text-slate-800 text-center">Applying Clinical Filters</h3>
            </div>
          ) : meals.length > 0 ? (
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-1 w-8 md:w-12 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">Recommended for You</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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
            <div className="px-2">
              <EmptyState hasSearched={hasSearched} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MealCard({ meal, isSuggested, activeRules }) {
  const normalize = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.flatMap(item => typeof item === 'string' ? item.split('|') : item);
    if (typeof data === 'string') return data.split('|');
    return [];
  };

  const allowed = [...new Set(activeRules.flatMap((r) => normalize(r?.allowed_foods)))].slice(0, 5);
  const restricted = [...new Set(activeRules.flatMap((r) => normalize(r?.restricted_foods)))].slice(0, 5);
  const ingredients = normalize(meal.ingredients).slice(0, 6);

  return (
    <div className={`relative bg-white rounded-xl border transition-all duration-500 overflow-hidden flex flex-col h-full ${isSuggested ? 'border-emerald-200 shadow-2xl ring-1 ring-emerald-100' : 'border-slate-100 shadow-sm'}`}>
      <div className="p-5 md:p-7 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {meal.matchScore || 95}% Match
          </div>
          {isSuggested && <Star className="text-amber-400 fill-amber-400" size={20} />}
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-2">{meal.name}</h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Medical Grade Plan</p>
      </div>

      <div className="px-5 md:px-7 py-2">
        <div className="flex items-center gap-2 mb-3">
          <Soup size={14} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase">Ingredients</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl">
              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
              {ing}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 md:p-7 space-y-3 flex-grow">
        <div className="bg-emerald-50/50 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-emerald-100/50">
          <div className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase mb-1">Recommended</p>
              <p className="text-[12px] text-slate-600 font-semibold italic leading-snug">
                {allowed.length > 0 ? allowed.join(" • ") : "Clinically safe profile"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-rose-50/50 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-rose-100/50">
          <div className="flex gap-3">
            <AlertCircle size={18} className="text-rose-500 shrink-0" />
            <div>
              <p className="text-[10px] font-black text-rose-700 uppercase mb-1">Restrictions</p>
              <p className="text-[12px] text-slate-600 font-semibold italic leading-snug">
                {restricted.length > 0 ? restricted.join(" • ") : "No contraindications"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-7 py-5 bg-slate-50/50 border-t border-slate-100 grid grid-cols-3 gap-2 md:gap-4">
        <NutritionItem label="Energy" value={meal.calories} unit="kcal" />
        <NutritionItem label="Sodium" value={meal.sodium} unit="mg" border />
        <NutritionItem label="Sugar" value={meal.sugar} unit="g" />
      </div>
    </div>
  );
}

function NutritionItem({ label, value, unit, border }) {
  return (
    <div className={`text-center ${border ? 'border-x border-slate-200 px-1' : ''}`}>
      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-xs md:text-sm font-black text-slate-700">{value} <span className="text-[9px] md:text-[10px] text-slate-400 font-normal">{unit}</span></p>
    </div>
  );
}

function EmptyState({ hasSearched }) {
  return (
    <div className="text-center py-10 md:py-20 bg-white rounded-2xl border border-slate-100 relative overflow-hidden px-4">
      <Info className="text-slate-300 mx-auto mb-6" size={40} />
      <h2 className="text-xl md:text-2xl font-bold text-slate-800">
        {hasSearched ? "No Perfect Match" : "Select Your Profile"}
      </h2>
      <p className="text-slate-400 mt-2 max-w-sm mx-auto text-sm">
        {hasSearched ? "Try removing one condition to see more results." : "Add conditions to see medically mapped meal plans."}
      </p>
    </div>
  );
}

export default Diet;