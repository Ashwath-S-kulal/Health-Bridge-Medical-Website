import React from 'react';
import { Activity, ShieldCheck, Globe, Zap } from 'lucide-react';
import OAuth from '../Components/OAuth';
import Header from '../Components/Header';

const Login = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans pt-16">
        <div className="hidden md:flex md:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden ">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-600/20"></div>

          <div className="relative z-10 p-12 text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/40">
                <Activity size={40} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                Medica<span className="text-cyan-400">Core</span>
              </h1>
            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Advanced Clinical <br />
              <span className="text-cyan-400">Intelligence.</span>
            </h2>

            <div className="space-y-6 mt-12">
              {[
                { icon: <ShieldCheck className="text-cyan-400" />, text: "HIPAA & GDPR Compliant Architecture" },
                { icon: <Globe className="text-cyan-400" />, text: "Global Medical Data Synchronization" },
                { icon: <Zap className="text-cyan-400" />, text: "Real-time Biometric Pattern Recognition" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[16px] border-cyan-500/10 rounded-full"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
          <div className="w-full max-w-md">
            <div className="md:hidden flex items-center justify-center gap-3 mb-10">
              <Activity className="text-cyan-600" size={32} />
              <h1 className="text-2xl font-black tracking-tighter italic">MEDICA CORE</h1>
            </div>

            <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100">
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


            <div className="mt-8 flex justify-between items-center px-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;