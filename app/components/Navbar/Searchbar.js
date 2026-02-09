"use client"

import Filter from './Filter.svg'
import Search from './search-icon.svg'
import CloseIcon from './X.svg'
import { usePathname, useRouter, useSearchParams } from 'next/navigation' // 👈 IMPORTANT IMPORTS
import React, { useState, useEffect } from 'react' 
import FilterMenu from './FilterMenu.js'

export default function SearchBar() {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    
    // States
    const [isExpanded, setIsExpanded] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    
    // Initialize query from URL so it doesn't disappear on refresh
    const [query, setQuery] = useState(searchParams.get('q')?.toString() || "")

    // 1. Hide on non-home pages
    if (pathName !== '/') return null

    // 2. Handle Text Input (The Wiring)
    const handleSearch = (e) => {
        const term = e.target.value
        setQuery(term)
        
        const params = new URLSearchParams(searchParams);
        
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        
        console.log("SEARCH BAR: Updating URL to ->", `${pathName}?${params.toString()}`);
        
        replace(`${pathName}?${params.toString()}`, { scroll: false });
    }

    // 3. Reset everything when clicking outside
    const handleClose = () => {
        setIsExpanded(false)
        setShowFilter(false)
    }

    // 4. Toggle Filter Logic
    const toggleFilter = () => {
        const willOpen = !showFilter;
        setShowFilter(willOpen); 
        if (willOpen) setIsExpanded(true); 
    }

    return (
        <>
            {/* INVISIBLE BACKDROP */}
            {(isExpanded || showFilter) && (
                <div className="fixed inset-0 z-10" onClick={handleClose} />
            )}

            {/* MAIN SEARCH CONTAINER */}
            <div className={`
                /* SHARED: Smooth animations, centered X, z-index */
                transition-all duration-300 ease-out
                absolute left-1/2 -translate-x-1/2

                /*  DESKTOP (DEFAULT): Sits at the top */
                 mt-1
                ${isExpanded ? 'w-96' : 'w-64'} 

                /* 📱 MOBILE OVERRIDE (Only if screen < 768px) */
                /* This effectively says: "Ignore top-0, use calc instead" */
                max-md:top-[calc(100vh-6rem)]
                
                ${isExpanded 
                    ? 'max-md:w-[90vw]' 
                    : 'max-md:w-[70vw]'
                }
            `}>
                <div className="h-10 rounded-full bg-[#adcffe] flex justify-between items-center px-2 relative cursor-pointer min-w-0 overflow-hidden">
                    <img src={Search.src} alt="Search" className="w-7 shrink-0"/>
                    <div className="flex-1 flex items-center ml-2 min-w-0">
                        {!isExpanded ? (
                            <div className='overflow-hidden flex items-center min-w-0 w-full'>
                            <span 
                                onClick={() => setIsExpanded(true)}
                                className="text-sm text-[#171717] font-body select-none text-center truncate block flex-1 min-w-0 px-2 "
                            >
                               {query ? query : "Search"}
                            </span>
                            </div>
                        ) : (
                            <input 
                                autoFocus 
                                value={query}
                                onChange={handleSearch}
                                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-600 font-body min-w-0" 
                                placeholder="Search anything..." 
                            />
                        )}
                    </div>
                    <button 
                        onClick={toggleFilter}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors w-10 flex justify-center items-center shrink-0"
                    >
                        {showFilter ? <img src={CloseIcon.src} alt="Close" className="w-8 h-8"/> : <img src={Filter.src} alt="Filter" className="w-10"/>}
                    </button>
                </div>
                {showFilter && <FilterMenu />}
            </div>
        </>
    )
}