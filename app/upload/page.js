"use client";

//ready for mobile 

import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabase'; 
import Navbar from "../components/Navbar/Navbar";

export default function CreatePost() {

  // --- 1. DATA STATE ---
  const [metaData, setMetaData] = useState({ 
      title: "", 
      author: "Tom and Jerry", 
      authorRole: "Vibe Coder", 
      authorBio: "",
      authorImage: "",
      category: "Tech" 
  });

  const [papers, setPapers] = useState([]);
  const [paperTitle, setPaperTitle] = useState("");
  const [paperLink, setPaperLink] = useState("");
  
  const [sections, setSections] = useState([
    { id: Date.now(), text: "", image: "" }
  ]);

  // UI States
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isLinkMode, setIsLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // --- 2. ACTIONS ---

  const updateText = (index, htmlContent) => {
    const newSections = [...sections];
    newSections[index].text = htmlContent;
    setSections(newSections);
    setActiveSectionIndex(index);
    checkFormats();
  };

  const handleImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      const newSections = [...sections];
      newSections[index].image = url;
      setSections(newSections);
    }
  };

  const handleAuthorImage = (e) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setMetaData({ ...metaData, authorImage: url });
      }
  };

  const removeImage = (index) => {
    const newSections = [...sections];
    newSections[index].image = "";
    setSections(newSections);
  };

  const addBlock = () => {
    setSections([...sections, { id: Date.now(), text: "", image: "" }]);
    setActiveSectionIndex(sections.length);
    setShowScrollHint(true);
    setTimeout(() => setShowScrollHint(false), 3000);
  };

  const removeSection = (index) => {
    if (sections.length > 1) {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    } else {
        alert("You need at least one section!");
    }
  };

  const addPaper = () => {
      if (!paperTitle.trim()) return;
      const newPaper = { title: paperTitle, link: paperLink };
      setPapers([...papers, newPaper]);
      setPaperTitle("");
      setPaperLink("");
  };

  // --- 3. FORMATTING LOGIC ---
  const checkFormats = () => {
    if (typeof document !== 'undefined') {
        const isBold = document.queryCommandState('bold');
        setIsBoldActive(isBold);
    }
  };

  const applyFormat = (command) => {
    const activeDiv = document.getElementById(`editable-${activeSectionIndex}`);
    if(activeDiv) activeDiv.focus();

    if (command === 'bold') {
        document.execCommand('bold', false, null);
        checkFormats();
    } 
    
    if (command === 'link') {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            setSavedSelection(selection.getRangeAt(0));
            setIsLinkMode(true); 
        }
    }
  };

  const confirmLink = () => {
    if (!savedSelection) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelection);
    if (linkUrl) document.execCommand('createLink', false, linkUrl);
    setIsLinkMode(false);
    setLinkUrl("");
    setSavedSelection(null);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', checkFormats);
    return () => document.removeEventListener('selectionchange', checkFormats);
  }, []);


  // --- 4. PUBLISH LOGIC ---
  const handlePublish = async () => {
    alert("Publishing... This might take a moment to upload images!");

    try {
        // STEP A: Upload Section Images
        const updatedSections = await Promise.all(sections.map(async (section, index) => {
            if (!section.image || !section.image.startsWith('blob:')) return section;
            
            const fileInput = document.getElementById(`file-input-${index}`);
            const file = fileInput?.files[0];

            if (file) {
                const fileName = `section-${Date.now()}-${index}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;
                
                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(fileName);
                
                return { ...section, image: publicUrl };
            }
            return section;
        }));
        
        // STEP B: Upload Author Avatar
        let finalAuthorImage = metaData.authorImage;
        if (metaData.authorImage && metaData.authorImage.startsWith('blob:')) {
             const authorInput = document.getElementById('author-file-input');
             const file = authorInput?.files[0];
             
             if (file) {
                const fileName = `author-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '')}`;
                const { error: uploadError } = await supabase.storage
                    .from('blog-images')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('blog-images')
                    .getPublicUrl(fileName);
                
                finalAuthorImage = publicUrl;
             }
        }

        // STEP C: Save Text
        const { error: dbError } = await supabase
            .from('posts')
            .insert({
                title: metaData.title,
                author_name: metaData.author,
                author_role: metaData.authorRole,
                author_bio: metaData.authorBio,
                author_image: finalAuthorImage,
                content: updatedSections, 
                papers: papers,
                category: metaData.category
            });

        if (dbError) throw dbError;

        alert("SUCCESS! Blog published to Supabase 🚀");

    } catch (error) {
        console.error("Error publishing:", error);
        alert("Error: " + error.message);
    }
  };


  return (
    <div className="min-h-screen bg-main font-body pb-32"> 
      
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: rgba(0, 0, 0, 0.3);
          pointer-events: none;
          display: block; 
        }
        [contenteditable] a {
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-decoration-color: black;
            font-weight: 500;
            cursor: pointer;
        }
      `}</style>

      <div className="bg-transparent">
              <div className="h-[5.2rem] bg-main"></div>
              <Navbar /> 
        </div>

      {/* ========================================= */}
      {/* 📱 MOBILE VIEW: BLOCKED MESSAGE        */}
      {/* ========================================= */}
      <div className="md:hidden flex flex-col items-center justify-center h-[70vh] px-8 text-center gap-6 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-4xl shadow-xl">
                💻
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight">
                Desktop Only
            </h1>
            <p className="font-body text-xl opacity-80 leading-relaxed max-w-xs">
                To ensure the best writing experience, creating posts is currently limited to desktop devices.
            </p>
      </div>


      {/* ========================================= */}
      {/* 💻 DESKTOP VIEW: THE FULL EDITOR       */}
      {/* ========================================= */}
      <div className="hidden md:block">
        <div className="pr-[3.65rem] pl-[5rem] pt-[1.85rem] grid gap-10 grid-cols-12 relative items-start">

            {/* --- LEFT SIDE (EDITOR) --- */}
            <div className="Blog_Details flex flex-col col-span-9 gap-12 pr-8">
                <div className="heading_author flex flex-col pt-1">
                    <textarea 
                        placeholder="Enter Blog Title..."
                        value={metaData.title}
                        onChange={(e) => setMetaData({...metaData, title: e.target.value})}
                        className="Heading font-heading font-semibold text-[4.75rem] text-black leading-[5rem] mt-4 bg-transparent border-b-2 border-black/10 focus:border-black/50 outline-none resize-none placeholder:text-black/30 h-[10rem]"
                    />
                </div>

                {sections.map((section, index) => (
                    <div 
                        key={section.id} 
                        className={`flex flex-row gap-8 transition-opacity duration-300 relative group ${activeSectionIndex === index ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                        onClick={() => setActiveSectionIndex(index)}
                    >
                        {/* DELETE SECTION BUTTON */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSection(index);
                            }}
                            className="absolute -left-12 top-2 w-8 h-8 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/50 rounded-full"
                            title="Remove Section"
                        >
                            🗑️
                        </button>

                        <input 
                            type="file" 
                            accept="image/*"
                            id={`file-input-${index}`} 
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                        />

                        <div
                            id={`editable-${index}`}
                            contentEditable
                            placeholder={index === 0 ? "Start your story here..." : "Continue your story..."}
                            onInput={(e) => updateText(index, e.currentTarget.innerHTML)}
                            onFocus={() => setActiveSectionIndex(index)}
                            onKeyUp={checkFormats}
                            onMouseUp={checkFormats}
                            suppressContentEditableWarning={true} 
                            className={`${section.image ? "flex-1" : "w-full"} text-[1.2rem] leading-tight pt-1.5 bg-transparent border-l-4 border-black/10 pl-4 focus:border-black/50 outline-none min-h-[22rem] transition-all duration-300 empty:before:content-[attr(placeholder)] cursor-text`}
                        >
                        </div>

                        {section.image && (
                            <div className="w-[22rem] h-[22rem] shrink-0 bg-[#d9d9d9] mt-1 relative group/image cursor-pointer border-2 border-dashed border-black/20 hover:border-black/50 transition-all rounded-sm flex items-center justify-center overflow-hidden animate-in fade-in zoom-in duration-300">
                                <img src={section.image} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center font-bold shadow-md z-30"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>

            {/* --- RIGHT SIDE (METADATA) --- */}
            <div className="col-span-3 h-full relative hidden lg:block">
                <div className="sticky top-10 flex flex-col gap-4">
                    
                    <button 
                        onClick={handlePublish}
                        className="bg-black text-main font-heading font-bold text-xl py-4 px-6 rounded-xl hover:scale-105 transition-transform shadow-xl"
                    >
                        PUBLISH 🚀
                    </button>

                    {/* CUSTOM CATEGORY TAG */}
                    <div className="p-4 bg-sidebar rounded-xl flex flex-col gap-2">
                        <label className="font-heading font-semibold text-sm opacity-50 tracking-wider">CATEGORY TAG</label>
                        <input 
                            type="text"
                            placeholder="e.g. Technology, Life, Rants"
                            value={metaData.category}
                            onChange={(e) => setMetaData({...metaData, category: e.target.value})}
                            className="bg-transparent border-b border-black/20 font-body font-medium text-lg outline-none focus:border-black w-full py-1 placeholder:text-black/30"
                        />
                    </div>

                    {/* AUTHOR SECTION */}
                    <div className="p-4 bg-sidebar rounded-xl flex flex-col gap-4">
                        <label className="font-heading font-semibold text-sm opacity-50 tracking-wider">ABOUT AUTHOR</label>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/50 shrink-0 overflow-hidden relative cursor-pointer group hover:ring-2 ring-black/20 transition-all">
                                <input 
                                    id="author-file-input" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleAuthorImage}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {metaData.authorImage ? (
                                    <img src={metaData.authorImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30 font-bold">+</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <input 
                                    type="text" 
                                    placeholder="Name"
                                    value={metaData.author}
                                    onChange={(e) => setMetaData({...metaData, author: e.target.value})}
                                    className="bg-transparent border-b border-black/10 font-heading font-bold text-lg outline-none focus:border-black w-full"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Role (e.g. Vibe Coder)"
                                    value={metaData.authorRole}
                                    onChange={(e) => setMetaData({...metaData, authorRole: e.target.value})}
                                    className="bg-transparent border-b border-black/10 font-body text-xs text-black/60 outline-none focus:border-black w-full"
                                />
                            </div>
                        </div>
                        <textarea 
                            placeholder="Short bio..."
                            value={metaData.authorBio}
                            onChange={(e) => setMetaData({...metaData, authorBio: e.target.value})}
                            className="w-full bg-white/40 rounded-lg p-3 text-sm font-body outline-none resize-none h-24 placeholder:text-black/30 focus:bg-white/60 transition-colors"
                        />
                    </div>

                    {/* PAPERS USED */}
                    <div className="p-4 bg-sidebar rounded-xl flex flex-col gap-3">
                        <label className="font-heading font-semibold text-sm opacity-50">PAPERS USED</label>
                        <div className="flex flex-col gap-2">
                            <textarea 
                                rows={2}
                                placeholder="Paper Title / Citation..."
                                value={paperTitle}
                                onChange={(e) => setPaperTitle(e.target.value)}
                                className="bg-white/50 px-3 py-2 rounded-lg text-sm outline-none resize-none placeholder:text-black/30"
                            />
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Link (https://...)"
                                    value={paperLink}
                                    onChange={(e) => setPaperLink(e.target.value)}
                                    className="flex-1 bg-white/50 px-3 py-2 rounded-lg text-xs outline-none placeholder:text-black/30"
                                />
                                <button 
                                    onClick={addPaper} 
                                    className="bg-black text-white w-10 rounded-lg flex items-center justify-center text-xl hover:bg-gray-800"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2 max-h-[300px] overflow-y-auto">
                            {papers.map((paper, index) => (
                                <div key={index} className="relative group bg-white/40 p-3 rounded-lg flex flex-col gap-1">
                                    <span className="text-sm font-medium leading-tight text-black/90 break-words">
                                        {paper.title}
                                    </span>
                                    {paper.link && (
                                        <a 
                                            href={paper.link} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-xs text-blue-700 underline truncate hover:text-blue-900 block"
                                        >
                                            {paper.link}
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => setPapers(papers.filter((_, i) => i !== index))} 
                                        className="absolute top-2 right-2 text-black/20 hover:text-red-500 font-bold transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {showScrollHint && (
            <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-black text-[#FFA443] px-6 py-2 rounded-full shadow-2xl z-[60] animate-in fade-in slide-in-from-bottom-5 duration-300 font-heading font-bold text-sm pointer-events-none">
                Scroll down for new section ↓
            </div>
        )}

        <div className="fixed bottom-0 left-0 w-full bg-[#1a1a1a] border-t border-white/10 p-4 z-50 flex justify-center gap-6 items-center shadow-2xl transition-all duration-300">
                {!isLinkMode ? (
                    <>
                        <div className="flex gap-2 mr-8 border-r border-white/20 pr-8">
                            <button 
                                onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
                                className={`h-12 px-6 font-bold rounded-lg transition-colors border border-white/10
                                    ${isBoldActive 
                                        ? "bg-[#FFA443] text-black shadow-[0_0_15px_rgba(255,164,67,0.5)]" 
                                        : "bg-[#333] text-white hover:bg-[#444]"
                                    }
                                `}
                            >
                                Bold
                            </button>
                            <button 
                                onMouseDown={(e) => { e.preventDefault(); applyFormat('link'); }}
                                className="h-12 px-6 bg-[#333] text-white underline decoration-white hover:decoration-black font-medium rounded-lg hover:bg-[#FFA443] hover:text-black transition-colors"
                            >
                                Link
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => document.getElementById(`file-input-${activeSectionIndex}`).click()} 
                                className="h-12 px-6 bg-[#FFA443] text-black font-heading font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <span>📷</span> Add Image
                            </button>

                            <button 
                                onClick={addBlock}
                                className="h-12 px-6 bg-white text-black font-heading font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <span>+</span> New Section
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-4 w-full max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Paste link here (e.g., https://google.com)"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmLink()}
                            className="flex-1 h-12 px-4 rounded-lg bg-[#333] text-white outline-none border border-white/20 focus:border-[#FFA443]"
                        />
                        <button onClick={confirmLink} className="h-12 px-6 bg-[#FFA443] text-black font-bold rounded-lg hover:bg-white">Apply Link</button>
                        <button onClick={() => setIsLinkMode(false)} className="h-12 px-6 bg-transparent text-white font-medium rounded-lg hover:bg-white/10">Cancel</button>
                    </div>
                )}
        </div>
      </div>
    </div>
  );
}