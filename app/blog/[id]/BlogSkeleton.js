import React from 'react';
import Navbar from "../../components/Navbar/Navbar";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFA443] font-body pb-20">
      
      {/* 1. Navbar */}
      <div className="relative z-10">
        <Navbar /> 
      </div>

      {/* 2. Main Layout 
          - Mobile: px-4, Stacked flex column
          - Desktop (lg): px-site (custom), 12-col Grid
      */}
      <div className="px-4 lg:px-site pt-24 lg:pt-[1.85rem] flex flex-col lg:grid lg:grid-cols-12 gap-10 relative items-start animate-pulse">

        {/* --- LEFT SIDE GHOST (The Content) --- */}
        <div className="w-full lg:col-span-9 flex flex-col gap-7 lg:pr-8">
            
            {/* Title & Author Ghost */}
            <div className="flex flex-col pt-1 gap-4">
                {/* Big Title Bar */}
                <div className="h-12 md:h-20 bg-black/10 rounded-lg w-full md:w-3/4 mt-4"></div>
                {/* Author Bar */}
                <div className="h-6 bg-black/10 rounded w-1/3 md:w-1/4 self-start md:self-end"></div>
            </div>

            {/* Content Block Ghost */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-4">
                
                {/* Text Lines (Hidden on small mobile if you want, or kept) */}
                <div className="flex-1 flex flex-col gap-3 pt-1.5 order-2 md:order-1">
                    <div className="h-4 bg-black/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 rounded w-11/12"></div>
                    <div className="h-4 bg-black/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 rounded w-4/5"></div>
                    <div className="h-4 bg-black/10 rounded w-full"></div>
                    {/* Extra lines for mobile feel */}
                    <div className="h-4 bg-black/10 rounded w-full md:hidden"></div>
                    <div className="h-4 bg-black/10 rounded w-3/4 md:hidden"></div>
                </div>

                {/* Image Box */}
                <div className="w-full md:w-[22rem] aspect-square md:h-[22rem] shrink-0 bg-black/10 rounded-xl md:rounded-sm mt-1 order-1 md:order-2"></div>
            </div>

            {/* Second Text Block Ghost */}
            <div className="flex flex-col gap-3">
                 <div className="h-4 bg-black/10 rounded w-full"></div>
                 <div className="h-4 bg-black/10 rounded w-11/12"></div>
                 <div className="h-4 bg-black/10 rounded w-full"></div>
            </div>
        </div>

        {/* --- RIGHT SIDE PLACEHOLDER (Grid Spacer) --- */}
        <div className="col-span-3 hidden lg:block"></div>

      </div>


      {/* --- SIDEBAR GHOST (Fixed Position - DESKTOP ONLY) --- */}
      {/* Hidden on mobile (hidden), Visible on lg screens (flex) */}
      <div className="hidden lg:flex fixed bottom-8 right-site w-[20%] h-[38rem] flex-col justify-end gap-4 z-50 animate-pulse pointer-events-none">

            {/* Progress Bar Ghost */}
            <div className="h-[5rem] bg-[#fecc97]/50 rounded-xl backdrop-blur-sm border border-black/5"></div>
                
            {/* Blog List Ghost */}
            <div className="flex-1 bg-[#D9D9D9]/50 rounded-xl border border-white/20"></div>

            {/* Papers Used Ghost */}
            <div className="h-[4.5rem] bg-[#D9D9D9]/50 rounded-xl shrink-0 border border-white/20"></div>

            {/* Author Ghost */}
            <div className="h-[4.5rem] bg-[#D9D9D9]/50 rounded-xl shrink-0 border border-white/20"></div>

      </div>

    </div>
  );
}