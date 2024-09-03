import React from "react";
import Header from "../header/Header";
import WebFooter from "../Footer";

export default function Index() {
  return (
    <div>
      {/* <!-- Navbar --> */}
      <Header />
      {/* <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a
            href="#"
            className="text-2xl font-bold text-gray-800 hover:text-gray-700"
          >
            YourBrand
          </a>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-800 hover:text-gray-700">
              Home
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-700">
              Shop
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-700">
              Blog
            </a>
            <a href="#" className="text-gray-800 hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </nav> */}

      {/* <!-- Header --> */}
      <header
        className="bg-cover bg-center h-64"
        style={{
          backgroundImage: `url('https://via.placeholder.com/1920x400')`,
        }}
      >
        <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold uppercase">
              Our Blog
            </h1>
            <p className="text-gray-300 mt-2">
              Latest news, updates, and stories
            </p>
          </div>
        </div>
      </header>

      {/* <!-- Main Content --> */}
      <main className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        {/* <!-- Posts Section --> */}
        <section className="w-full lg:w-2/3">
          {/* <!-- Single Post --> */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
            <img
              src="https://via.placeholder.com/800x400"
              alt="Post Image"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span>August 20, 2023</span>
                <span className="mx-2">•</span>
                <span>Fashion</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 hover:text-gray-600">
                <a href="#">The Latest Trends in Summer Fashion</a>
              </h2>
              <p className="text-gray-600 mt-4">
                Explore the newest styles and trends that are making waves this
                summer. From vibrant colors to bold patterns, discover how to
                elevate your wardrobe...
              </p>
              <div className="mt-4">
                <a href="#" className="text-blue-600 hover:underline">
                  Read more
                </a>
              </div>
            </div>
          </article>

          {/* <!-- Repeat Post --> */}
          {/* <!-- Add more post articles as needed --> */}

          {/* <!-- Pagination --> */}
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <a
                href="#"
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Previous
              </a>
              <a
                href="#"
                className="px-3 py-2 bg-blue-600 text-white rounded-md"
              >
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
        </section>

        {/* <!-- Sidebar Section --> */}
        <aside className="w-full lg:w-1/3">
          {/* <!-- Search --> */}
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

          {/* <!-- Categories --> */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Fashion
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Lifestyle
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Travel
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-blue-600 hover:underline"
                >
                  Food
                </a>
              </li>
            </ul>
          </div>

          {/* <!-- Recent Posts --> */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Posts
            </h3>
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

          {/* <!-- Tags --> */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #fashion
              </a>
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #technology
              </a>
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #lifestyle
              </a>
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #travel
              </a>
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #food
              </a>
              <a
                href="#"
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                #health
              </a>
            </div>
          </div>
        </aside>
      </main>

      {/* <!-- Footer --> */}
      <WebFooter />
     
    </div>
  );
}
