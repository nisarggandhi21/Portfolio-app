export default function BlogCard({ post }) {
  return (
    <article className="card">
      <div>
        <div className="text-xs text-gray-400 mb-2">Apr 18, 2024</div>
        <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{post.description}</p>
        <button className="font-medium text-green-600 hover:text-green-700">
          Read full post
        </button>
      </div>
    </article>
  );
}
