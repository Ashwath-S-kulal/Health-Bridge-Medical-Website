import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { FaUserShield, FaUserAlt, FaEnvelope, FaCalendarAlt, FaTrashAlt, FaExternalLinkAlt, FaUserMd, FaArrowRight } from "react-icons/fa";
import { Trash2, User, Mail, Calendar, Activity, Database, Settings, UserCheck } from 'lucide-react';
import { ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/getallusers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
         withCredentials: true
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/deleteuser/${userId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          setUsers(users.filter((user) => user._id !== userId));
        }
      } catch (error) {
        console.log(error)
        console.error("Failed to delete user");
      }
    }
  };

  const handleRoleChange = async (userId, isAdmin) => {
    if (!window.confirm(`Make this user ${isAdmin ? "User" : "Admin"}?`)) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URI}/api/admin/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      await fetchUsers();
    } catch (error) {
      console.error("Role update failed:", error.message);
    }
  };



  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-cyan-100">
      <Header />

      {/* Background Micro-details */}
      <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />

      <main className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto">

        {/* Header Terminal Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg shadow-lg">
                <Database className="text-cyan-400 w-5 h-5" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                System <span className="text-cyan-600">Registry</span>
              </h1>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Central Node Oversight // Protocol 88-X
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-6 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div className="flex flex-col border-r border-slate-100 pr-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Subjects</span>
              <span className="text-2xl font-black text-slate-900">{users.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 italic">Operative</span>
            </div>
          </div>
          <NavLink
            to="/adminadddoctors"
            className="group"
          >
            <div className="flex items-center gap-7  justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-400 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FaUserMd size={22} />
                </div>

                <div className="flex flex-col">
                  <span className="text-base font-bold text-slate-800">
                    Add Doctors
                  </span>
                  <span className="text-xs text-slate-500">
                    Create and manage doctors
                  </span>
                </div>
              </div>
              <FaArrowRight className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </NavLink>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Decrypting Registry...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table Header - Clean and Minimal */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <div className="col-span-4">User Identity</div>
              <div className="col-span-3">Contact Payload</div>
              <div className="col-span-2">Access Level</div>
              <div className="col-span-3 text-right">Administrative Actions</div>
            </div>

            {/* User Row */}
            {users.map((user) => (
              <div
                key={user._id}
                className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-300 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 lg:px-8">

                  {/* User Identity */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user.profilePicture || "/default-avatar.png"}
                        className="w-12 h-12 rounded-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all border-2 border-slate-100"
                        alt="avatar"
                      />
                      {user.isAdmin && <div className="absolute -top-1 -right-1 bg-amber-400 w-3 h-3 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 tracking-tight">{user.username}</span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <Calendar size={10} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Contact Payload */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500 truncate italic">
                      <Mail size={14} className="text-slate-300" />
                      {user.email}
                    </div>
                  </div>

                  {/* Access Level */}
                  <div className="col-span-2">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-900 text-cyan-400 shadow-sm">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                        User
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleRoleChange(user._id, user.isAdmin)}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-cyan-600 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm"
                      title="Toggle Permission"
                    >
                      <UserCheck size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
                      title="Delete Entry"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}