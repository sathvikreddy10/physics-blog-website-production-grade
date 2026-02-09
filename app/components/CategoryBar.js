"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'

export default function CategoryBar({ categories = [] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollRef = useRef(null) 
  const [showArrow, setShowArrow] = useState(false) 
  
  const selectedCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const isOverflowing = scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        setShowArrow(isOverflowing)
      }
    }

    checkScroll() 
    window.addEventListener('resize', checkScroll) 
    return () => window.removeEventListener('resize', checkScroll)
  }, [categories])

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(searchParams)
    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' })
    }
  }

  return (
    // 👇 UPDATED: Mobile 35%, Desktop 20%
    <div className="relative flex items-center max-w-[35%] md:max-w-[20%] gap-2">
      
      {/* Scrollable List */}
      <div 
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0 pb-2 w-full scroll-smooth"
      >
        <button
          onClick={() => handleCategoryClick('All')}
          className={`whitespace-nowrap px-2 py-[0.15rem] rounded-[0.25rem] text-sm font-body transition-colors border shrink-0
            ${selectedCategory === 'All' 
              ? 'bg-black text-white border-black' 
              : 'bg-white text-gray-600 border-gray-300 hover:border-black'
            }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`whitespace-nowrap px-2 py-[0.15rem] rounded-[0.25rem] text-sm font-body transition-colors border shrink-0
              ${selectedCategory === cat 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-black'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conditionally Render Arrow */}
      {showArrow && (
        <button 
          onClick={scrollRight}
          className="shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition shadow-md z-10 mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      )}

    </div>
  )
}