import { motion } from "framer-motion";

export default function BlogCard({ post }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="card flex gap-4">
      <img
        src={post.thumbnail}
        alt=""
        className="w-48 h-28 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-1">Apr 18, 2024</div>
        <h4 className="font-semibold text-lg">{post.title}</h4>
        <p className="text-sm text-gray-600 mt-2">{post.description}</p>
        <button className="mt-4 text-green-600 font-medium">
          Read full post
        </button>
      </div>
    </motion.article>
  );
}
