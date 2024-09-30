import React from "react";

export default function PostSearchSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Search</h3>
      <form>
        <div className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
            placeholder="Search..."
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-600"
          >
            🔍
          </button>
        </div>
      </form>
    </div>
  );
}
