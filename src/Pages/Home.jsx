// src/pages/Home.jsx
import BlogCard from "@/components/BlogCard";
import blogData from "@/data/blogData.json"; // now a proper module import

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Home</h2>

      <h3 className="text-xl mt-8 mb-4">Latest Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogData.map((b) => (
          <BlogCard key={b.id} post={b} />
        ))}
      </div>
    </div>
  );
}
