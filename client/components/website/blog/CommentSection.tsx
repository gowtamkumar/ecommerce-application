'use client';
import { saveComment } from "@/lib/apis/comments";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CommentSection({
  comments = [],
  postId,
}: {
  comments?: any[];
  postId: string;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.content) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        postId,
      };

      const res = await saveComment(payload);

      if (res.statusCode === 201 || res.success) {
        toast.success("Comment submitted successfully!");
        setFormData({ name: "", email: "", content: "" });
      } else {
        toast.error(res.message || "Failed to submit comment.");
      }
    } catch (error) {
      console.error("Comment Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
        Comments ({comments.length})
      </h3>

      <div className="space-y-8 mb-12">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 relative w-12 h-12">
                <Image
                  alt={comment?.user?.name || "User"}
                  src={getUploadImageUrl(comment?.user?.image)}
                  fill
                  className="rounded-full object-cover border border-gray-100"
                  sizes="48px"
                />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl rounded-tl-none p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">
                      {comment?.user?.name || "Anonymous"}
                    </h4>
                    <span className="text-xs text-gray-400 font-medium">
                      {dayjs(comment.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>

      {/* <!-- Comment Form --> */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h4 className="text-xl font-bold text-gray-900 mb-6">
          Leave a Comment
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-global-primary/10 focus:border-global-primary transition-all placeholder-gray-400"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-global-primary/10 focus:border-global-primary transition-all placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Comment
            </label>
            <textarea
              id="content"
              rows={5}
              value={formData.content}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-global-primary/10 focus:border-global-primary transition-all placeholder-gray-400 resize-y"
              placeholder="Write your comment here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-global-primary hover:bg-global-hover text-white font-semibold rounded-xl shadow-lg hover:shadow-global-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
