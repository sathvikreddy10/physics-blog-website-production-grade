"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
        fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, category, author_name')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error:', error);
    else setPosts(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vibe? This cannot be undone.");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
        alert("Error deleting: " + error.message);
    } else {
        setPosts(posts.filter(post => post.id !== id));
    }
  };

  const formatDate = (dateString) => {
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setIsAuthenticated(true);
    } else {
        alert("Wrong password. Your vibe is off.");
        setPasswordInput("");
    }
  };

  // 🔒 RENDER: LOCK SCREEN
  if (!isAuthenticated) {
    return (
        // 👇 FIXED: Use h-[100dvh] + overflow-y-auto. min-h-150vh breaks scroll if parent is locked.
        <div className="w-full h-[100dvh] overflow-y-auto bg-[#FFA443] flex flex-col items-center justify-center py-20 px-4">
            <form 
                onSubmit={handleLogin} 
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col gap-6 transform hover:scale-[1.02] transition-transform duration-300"
            >
                <div className="text-center">
                    <h1 className="font-heading text-3xl font-bold text-black">Admin Access</h1>
                    <p className="font-body text-gray-400 text-sm mt-1">Show me the secret handshake.</p>
                </div>

                <input 
                    type="password" 
                    placeholder="Enter Password..." 
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 font-body text-lg focus:ring-2 focus:ring-black outline-none transition-all"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                />

                <button 
                    type="submit" 
                    className="w-full bg-black text-white font-heading font-bold text-lg py-3 rounded-xl hover:bg-gray-900 transition-colors"
                >
                    UNLOCK 🔓
                </button>
            </form>
        </div>
    );
  }

  // ✅ RENDER: DASHBOARD
  return (
    // 👇 FIXED: h-[100dvh] + overflow-y-auto guarantees internal scrolling
    <div className="w-full h-[100dvh] overflow-y-auto bg-[#FFA443] font-body pb-20">
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4">
            <div>
                <h1 className="font-heading font-bold text-4xl md:text-5xl text-black">Dashboard</h1>
                <p className="font-body text-black/60 mt-1 md:mt-2 text-sm md:text-base">Manage your vibes.</p>
            </div>
            
            <Link 
                href="/upload" 
                className="w-full md:w-auto text-center bg-black text-[#FFA443] font-heading font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform shadow-xl"
            >
                + NEW POST
            </Link>
        </div>

        {/* TABLE HEADER (Hidden on Mobile) */}
        <div className="hidden md:grid bg-black/10 rounded-t-xl p-4 grid-cols-12 gap-4 font-heading font-bold text-sm tracking-wider opacity-70">
            <div className="col-span-6">TITLE</div>
            <div className="col-span-2">CATEGORY</div>
            <div className="col-span-2">DATE</div>
            <div className="col-span-2 text-right">ACTIONS</div>
        </div>

        {/* BLOG LIST */}
        <div className="flex flex-col gap-3 md:gap-2">
            {loading ? (
                <div className="p-8 text-center opacity-50 font-heading text-xl">Loading vibes...</div>
            ) : posts.length === 0 ? (
                <div className="p-8 text-center opacity-50 font-heading text-xl">No posts found.</div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-[#D9D9D9] p-4 rounded-xl flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center hover:bg-white transition-colors shadow-sm">
                        
                        <div className="w-full md:col-span-6 font-heading font-semibold text-lg md:text-xl truncate pr-4">
                            <Link href={`/blog/${post.id}`} className="hover:underline block truncate">
                                {post.title}
                            </Link>
                        </div>

                        <div className="flex md:contents w-full justify-between items-center text-sm md:text-base">
                            <div className="md:col-span-2">
                                <span className="bg-black/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {post.category || "General"}
                                </span>
                            </div>
                            <div className="md:col-span-2 text-sm opacity-60 font-medium text-right md:text-left">
                                {formatDate(post.created_at)}
                            </div>
                        </div>

                        <div className="w-full md:col-span-2 flex justify-end gap-3 pt-2 md:pt-0 border-t border-black/5 md:border-none mt-1 md:mt-0">
                             <Link 
                                href={`/blog/${post.id}`} 
                                className="w-10 h-10 rounded-full bg-[#d7b5b5] flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                             >
                                👁️
                             </Link>
                             <button 
                                onClick={() => handleDelete(post.id)}
                                className="w-10 h-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors font-bold text-lg"
                             >
                                ×
                             </button>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}