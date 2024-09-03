/* eslint-disable @next/next/no-img-element */
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Header />
      <div>
        {/* <!-- Hero Section  */}
        <section className="bg-[#F6F6F6]">
          <div className="container mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
              About Us
            </h1>
            <p className="mt-4 text-gray-600">
              Discover more about our journey and values.
            </p>
          </div>
        </section>

        {/* <!-- Company Overview Section  */}
        <section className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src="https://via.placeholder.com/500"
                alt="Company Image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-10 mt-6 md:mt-0 ">
              <h2 className="text-2xl font-semibold text-gray-800">
                Our Story
              </h2>
              <p className="mt-4 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes.
              </p>
              <p className="mt-4 text-gray-600">
                Nulla consequat massa quis enim. Donec pede justo, fringilla
                vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus
                ut, imperdiet a, venenatis vitae, justo.
              </p>
            </div>
          </div>
        </section>

        {/* <!-- Mission and Vision Section  */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">
              Our Mission & Vision
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex flex-col md:flex-row mt-10">
              <div className="md:w-1/2 px-4 py-6">
                <h3 className="text-xl font-semibold text-gray-800">Mission</h3>
                <p className="mt-2 text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                  egestas odio.
                </p>
              </div>
              <div className="md:w-1/2 px-4 py-6">
                <h3 className="text-xl font-semibold text-gray-800">Vision</h3>
                <p className="mt-2 text-gray-600">
                  Quisque volutpat condimentum velit. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Team Section  */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Meet the Team
          </h2>
          <div className="flex flex-wrap mt-10">
            {/* <!-- Team Member 1  */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    John Doe
                  </h3>
                  <p className="text-gray-600">CEO & Founder</p>
                </div>
              </div>
            </div>
            {/* <!-- Repeat for other team members  */}
          </div>
        </section>

        {/* <!-- Call to Action Section  */}
        <section className="bg-blue-600 py-16 text-center text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold">Join Our Journey</h2>
            <p className="mt-4 max-w-xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa.
            </p>
            <button className="mt-8 px-8 py-4 bg-blue-800 text-white rounded-full hover:bg-blue-700">
              <Link href="/contact">Contact Us</Link>
            </button>
          </div>
        </section>
      </div>
      <WebFooter />
    </>
  );
}
