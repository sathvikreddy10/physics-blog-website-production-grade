"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlogCard_mobile({ post, orientation = "right" }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => { router.push(`/blog/${post.id}`); }, 400);
  };

  const flexDirection = orientation === "left" ? "flex-row-reverse" : "flex-row"
  const visual = post.image || post.content?.find(block => block.image)?.image;

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
            <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[9999] bg-main" />
        )}
      </AnimatePresence>

      <div 
        onClick={handleNavigation}
        className={`
            cursor-pointer group w-full bg-white rounded-2xl p-3 
            flex ${flexDirection} gap-4 
            shadow-sm hover:shadow-md transition-shadow duration-300
            h-[11rem] overflow-hidden relative
            /* No hover bg change for mobile usually, but you can add if desired */
        `}
      >
        <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-heading font-bold leading-[1.1] text-black line-clamp-2">
                    {post.title}
                </h2>
                <span className="text-xs font-body text-gray-400 font-medium">
                    — {post.author_name}
                </span>
                <p className="text-xs font-body text-gray-600 leading-relaxed line-clamp-3 mt-1">
                    {post.excerpt || (post.content?.[0]?.text?.replace(/<[^>]+>/g, '') || "Click to read more...")}
                </p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 text-[10px] font-body font-medium text-gray-400">
                <div className="flex items-center gap-3">
                    <span>{post.read_time || "5 min"}</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Jan 12/26"}</span>
                </div>
                <div className="flex items-center gap-1 text-readmore">
                    <span>→</span>
                    <span className="underline decoration-[#FFA443]/30 underline-offset-2">Read</span>
                </div>
            </div>
        </div>

        <div className="relative w-[38%] shrink-0 h-full rounded-xl overflow-hidden bg-gray-200">
            {visual ? (
                <Image src={visual} alt={post.title} fill sizes="(max-width: 768px) 40vw, 33vw" className="object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2 font-medium bg-gray-100">SB</div>
            )}
        </div>
      </div>
    </>
  )
}