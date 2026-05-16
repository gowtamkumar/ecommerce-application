import React from "react";
import Link from "next/link";

export default function PostHeader() {
  return (
    <header
      className="relative h-[400px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax-like feel */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-110"
        style={{
          backgroundImage: `url('/images/blog_hero_bg.png')`,
        }}
      />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <nav className="mb-6 flex justify-center items-center space-x-2 text-sm font-medium text-gray-300 uppercase tracking-[0.3em]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-gray-500">/</span>
          <span className="text-white">Our Blog</span>
        </nav>
        
        <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-2xl">
          Insights & <span className="text-blue-500">Inspiration</span>
        </h1>
        
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full" />
        
        <p className="text-gray-200 text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Discover the latest trends, expert advice, and stories from the heart of our community.
        </p>
      </div>
    </header>
  );
}
