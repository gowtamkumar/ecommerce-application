import React from "react";

export default function PostHeader() {
  return (
    <header
      className="bg-cover bg-center h-64"
      style={{
        backgroundImage: `url('https://via.placeholder.com/1920x400')`,
      }}
    >
      <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold uppercase">Our Blog</h1>
          <p className="text-gray-300 mt-2">
            Latest news, updates, and stories
          </p>
        </div>
      </div>
    </header>
  );
}
