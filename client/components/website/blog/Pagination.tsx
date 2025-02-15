import React from "react";

export default function Pagination() {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex space-x-2">
        <a
          href="#"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Previous
        </a>
        <a href="#" className="px-3 py-2 bg-blue-600 text-white rounded-md">
          1
        </a>
        <a
          href="#"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          2
        </a>
        <a
          href="#"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          3
        </a>
        <a
          href="#"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Next
        </a>
      </nav>
    </div>
  );
}
