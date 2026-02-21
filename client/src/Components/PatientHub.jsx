import React from "react";
import { useNavigate } from "react-router-dom";
import { Utensils, Stethoscope, ArrowRight, HeartPulse, ClipboardPlus } from "lucide-react";
import Sidebar from "../Components/Sidebar";

function PatientHub() {
  const navigate = useNavigate();

  const hubs = [
    {
      title: "Today's Diet Planner",
      description: "Generate a clinically-safe Indian meal plan tailored to your specific medical conditions.",
      icon: <Utensils className="text-emerald-600" size={28} />,
      color: "bg-emerald-50",
      borderColor: "border-emerald-100",
      btnColor: "bg-emerald-600 hover:bg-emerald-700",
      path: "/diet", 
      tag: "Nutrition Engine"
    },
    {
      title: "Disease Management",
      description: "Log your symptoms and details to receive personalized insights and recovery steps.",
      icon: <ClipboardPlus className="text-blue-600" size={28} />,
      color: "bg-blue-50",
      borderColor: "border-blue-100",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      path: "/patient", 
      tag: "Clinical Insights"
    }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 p-6 md:p-12 transition-all duration-300">
        <div className="max-w-screen mx-auto mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Welcome to <span className="text-emerald-600">PatientHub</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage your health journey with precision and care.
          </p>
        </div>

        <div className="max-w-screen mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {hubs.map((hub, idx) => (
            <div 
              key={idx}
              className={`group relative bg-white border-2 ${hub.borderColor} rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 flex flex-col h-full`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`${hub.color} p-4 rounded-2xl`}>
                  {hub.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {hub.tag}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-3">
                {hub.title}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                {hub.description}
              </p>

              <button 
                onClick={() => navigate(hub.path)}
                className={`w-full ${hub.btnColor} text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group-hover:gap-4`}
              >
                Access Hub <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-screen mx-auto mt-12 bg-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl">
              <Stethoscope className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">Need immediate assistance?</p>
              <p className="text-slate-400 text-sm">Consult with our AI medical agent for quick help.</p>
            </div>
          </div>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
            Start AI Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientHub;