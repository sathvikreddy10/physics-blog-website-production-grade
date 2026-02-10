"use client";

import React, { useState } from "react";

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
    // 👇 RESET: Using 'block' and 'h-auto' with 'touch-auto' for mobile gestures
    <div className="block w-full min-h-screen h-auto bg-[#FFA443] font-body touch-auto">
      
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 md:pt-16 pb-24">
        
        {/* MOBILE LAYOUT */}
        <div className="flex md:hidden flex-col gap-8">
            <div>
                <h1 className="font-heading font-bold text-4xl text-black leading-none mb-2">Get in touch.</h1>
                <p className="text-black/80 font-medium">I'm all ears for collaborations or critiques.</p>
            </div>
            <div className="bg-[#121212] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <form onSubmit={handleSend} className="flex flex-col gap-5 relative z-10">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full bg-transparent border-b border-white/20 py-2 text-base text-white outline-none focus:border-[#FFA443]" required />
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full bg-transparent border-b border-white/20 py-2 text-base text-white outline-none focus:border-[#FFA443]" required />
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Hello..." className="w-full bg-transparent border-b border-white/20 py-2 text-base h-24 text-white outline-none focus:border-[#FFA443] resize-none" required />
                    <button type="submit" className="mt-4 bg-[#FFA443] text-black font-heading font-bold text-base py-3 rounded-lg shadow-lg">SEND MESSAGE</button>
                </form>
            </div>
            <div className="flex flex-col gap-6 px-2">
                <a href="mailto:sathvikreddyfootballer@gmail.com" className="text-xl font-heading font-bold break-all">sathvikreddyfootballer@gmail.com</a>
                <div className="flex gap-3 flex-wrap">
                    <SocialLink label="Twitter" />
                    <SocialLink label="LinkedIn" />
                    <SocialLink label="GitHub" />
                </div>
            </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:grid grid-cols-2 gap-24 items-start">
            <div className="flex flex-col gap-10">
                <h1 className="font-heading font-bold text-7xl text-black leading-none mb-6">Let's start a <br/> conversation.</h1>
                <p className="text-xl text-black/80 font-medium max-w-md leading-relaxed">Interested in collaboration? Have a critique on my code? Or just want to say hi? I’m all ears.</p>
                <div className="flex flex-col gap-8 mt-4">
                    <a href="mailto:sathvikreddyfootballer@gmail.com" className="text-3xl font-heading font-bold border-b-2 border-black/0 hover:border-black/100 transition-all">sathvikreddyfootballer@gmail.com</a>
                    <div className="text-3xl font-heading font-bold">Hyderabad, India</div>
                </div>
            </div>
            <div className="bg-[#121212] text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                <h2 className="font-heading font-bold text-3xl mb-8 relative z-10">Send a message 🚀</h2>
                <form onSubmit={handleSend} className="flex flex-col gap-6 relative z-10">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="bg-transparent border-b border-white/20 py-3 text-lg text-white outline-none focus:border-[#FFA443]" required />
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="bg-transparent border-b border-white/20 py-3 text-lg text-white outline-none focus:border-[#FFA443]" required />
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message..." className="bg-transparent border-b border-white/20 py-3 text-lg h-32 text-white outline-none focus:border-[#FFA443] resize-none" required />
                    <button type="submit" className="mt-6 bg-[#FFA443] text-black font-heading font-bold text-lg py-4 px-8 rounded-xl hover:bg-white transition-all">SEND EMAIL →</button>
                </form>
            </div>
        </div>
      </div>

      <footer className="w-full py-8 px-6 mt-auto border-t border-black/5 flex flex-col items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-black">Made by Sathvik</p>
          <a href="mailto:sathvikreddyfootballer@gmail.com" className="text-[9px] font-body text-black hover:underline">
              website built by sathvikreddyfootballer@gmail.com
          </a>
      </footer>
    </div>
  );
}

function SocialLink({ label }) {
    return (
        <span className="px-4 py-2 border border-black/20 rounded-full font-medium text-sm cursor-default">{label}</span>
    )
}