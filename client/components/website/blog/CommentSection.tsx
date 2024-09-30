import React from "react";

export default function CommentSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-10">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h3>
      <div className="space-y-6">
        <div className="flex">
          <img
            src="https://via.placeholder.com/50x50"
            alt="User Image"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h4 className="font-semibold text-gray-800">User Name</h4>
            <p className="text-gray-600">
              This is a comment by a user on the blog post.
            </p>
            <span className="text-gray-500 text-sm">August 20, 2023</span>
          </div>
        </div>
        {/* <!-- Repeat for more comments --> */}
      </div>

      {/* <!-- Comment Form --> */}
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h4>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
              placeholder="Your Comment"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
