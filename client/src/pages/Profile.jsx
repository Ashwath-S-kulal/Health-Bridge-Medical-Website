import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import Header from '../Components/Header';
import { NavLink } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';

export default function Profile() {
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ important!
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/user/delete/${currentUser._id}`, {
  method: 'DELETE',
  credentials: "include",   // 🔥 ADD THIS
});

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
await fetch(`${import.meta.env.VITE_BASE_URI}/api/auth/signout`, {
  credentials: "include",
});
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <Header />
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[30px] overflow-hidden shadow-xl border border-slate-200 mt-20">

        {/* Left Panel: Visual Identity */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-indigo-500 to-violet-600 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="h-10 w-10 bg-white/20 rounded-lg backdrop-blur-md flex items-center justify-center mb-6">
              <div className="h-5 w-5 bg-white rounded-full animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold leading-tight">Settings</h2>
            <p className="text-indigo-50 mt-2 text-sm">Personalize your presence on the platform.</p>
          </div>

          <div className="hidden md:block">
            <div className="text-xs uppercase tracking-widest text-indigo-100 font-semibold mb-4 opacity-80">Account Status</div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
              <span className="text-sm font-medium">Verified User</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Form Content */}
        <div className="flex-1 p-8 md:p-12">
          <div className='flex gap-5 mb-10'>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 transition-colors"
            >
              <FaSignOutAlt size={14} /> Sign Out
            </button>

            {currentUser?.isAdmin && (
              <NavLink to="/profile/adminpanel">
                <button
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  <ShieldCheck size={14} /> Admin panel
                </button>
              </NavLink>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <img
                  src={currentUser.profilePicture}
                  alt="profile"
                  className="relative h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-100 group-hover:ring-indigo-100 transition-all cursor-pointer"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-1.5 rounded-lg border-2 border-white shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">{currentUser.username}</h3>
                <p className="text-slate-500 text-sm">Update your details</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1">Username</label>
                <input
                  defaultValue={currentUser.username}
                  type="text"
                  id="username"
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 ml-1">Email</label>
                <input
                  defaultValue={currentUser.email}
                  type="email"
                  id="email"
                  className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 ml-1">Current Password</label>
              <input
                defaultValue={currentUser.password}
                type="password"
                id="password"
                className="w-full bg-slate-50 text-slate-800 p-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
                onChange={handleChange}
              />
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.99] disabled:opacity-50">
              {loading ? 'Processing...' : 'Save Changes'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <div>
              {error && <p className="text-xs text-red-500 font-medium">Error syncing data.</p>}
              {updateSuccess && <p className="text-xs text-emerald-600 font-bold tracking-tight">Profile saved successfully!</p>}
            </div>
            <button
              onClick={handleDeleteAccount}
              className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-tight"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}