import React from 'react';
import { HeartPulse, Search, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);


    return (
        <header className="fixed top-0 left-0 right-0 z-50  pointer-events-none">
            <nav className="w-full pointer-events-auto bg-sky-100/70 backdrop-blur-md border border-white/40 px-4 py-2.5 flex items-center justify-between shadow-blue-900/10 transition-all duration-300">

                {/* --- LOGO SECTION --- */}
                <NavLink to="/">
                    <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0 pl-2">
                        <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                            <HeartPulse className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden md:block">
                            Health<span className="text-blue-600"> Bridge</span>
                        </h1>
                    </div>
                </NavLink>

                <div className="hidden md:flex gap-2 items-center bg-slate-100/50 border border-slate-200/40 p-1 rounded-2xl">

                    <NavLink to="/hospital">
                        {({ isActive }) => (
                            <button
                                className={`px-6 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300
          ${isActive
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                    }`}
                            >
                                Hospital Nearby
                            </button>
                        )}
                    </NavLink>

                    <NavLink to="/medical">
                        {({ isActive }) => (
                            <button
                                className={`px-6 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300
          ${isActive
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                    }`}
                            >
                                Medical Nearby
                            </button>
                        )}
                    </NavLink>
                    <NavLink to="/doctors">
                        {({ isActive }) => (
                            <button
                                className={`px-6 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300
          ${isActive
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                    }`}
                            >
                                Find Doctors
                            </button>
                        )}
                    </NavLink>

                </div>
                <div className="flex items-center gap-2 ml-4">
                    <NavLink
                        to={currentUser ? '/profile' : '/login'}
                        className="relative group"
                    >
                        {currentUser ? (
                            <div className="relative">
                                <div className="absolute -inset-1 bg-cyan-400 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-300"></div>
                                <div className="relative h-9 w-9 rounded-full border-2 border-white ring-1 ring-slate-200 overflow-hidden shadow-sm transition-transform active:scale-90">
                                    <img
                                        src={currentUser.profilePicture}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-cyan-400 rounded-full blur opacity-30 group-hover:opacity-60 transition"></div>
                                <div className="relative flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
                                    <User className="w-3.5 h-3.5 text-cyan-400" />
                                    <span className="hidden sm:inline">Login</span>
                                </div>
                            </div>
                        )}
                    </NavLink>
                </div>

            </nav>
        </header>
    );
}