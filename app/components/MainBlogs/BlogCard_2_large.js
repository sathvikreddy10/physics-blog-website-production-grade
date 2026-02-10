"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import photo from "./placeholder.png"

export default function BlogCard_2_large({ data }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => { router.push(`/blog/${data?.id}`); }, 400);
  };

  const getCoverImage = () => {
    if (!data?.content) return photo.src;
    const imgBlock = data.content.find(b => b.image && b.image.length > 0);
    return imgBlock ? imgBlock.image : photo.src;
  };
  const getExcerpt = () => {
    if (!data?.content) return "No description available.";
    const textBlock = data.content.find(b => b.text && b.text.trim().length > 0);
    return textBlock ? textBlock.text.replace(/<[^>]+>/g, '') : "";
  };
  const formatDate = (dateString) => {
    if(!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}/${date.toLocaleDateString('en-US', { year: '2-digit' })}`;
  };

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[99999] bg-[#FFA443]" />
        )}
      </AnimatePresence>

      <div onClick={handleNavigation} className="cursor-pointer group relative z-10">
        <div className="
            BlogCard_large 
            rounded-[1.5rem] 
            w-[42.15rem] h-[22.5rem] 
            flex px-7 py-2 
            relative overflow-hidden items-center gap-8 shrink-0 
            
            border border-[#c3c3c3bc] 
            hover:border-[#FFA443]

            bg-white hover:bg-[#FFA443]
            transition-colors duration-75 ease-linear
            
            transform will-change-transform
            hover:-translate-y-1 
            transition-transform duration-200 cubic-bezier(0.34, 1.56, 0.64, 1)
        ">
            <div className="letters w-[55%] h-full flex flex-col justify-between">
              <div className="header_and_author flex flex-col mt-6 w-full">
                <div className="blog_heading font-heading font-semibold text-[1.65rem] truncate text-black">
                    {data?.title || "Untitled"}
                </div>
                <div className="author_name font-body font-medium text-xs text-[#a7a4a4] group-hover:text-black/60 flex items-center justify-end gap-1 transition-colors duration-75">
                    <div className="w-2 h-[2px] bg-[#c9c6c6] group-hover:bg-black/60 truncate"></div> 
                     {data?.author_name || "Unknown"}
                </div>
              </div>
              <div className="exprit_extras flex flex-col w-full">
                <div className="exprit font-body font-normal leading-tight line-clamp-8 text-black group-hover:text-black/90 transition-colors duration-75">
                    {getExcerpt()}
                </div>
                <div className="extras mt-auto w-full flex items-center justify-between pt-4 border-t border-transparent relative min-h-[40px]">
                    <div className="flex gap-4 text-xs font-normal font-body text-[#171717]">
                      <div className="read_time">5 min</div>
                      <div className="Date_upload">{formatDate(data?.created_at)}</div>
                    </div>
                    <div className="Read_more text-xs font-normal font-body text-[hsl(42,59%,30%)] flex items-center gap-1 group-hover:opacity-0 transition-opacity duration-75">
                      → Read more
                    </div>
                </div>
              </div>
            </div>

            <div className="image_container w-[40.5%] h-full shrink-0 flex items-end justify-center pb-7">
                <div className="image_wrapper relative w-full h-[70%] rounded-[1rem] overflow-hidden items-end justify-center bg-gray-100">
                     <Image src={getCoverImage()} fill={true} alt="image" className="object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
            </div>

            {/* BUTTON */}
            <div className="
                  absolute -right-2 -bottom-2
                  w-24 h-24 bg-[#FFA443] border-[8px] border-white rounded-full 
                  flex items-center justify-center z-20
                  scale-0 opacity-0 translate-y-6 translate-x-6
                  group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0
                  transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
              ">
                  <motion.svg width="36" height="36" viewBox="-5.76 -5.76 35.52 35.52" fill="none" className="transform -translate-y-1 translate-x-1" initial={{ rotate: 45 }} whileHover={{ rotate: [45, 42, 51, 45] }} transition={{ duration: 0.4, ease: "easeInOut" }}>
                      <path d="M12 4.5L17 9.5M12 4.5L7 9.5M12 4.5C12 4.5 12 12.8333 12 14.5C12 16.1667 11 19.5 7 19.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> 
                  </motion.svg>
            </div>
        </div>
      </div>
    </>
  )
}