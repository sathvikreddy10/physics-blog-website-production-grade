import React from 'react'
import BlogCard_1_small from '../components/MainBlogs/BlogCard_1_small'
import BlogCard_2_large from '../components/MainBlogs/BlogCard_2_large'
import BlogCard_3_medium from '../components/MainBlogs/BlogCard_3_medium'
// 👇 Imported your mobile card
import BlogCard_mobile from '../components/MainBlogs/BlogCard_mobile'

export default function BlogsContent({ posts = [] }) {
  
  // Helper: Chunk the posts into groups of 3 (for your 3-card rows)
  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const rows = chunkArray(posts, 3);

  return (
    <div className="body_cards flex flex-col gap-3 pb-20">

      {/* =========================================
          📱 MOBILE VIEW (Visible < 768px)
          - Uses simple vertical stack
          - Uses BlogCard_mobile with alternating L/R logic
      ========================================= */}
      <div className="md:hidden flex flex-col gap-4 px-4">
        {posts.map((post, i) => (
            <BlogCard_mobile 
                key={post.id} 
                post={post} // Ensure your mobile card expects 'post' or 'data' prop correctly
                orientation={i % 2 === 0 ? "right" : "left"} 
            />
        ))}
      </div>

      {/* =========================================
          💻 DESKTOP VIEW (Visible >= 768px)
          - YOUR ORIGINAL LOGIC UNTOUCHED
      ========================================= */}
      <div className="hidden md:flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={i} className="px-site flex gap-4 contains_all_cards">
                
                {/* --- SLOT 1 --- */}
                {row[0] && (
                  (i % 5 === 0) ? <BlogCard_1_small data={row[0]} /> :
                  (i % 5 === 1) ? <BlogCard_2_large data={row[0]} /> :
                  (i % 5 === 2) ? <BlogCard_2_large data={row[0]} /> :
                  (i % 5 === 3) ? <BlogCard_3_medium data={row[0]} /> :
                                  <BlogCard_1_small data={row[0]} />
                )}

                {/* --- SLOT 2 --- */}
                {row[1] && (
                  (i % 5 === 0) ? <BlogCard_2_large data={row[1]} /> :
                  (i % 5 === 1) ? <BlogCard_1_small data={row[1]} /> :
                  (i % 5 === 2) ? <BlogCard_3_medium data={row[1]} /> :
                  (i % 5 === 3) ? <BlogCard_1_small data={row[1]} /> :
                                  <BlogCard_3_medium data={row[1]} />
                )}

                {/* --- SLOT 3 --- */}
                {row[2] && (
                  (i % 5 === 0) ? <BlogCard_3_medium data={row[2]} /> :
                  (i % 5 === 1) ? <BlogCard_3_medium data={row[2]} /> :
                  (i % 5 === 2) ? <BlogCard_1_small data={row[2]} /> :
                  (i % 5 === 3) ? <BlogCard_2_large data={row[2]} /> :
                                  <BlogCard_2_large data={row[2]} />
                )}

            </div>
          ))}
      </div>

      {posts.length === 0 && (
          <div className="px-site py-10 text-center opacity-50 font-body">
              No blogs found. Go publish some vibes! 🚀
          </div>
      )}

    </div>  
  )
}