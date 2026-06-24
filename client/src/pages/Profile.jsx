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
import Header from '../Components/Header';

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
    <div>
      <Header />
      <div className="flex min-h-screen bg-[#F1F5F9] p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl w-full mx-auto space-y-6">

          <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h1 className="font-bold text-slate-800 text-xl tracking-tight">Your Account</h1>
            <div className="flex gap-1">
              {currentUser?.isAdmin && (
                <NavLink to="/profile/adminpanel" className="px-1 md:px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
                  Admin Panel
                </NavLink>
              )}
              <button onClick={handleSignOut} className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="h-24 w-24 rounded-2xl object-cover border-4 border-slate-50 mb-4"
                />
                <h2 className="text-lg font-bold text-slate-800">{currentUser.username}</h2>
                <p className="text-slate-400 text-xs mb-6">{currentUser.email}</p>

                <div className="w-full pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Account Integrity: 85%</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-slate-800 font-bold text-sm mb-1">Danger Zone</h3>
                <p className="text-slate-400 text-xs mb-4">Be careful with account actions.</p>
                <button className="w-full py-2 text-red-500 text-xs font-bold rounded-xl border border-red-100 hover:bg-red-50 transition-all">
                  Deactivate Account
                </button>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 h-full">
                <h3 className="text-xl font-bold text-slate-800 mb-8">Personal Information</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Display Name</label>
                      <input defaultValue={currentUser.username} id="username" onChange={handleChange} className="w-full mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                      <input disabled defaultValue={currentUser.email} id="email" onChange={handleChange} className="w-full mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">New Password</label>
                    <input type="password" id="password" onChange={handleChange} className="w-full mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" placeholder="••••••••" />
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-end gap-6">
                  {(updateSuccess || error) && (
                    <span className={`text-xs font-bold ${updateSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
                      {updateSuccess ? 'Synced Successfully' : 'Update Failed'}
                    </span>
                  )}
                  <button disabled={loading} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all text-sm">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>

  );
}