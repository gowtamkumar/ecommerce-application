import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import Image from "next/image";

export default function CommentSection({ comments = [] }: { comments?: any[] }) {
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
                    <h4 className="font-bold text-gray-900">{comment?.user?.name || "Anonymous"}</h4>
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
          <p className="text-gray-500 italic text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      {/* <!-- Comment Form --> */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h4 className="text-xl font-bold text-gray-900 mb-6">
          Leave a Comment
        </h4>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 text-sm font-semibold mb-2">
              Comment
            </label>
            <textarea
              id="comment"
              rows={5}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400 resize-y"
              placeholder="Write your comment here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
