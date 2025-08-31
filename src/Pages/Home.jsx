// src/Pages/Home.jsx

import BlogCard from "@/components/BlogCard";
import blogData from "@/data/blogData.json"; // Your existing data source
import { ArrowUpRight } from "lucide-react";

// The target UI has 6 posts, so we'll duplicate the data to fill the layout.
const displayBlogData = [...blogData, ...blogData];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Home</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Get started</h4>
            <ArrowUpRight size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Read our getting started guide to get the most out of your
            Capitalmind subscription.
          </p>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Community</h4>
            <ArrowUpRight size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Join the conversation on our exclusive community on Slack for
            Capitalmind Premium subscribers.
          </p>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Visit website</h4>
            <ArrowUpRight size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Keep up with our latest content on our website.
          </p>
        </div>
      </div>
      <h3 className="text-xl mt-8 mb-4">Latest Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayBlogData.map((b, index) => (
          <BlogCard key={`${b.id}-${index}`} post={b} />
        ))}
      </div>
    </div>
  );
}
