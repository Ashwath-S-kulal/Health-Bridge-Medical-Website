import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, LogOut, Camera, Trash2, CheckCircle2, AlertCircle, User, Mail, Lock, Settings } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function Profile() {
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    dispatch(signOut());
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <Sidebar />
      <div className="flex-1 lg:ml-64 w-full p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 ml-2">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Settings size={20} />
              </div>
              <h1 className="font-bold text-slate-800 tracking-tight">Account Center</h1>
            </div>
            <div className="flex gap-2">
              {currentUser?.isAdmin && (
                <NavLink to="/profile/adminpanel" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                  <ShieldCheck size={16} /> Admin
                </NavLink>
              )}
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-200 rounded-[2.5rem] blur-2xl opacity-40 animate-pulse"></div>
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="relative h-32 w-32 rounded-[2.5rem] object-cover ring-8 ring-slate-50 shadow-inner"
                  />
                  <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Camera size={18} />
                  </label>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-1">{currentUser.username}</h2>
                <p className="text-slate-400 text-sm font-medium mb-6">{currentUser.email}</p>
                <div className="w-full pt-6 border-t border-slate-50">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <span>Security Score</span>
                    <span className="text-indigo-600">85%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100">
                <h3 className="text-red-800 font-bold text-sm mb-2">Danger Zone</h3>
                <p className="text-red-600/70 text-xs mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="w-full py-3 bg-white text-red-500 text-xs font-black uppercase tracking-tighter rounded-xl border border-red-200 hover:bg-red-500 hover:text-white transition-all">
                  Deactivate Account
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-200 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Personal Information</h3>
                    <p className="text-slate-400 text-sm">Update your public profile and contact address.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        <User size={14} className="text-indigo-500" /> Display Name
                      </label>
                      <input
                        defaultValue={currentUser.username}
                        id="username"
                        className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                        <Mail size={14} className="text-indigo-500" /> Email Address
                      </label>
                      <input
                        defaultValue={currentUser.email}
                        id="email"
                        className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="group space-y-2 mb-12">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                      <Lock size={14} className="text-indigo-500" /> Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-6">
                    <div className="flex-1 h-6">
                      {updateSuccess && (
                        <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-left-4">
                          <CheckCircle2 size={18} />
                          <span className="text-sm font-bold uppercase tracking-tighter">Profile Synced</span>
                        </div>
                      )}
                      {error && (
                        <div className="flex items-center gap-2 text-red-500 animate-pulse">
                          <AlertCircle size={18} />
                          <span className="text-sm font-bold uppercase tracking-tighter">Update Failed</span>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={loading}
                      className="px-10 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}