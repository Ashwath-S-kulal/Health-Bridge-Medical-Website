import React from 'react';
import { Activity, ShieldCheck, Globe, Zap } from 'lucide-react';
import OAuth from '../Components/OAuth';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';

const Login = () => {
  return (
    <div>
      <Sidebar />
      <div className="flex-1 lg:ml-64 transition-all duration-300 min-h-screen bg-white flex flex-col md:flex-row font-sans">
    

        <div className="flex-1 flex items-center justify-center p-4 bg-slate-50">
          <div className="w-full max-w-md">
            <div className="md:hidden flex items-center justify-center gap-3 mb-10">
              <Activity className="text-cyan-600" size={32} />
              <h1 className="text-2xl font-black tracking-tighter italic">MEDICA CORE</h1>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Portal Login</h3>
                <p className="text-slate-500 text-sm">
                  Enter your credentials via Google SSO to access the diagnostic dashboard.
                </p>
              </div>

              <div className="space-y-6">
                <div className="transition-transform active:scale-[0.97]">
                  <OAuth />
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="bg-white px-4">Authorized Access Only</span>
                  </div>
                </div>

                <div className="bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100/50">
                  <p className="text-[11px] text-cyan-700 leading-relaxed text-center font-medium">
                    By signing in, you agree to our <strong>Clinical Data Privacy Protocol</strong> and certify that you are a registered medical professional.
                  </p>
                </div>
              </div>
            </div>


          
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;