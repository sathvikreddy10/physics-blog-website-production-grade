"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase"; 
import Link from "next/link";
import BookmarkIcon from "./Bookmark.svg"; 

export default function BookmarkBtn() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  
  // Logic States
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [currentBlogTitle, setCurrentBlogTitle] = useState("");
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);

  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Bookmarks on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const saved = JSON.parse(localStorage.getItem('myBookmarks') || '[]');
        setBookmarks(saved);
    }
  }, []);

  // Check Page Context (Am I on a blog?)
  useEffect(() => {
    setCurrentBlogId(null);
    setCurrentBlogTitle("");
    setIsCurrentSaved(false);

    const match = pathname?.match(/^\/blog\/(\d+)$/);
    if (match) {
        const id = match[1];
        setCurrentBlogId(id);
        const saved = JSON.parse(localStorage.getItem('myBookmarks') || '[]');
        const alreadySaved = saved.some(b => b.id.toString() === id.toString());
        setIsCurrentSaved(alreadySaved);

        if (!alreadySaved) {
             const fetchTitle = async () => {
                const { data } = await supabase.from('posts').select('title').eq('id', id).single();
                if (data) setCurrentBlogTitle(data.title);
             };
             fetchTitle();
        }
    }
  }, [pathname, isOpen]);

  // Actions
  const addBookmark = () => {
      if (!currentBlogId || !currentBlogTitle) return;
      const newSaved = [{ id: currentBlogId, title: currentBlogTitle, date: new Date().toISOString() }, ...bookmarks];
      localStorage.setItem('myBookmarks', JSON.stringify(newSaved));
      setBookmarks(newSaved);
      setIsCurrentSaved(true);
  };

  const removeBookmark = (e, id) => {
      e.stopPropagation();
      const newSaved = bookmarks.filter(b => b.id.toString() !== id.toString());
      localStorage.setItem('myBookmarks', JSON.stringify(newSaved));
      setBookmarks(newSaved);
      if (id.toString() === currentBlogId?.toString()) setIsCurrentSaved(false);
  };

  return (
    <div className="relative inline-flex items-center z-50 font-body" ref={dropdownRef}>
      
      {/* --- TRIGGER BUTTON --- */}
      <button 
        onClick={(e) => {
            e.stopPropagation(); 
            setIsOpen(!isOpen);
        }} 
        className="group bg-transparent border-none p-0 cursor-pointer outline-none flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-hover-on-links transition-colors"
      >
        <div className="relative">
            <img src={BookmarkIcon.src} alt="Bookmark" className="w-4 h-4 opacity-80 group-hover:opacity-100" />
            {/* Tiny Notification Dot */}
            {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-hover-on-links rounded-full border border-white"></span>
            )}
        </div>
        <span className="text-sm font-medium text-black/95 group-hover:text-black transition-colors">
            Bookmarks
        </span>
      </button>

      {/* --- DROPDOWN PANEL --- */}
      {isOpen && (
        <div className={`
            absolute top-full mt-3 z-[60]
            
            /* 📱 MOBILE: Centered, 70% Width */
            left-1/2 -translate-x-1/2 
            w-[70vw] max-w-[24rem]
            
            /* 💻 DESKTOP: Right Aligned */
            md:left-auto md:right-0 md:translate-x-0
            md:w-80

            /* DARK THEME STYLING */
            bg-[#121212] 
            text-white
            rounded-2xl 
            shadow-2xl
            border border-white/10
            overflow-hidden 
            animate-in fade-in slide-in-from-top-2 duration-200 
        `}>
            
            {/* HEADER */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                <span className="text-xs font-bold text-[#FFA443] tracking-widest uppercase">
                    Your Stash
                </span>
                
                {/* Mobile Close Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    className="md:hidden text-[10px] font-bold text-white/40 bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"
                >
                    CLOSE
                </button>
            </div>
            
            {/* CURRENT PAGE QUICK-ADD */}
            {currentBlogId && !isCurrentSaved && currentBlogTitle && (
                <div className="p-4 bg-[#FFA443]/10 border-b border-[#FFA443]/20">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-[#FFA443] uppercase tracking-wide">
                                READING NOW
                            </span>
                            <div className="text-sm font-medium text-white leading-tight line-clamp-2">
                                {currentBlogTitle}
                            </div>
                        </div>
                        <button 
                            onClick={addBookmark}
                            className="shrink-0 bg-[#FFA443] text-black text-[10px] font-bold px-3 py-1.5 rounded hover:bg-white hover:scale-105 transition-all"
                        >
                            SAVE +
                        </button>
                    </div>
                </div>
            )}

            {/* LIST */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                {bookmarks.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-2 opacity-30">
                        <span className="text-2xl">📂</span>
                        <span className="text-xs font-medium">Empty stash. Go save some vibes.</span>
                    </div>
                ) : (
                    bookmarks.map((b) => (
                        <div key={b.id} className="group/item relative rounded-lg hover:bg-white/5 transition-colors">
                            <Link 
                                href={`/blog/${b.id}`}
                                onClick={() => setIsOpen(false)}
                                className="block p-3 pr-10"
                            >
                                <div className="text-sm font-medium text-white/90 group-hover/item:text-[#FFA443] transition-colors line-clamp-2 leading-snug">
                                    {b.title}
                                </div>
                                <div className="text-[10px] text-white/40 mt-1 font-mono">
                                    {new Date(b.date).toLocaleDateString()}
                                </div>
                            </Link>
                            
                            {/* Remove Button */}
                            <button 
                                onClick={(e) => removeBookmark(e, b.id)}
                                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-white/5 rounded-full transition-all"
                                title="Remove bookmark"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER (Clear All) */}
            {bookmarks.length > 0 && (
                <div 
                    onClick={() => {
                        if(window.confirm("Clear all bookmarks?")) {
                            setBookmarks([]);
                            localStorage.removeItem('myBookmarks');
                        }
                    }}
                    className="p-2.5 text-center text-[10px] font-bold text-red-400/50 hover:text-red-400 cursor-pointer bg-[#151515] border-t border-white/5 hover:bg-red-500/10 transition-colors"
                >
                    CLEAR ALL
                </div>
            )}

        </div>
      )}
    </div>
  );
}