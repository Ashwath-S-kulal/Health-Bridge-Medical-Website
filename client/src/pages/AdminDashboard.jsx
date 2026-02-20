import React, { useEffect, useState } from "react";
import { FaArrowRight, FaUserMd } from "react-icons/fa";
import { Trash2, Mail, Calendar, Database, UserCheck, ArrowLeft, Menu } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Permanent delete?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/deleteuser/${userId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          setUsers(users.filter((user) => user._id !== userId));
        }
      } catch (error) { console.error(error); }
    }
  };

  const handleRoleChange = async (userId, isAdmin) => {
    if (!window.confirm(`Update Role..?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/admin/${userId}/role`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchUsers();
    } catch (error) { console.error(error.message); }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      {/* Main Content: Dynamic Margin based on Sidebar width */}
      <div className="flex-1 w-full lg:ml-64 transition-all duration-300">
        <div className="fixed inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />
        
        <main className="relative pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 lg:pt-12">
          
          {/* Top Navigation Row */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          {/* Header Section: Stack on Mobile, Row on Desktop */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-900 rounded-xl shadow-indigo-200 shadow-lg">
                  <Database className="text-cyan-400 w-5 h-5" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">
                  System <span className="text-cyan-600">Registry</span>
                </h1>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Database Oversight
              </p>
            </div>

            {/* Stats & Actions: Wrap on small screens */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-6 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm grow sm:grow-0">
                <div className="flex flex-col border-r border-slate-100 pr-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjects</span>
                  <span className="text-2xl font-black text-slate-900">{users.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-bold text-emerald-600 italic">Operative</span>
                </div>
              </div>

              <NavLink to="/adminadddoctors" className="group grow sm:grow-0">
                <div className="flex items-center gap-6 justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all active:scale-95">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <FaUserMd size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Add Doctor</span>
                      <span className="text-[10px] text-slate-400 font-medium">New Entry</span>
                    </div>
                  </div>
                  <FaArrowRight size={12} className="text-slate-300 group-hover:text-emerald-600" />
                </div>
              </NavLink>
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Accessing Core...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header: Hidden on Mobile/Tablet */}
              <div className="hidden xl:grid grid-cols-12 gap-4 px-8 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <div className="col-span-4">Identity</div>
                <div className="col-span-4">Contact</div>
                <div className="col-span-2 text-center">Clearance</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* User Cards */}
              {users.map((user) => (
                <div
                  key={user._id}
                  className="group bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
                >
                  <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 items-center p-5 xl:px-8">
                    
                    {/* ID Section */}
                    <div className="w-full xl:col-span-4 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={user.profilePicture || "/default-avatar.png"}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-50 shadow-sm"
                          alt="avatar"
                        />
                        {user.isAdmin && (
                          <div className="absolute -top-1 -right-1 bg-indigo-600 w-3 h-3 rounded-full border-2 border-white shadow-sm" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 truncate">{user.username}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                          <Calendar size={10} /> {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Email Section */}
                    <div className="w-full xl:col-span-4 flex items-center xl:justify-start">
                      <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 xl:bg-transparent px-3 py-1.5 xl:p-0 rounded-lg w-full xl:w-auto italic truncate">
                        <Mail size={14} className="shrink-0 text-slate-300" />
                        {user.email}
                      </div>
                    </div>

                    {/* Clearance Section */}
                    <div className="w-full xl:col-span-2 flex justify-between xl:justify-center items-center">
                      <span className="xl:hidden text-[10px] font-black text-slate-400 uppercase">Clearance:</span>
                      {user.isAdmin ? (
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-900 text-cyan-400">
                          Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                          User
                        </span>
                      )}
                    </div>

                    {/* Action Section */}
                    <div className="w-full xl:col-span-2 flex justify-end gap-2 pt-4 xl:pt-0 border-t xl:border-none border-slate-50">
                      <button
                        onClick={() => handleRoleChange(user._id, user.isAdmin)}
                        className="flex-1 xl:flex-none flex justify-center items-center gap-2 xl:p-2.5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <UserCheck size={18} />
                        <span className="xl:hidden text-xs font-bold uppercase">Toggle Role</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex-1 xl:flex-none flex justify-center items-center gap-2 xl:p-2.5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={18} />
                        <span className="xl:hidden text-xs font-bold uppercase">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}