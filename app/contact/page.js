"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const { name, subject, message } = formData;
    const emailTo = "sathvikreddyfootballer@gmail.com";
    
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(subject || "New Inquiry")}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-[#FFA443] font-body flex flex-col">
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 md:pt-16 pb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
            
            {/* --- LEFT SIDE: INFO --- */}
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="font-heading font-bold text-5xl md:text-7xl text-black leading-none mb-6">
                        Let's start a <br/> conversation.
                    </h1>
                    <p className="text-xl text-black/80 font-medium max-w-md leading-relaxed">
                        Interested in collaboration? Have a critique on my code? 
                        Or just want to say hi? I’m all ears.
                    </p>
                </div>

                <div className="flex flex-col gap-8 mt-4">
                    <div className="group cursor-pointer">
                        <div className="text-sm font-bold opacity-50 tracking-widest uppercase mb-1">EMAIL</div>
                        <a href="mailto:sathvikreddyfootballer@gmail.com" className="text-2xl md:text-3xl font-heading font-bold border-b-2 border-black/0 group-hover:border-black/100 transition-all">
                            sathvikreddyfootballer@gmail.com
                        </a>
                    </div>
                    <div>
                        <div className="text-sm font-bold opacity-50 tracking-widest uppercase mb-1">LOCATION</div>
                        <div className="text-2xl md:text-3xl font-heading font-bold">
                            Hyderabad, India
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-bold opacity-50 tracking-widest uppercase mb-3">SOCIALS</div>
                        <div className="flex gap-4">
                            <SocialLink href="#" label="Twitter" />
                            <SocialLink href="#" label="LinkedIn" />
                            <SocialLink href="#" label="GitHub" />
                        </div>
                    </div>
                </div>
            </div>


            {/* --- RIGHT SIDE: THE FORM (UPDATED COLORS) --- */}
            {/* Changed bg-black to bg-[#121212] and base text to white for readability */}
            <div className="bg-[#121212] text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                
                {/* Decorative Blob (Made slightly subtler) */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FFA443]/5 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="font-heading font-bold text-3xl mb-8 relative z-10">
                    Send a message 🚀
                </h2>

                <form onSubmit={handleSend} className="flex flex-col gap-6 relative z-10">
                    
                    <div className="flex flex-col gap-2">
                        {/* Explicitly set labels to orange */}
                        <label className="text-xs font-bold tracking-widest text-[#FFA443] opacity-80 uppercase">YOUR NAME</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            // Inputs now use white text, with lighter borders for contrast
                            className="bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-white/30 outline-none focus:border-[#FFA443] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest text-[#FFA443] opacity-80 uppercase">SUBJECT</label>
                        <input 
                            type="text" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Project Inquiry"
                            className="bg-transparent border-b border-white/20 py-3 text-lg text-white placeholder:text-white/30 outline-none focus:border-[#FFA443] transition-colors"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold tracking-widest text-[#FFA443] opacity-80 uppercase">MESSAGE</label>
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about your idea..."
                            className="bg-transparent border-b border-white/20 py-3 text-lg h-32 text-white placeholder:text-white/30 outline-none focus:border-[#FFA443] transition-colors resize-none"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="mt-6 bg-[#FFA443] text-black font-heading font-bold text-lg py-4 px-8 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-lg active:scale-95"
                    >
                        SEND EMAIL →
                    </button>

                </form>
            </div>

        </div>
      </div>

    </div>
  );
}

function SocialLink({ href, label }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-[#FFA443] transition-colors font-medium text-sm"
        >
            {label}
        </a>
    )
}