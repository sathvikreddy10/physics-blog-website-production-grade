import { supabase } from "./lib/supabase"; 
import BlogsContent from "./HomeBlogs/BlogsContent";
import Navbar from "./components/Navbar/Navbar";
import CategoryBar from "./components/CategoryBar"; 
// 👇 1. IMPORT THE ANIMATION
import HomeIntro from "./components/HomeIntro"; 

export const revalidate = 0;

export default async function Home({ searchParams }) {
  
  // 1. Unwrap Search Params
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams?.q?.toString().toLowerCase() || "";
  const selectedCategory = resolvedParams?.category || "All";

  // 2. Fetch ALL posts from Supabase
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Error fetching posts:", error);

  // 3. EXTRACT UNIQUE CATEGORIES
  const uniqueCategories = [...new Set(posts?.map(p => p.category).filter(Boolean))];

  // 4. FILTER LOGIC
  let filteredPosts = posts || [];

  if (searchQuery) {
    filteredPosts = filteredPosts.filter((post) => 
      post.title?.toLowerCase().includes(searchQuery)
    );
  }

  if (selectedCategory !== "All") {
    filteredPosts = filteredPosts.filter((post) => 
      post.category === selectedCategory
    );
  }

  return (
    <>
      {/* 👇 2. PLUG IT IN HERE (It sits on top of everything) */}
      <HomeIntro />

      <Navbar/>
      
      <div className="h-[5.2rem] bg-transparent"></div>
      
      {/* WIRED CATEGORY BAR */}
      <div className="category m-0 px-site">
         <CategoryBar categories={uniqueCategories} />
      </div>

      {/* Passing filtered data down */}
      <BlogsContent posts={filteredPosts} /> 
    </>
  );
}