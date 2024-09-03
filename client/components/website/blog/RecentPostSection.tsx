import React from "react";

export default async function RecentPostSection() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Posts</h3>
      <ul className="space-y-4">
        <li className="flex">
          <img
            src="https://via.placeholder.com/80x80"
            alt="Post Thumbnail"
            className="w-16 h-16 object-cover rounded-md mr-4"
          />
          <div>
            <a
              href="#"
              className="text-gray-800 hover:text-blue-600 font-semibold"
            >
              10 Tips for a Healthy Lifestyle
            </a>
            <p className="text-gray-500 text-sm">August 18, 2023</p>
          </div>
        </li>
        {/* <!-- Repeat for more recent posts --> */}
      </ul>
    </div>
  );
}
