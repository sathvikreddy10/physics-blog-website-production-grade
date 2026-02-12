"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import { supabase } from "../../lib/supabase"; 
import Navbar from "../../components/Navbar/Navbar"; 
import Image from "next/image";
import arrow from "./arrow.svg"; 
import BlogSkeleton from "./BlogSkeleton"; 

export default function BlogPost() {

  const { id } = useParams();
  
  const [activeSection, setActiveSection] = useState('blogs');
  const [post, setPost] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]); 
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if(!id) return;
    
    const fetchData = async () => {
        // 1. Fetch Current Post (Ensure 'papers' is included in your table schema)
        const { data: currentPost, error: postError } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();
        
        if(!postError) setPost(currentPost);

        // 2. Fetch Recommendations
        const { data: others, error: othersError } = await supabase
            .from('posts')
            .select('id, title, content')
            .neq('id', id)
            .limit(5);

        if(!othersError) setOtherBlogs(others || []);
    };
    
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.floor((window.scrollY / totalHeight) * 100);
        setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (section) => {
      setActiveSection(section === activeSection ? 'blogs' : section);
  };
  
  const getExcerpt = (content) => {
    if (!content) return "";
    const textBlock = content.find(b => b.text && b.text.trim().length > 0);
    return textBlock ? textBlock.text.replace(/<[^>]+>/g, '') : "";
  };

  if (!post) return <BlogSkeleton />;

  return (
    <div className="min-h-screen bg-main font-body pb-20">
      
      <style jsx global>{`
        .blog-content a { text-decoration: underline; font-weight: 500; }
      `}</style>

      <div className="bg-transparent">
        <div className="h-[5.2rem] bg-main"></div>
        <Navbar /> 
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col px-6 pt-4 pb-10">
          <h1 className="font-heading text-4xl font-bold leading-[1.15] mb-4 text-black">
              {post.title}
          </h1>

          <div className="self-end mb-10 flex flex-col items-end">
              <span className="font-body text-lg border-b border-black/80 pb-0.5 font-medium text-black">
                 {post.author_name}
              </span>
          </div>

          <div className="flex flex-col gap-6">
              {post.content && post.content.map((block, index) => (
                  <div key={index} className="flex flex-col gap-4">
                      <div 
                          className="text-lg leading-relaxed font-body text-black/90 blog-content"
                          dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                      {block.image && (
                          <div className="w-full aspect-square relative bg-[#d9d9d9] mt-2 mb-4">
                              <Image src={block.image} fill={true} alt="blog visual" className="object-cover" />
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:grid pr-site pl-[5rem] pt-[1.85rem] gap-10 grid-cols-12 relative items-start">
        <div className="Blog_Details flex flex-col col-span-9 gap-7 pr-8">
            <div className="heading_author flex flex-col pt-1">
                <div className="Heading font-heading font-semibold text-[4.75rem] text-black leading-[5rem] mt-4">
                    {post.title}
                </div>
                <div className="author self-end flex items-center gap-2 text-[1.15rem] font-body font-medium text-author-fullblog pr-2 pt-1">
                    <span className="text-6xl items-centre justify-center">~</span> {post.author_name}
                </div>
            </div>

            {post.content && post.content.map((block, index) => (
                <div key={index} className="flex flex-row gap-8">
                    <div 
                        className="flex-1 text-[1.2rem] leading-tight pt-1.5 blog-content"
                        dangerouslySetInnerHTML={{ __html: block.text }}
                    ></div>
                    {block.image && (
                        <div className="w-[22rem] h-[22rem] shrink-0 bg-[#d9d9d9] mt-1 relative overflow-hidden">
                            <Image src={block.image} fill={true} alt="blog visual" className="object-cover" />
                        </div>
                    )}
                </div>
            ))}
        </div>
        <div className="col-span-3 hidden lg:block"></div>
      </div>

      {/* FIXED SIDEBAR (DESKTOP) */}
      <div className="hidden md:flex fixed bottom-8 right-[3.65rem] w-[20%] h-[38rem] flex-col justify-end gap-4 z-50">
            <div className="progress_indiator px-4 py-3 flex flex-col justify-between bg-progress-indicatortab rounded-xl backdrop-blur-sm gap-3 shrink-0">
                <div className="progess_percentage_comment flex justify-between items-end">
                    <div className="progress_comment text-sm font-body font-medium text-[#4b2b07]">
                        {scrollProgress < 100 ? "Keep reading!" : "Done!"}
                    </div>  
                    <div className="progress_percentage font-heading text-[#4b2b07] font-medium leading-none">
                        {scrollProgress}%
                    </div>
                </div>
                <div className="progrss_bar h-[0.35rem] w-full bg-main">
                    <div className="h-full bg-progress-line transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
                </div>
            </div>

            <div className={`other_blogs_recomendation p-4 bg-sidebar rounded-xl flex flex-col justify-between transition-all duration-500 ease-in-out overflow-hidden ${activeSection === 'blogs' ? 'flex-1 overflow-y-auto' : 'h-[8rem]'}`}>
                {otherBlogs.length > 0 ? (
                    otherBlogs.map((blog, index) => (
                        <a href={`/blog/${blog.id}`} key={blog.id} className="blog_block mt-1 shrink-0 group cursor-pointer block hover:opacity-80 transition-opacity">
                            <div className="Papers_used font-semibold font-heading text-[18px] mt-2 truncate">{blog.title}</div>
                            <div className="ecpricit line-clamp-2 leading-tight font-body text-sm my-2 text-black/70">{getExcerpt(blog.content)}</div>
                            <div className={`h-[1px] w-full bg-[linear-gradient(90deg,#D9D9D9_0%,#171717_5%,#171717_95%,#D9D9D9_100%)] mt-1 transition-opacity duration-300 ${activeSection === 'blogs' && index !== otherBlogs.length - 1 ? 'opacity-50' : 'opacity-0'}`}></div>
                        </a>
                    ))
                ) : (
                    <div className="blog_block mt-1 shrink-0 opacity-50 text-center py-4">No other blogs yet.</div>
                )}
            </div>

            {/* 👇 PAPERS USED WIRED UP */}
            <div 
                onClick={() => toggleSection('papers')}
                className={`bottom_bars papers_used p-4 bg-sidebar rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${activeSection === 'papers' ? 'flex-1' : 'h-[4.5rem] shrink-0'}`}
            >
                 <div className="flex justify-between items-center mb-2 shrink-0">
                     <div className="Papers_used font-semibold font-heading text-[18px]"> Papers used</div>
                     <div className={`arrow_button w-7 h-7 relative transition-transform duration-500 ${activeSection === 'papers' ? 'rotate-180' : 'rotate-0'}`}>
                         <Image src={arrow.src} fill={true} alt="arrow" className="object-contain"/>
                     </div>
                 </div>

                 <div onClick={(e) => e.stopPropagation()} className={`text-sm font-body mt-2 overflow-y-auto transition-all duration-500 flex flex-col gap-3 ${activeSection === 'papers' ? 'opacity-100' : 'opacity-0'}`}>
                     {post.papers && post.papers.length > 0 ? (
                        post.papers.map((p, i) => (
                            <div key={i} className="flex flex-col gap-1 border-b border-black/5 pb-2">
                                <span className="font-medium">{i+1}. {p.title}</span>
                                {p.link && (
                                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                                    View Source [Link]
                                  </a>
                                )}
                            </div>
                        ))
                     ) : (
                        <div className="opacity-50 italic">No papers cited for this post</div>
                     )}
                 </div>
            </div>

            <div 
                onClick={() => toggleSection('author')}
                className={`bottom_bars Author p-4 bg-sidebar rounded-xl cursor-pointer overflow-hidden transition-all duration-500 ease-in-out flex flex-col ${activeSection === 'author' ? 'flex-1' : 'h-[4.5rem] shrink-0'}`}
            >
                 <div className="flex justify-between items-center mb-2 shrink-0">
                     <div className="Papers_used font-semibold font-heading text-[18px]"> Author</div>
                     <div className={`arrow_button w-7 h-7 relative transition-transform duration-500 ${activeSection === 'author' ? 'rotate-180' : 'rotate-0'}`}>
                         <Image src={arrow.src} fill={true} alt="arrow" className="object-contain"/>
                     </div>
                 </div>

                 <div className={`text-sm font-body mt-2 overflow-y-auto transition-all duration-500 flex flex-col ${activeSection === 'author' ? 'opacity-100' : 'opacity-0'}`}>
                      {post.author_image && (
                        <div className="w-16 h-16 rounded-full overflow-hidden relative mb-3 border-2 border-black/10 shrink-0">
                            <Image src={post.author_image} fill={true} className="object-cover" alt={post.author_name} />
                        </div>
                      )}
                      <div className="font-bold text-lg">{post.author_name}</div>
                      <div className="text-xs opacity-70 mb-2 font-medium">{post.author_role}</div>
                      <div className="leading-relaxed opacity-90">{post.author_bio}</div>
                 </div>
            </div>
      </div>
    </div>
  );
}