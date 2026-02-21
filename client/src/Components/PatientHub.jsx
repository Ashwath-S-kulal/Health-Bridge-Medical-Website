import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Utensils, Stethoscope, ArrowRight, HeartPulse, ClipboardPlus, ChevronRight } from "lucide-react";
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

      <div className="flex-1 md:ml-64 p-6 md:p-12 transition-all duration-300 pt-20">
        <div className="max-w-screen mx-auto mb-12">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
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
              className={`group relative bg-white border-2 ${hub.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 flex flex-col h-full`}
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

        <div className="max-w-screen mx-auto mt-12 relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[80px] -ml-20 -mb-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-center lg:text-left">
         
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-4">
                Health concerns? <br />
                <span className="text-slate-400">Speak with an expert.</span>
              </h2>

              <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                If you are experiencing any health problems, you can receive a professional consultation from our
                <span className="text-white font-bold"> verified volunteer doctors</span>. High-quality care is just a connection away.
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4 min-w-[280px]">
              <NavLink to="/doctors" className="w-full">
                <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-10 py-5 rounded-xl font-black text-xs tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(6,182,212,0.25)] flex items-center justify-center gap-3">
                  Find a Consultant
                  <ChevronRight size={18} />
                </button>
              </NavLink>

              <div className="flex items-center gap-4 px-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Doc" className="opacity-80" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  + Volunteers Online
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientHub;