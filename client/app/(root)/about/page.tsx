/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

const Header = dynamic(() => import("@/components/website/header/Header"));

export const metadata: Metadata = {
  title: "About us",
  description: "...",
};

export default function About() {
  return (
    <>
      <Header />
      <div className="font-global-secondary-fontfamily text-gray-800">
        {/* <!-- Hero / Intro  --> */}
        <section className="bg-white py-20 lg:py-32 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl lg:text-8xl font-bold font-global-primary-fontfamily text-black mb-8 tracking-tight">
              Our Story
            </h1>
            <p className="text-xl lg:text-2xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
              We started with a simple idea: to create a platform that brings premium quality and exceptional design to everyone.
            </p>
          </div>
        </section>

        {/* <!-- Origin Story Section  --> */}
        <section className="container mx-auto px-4 lg:px-8 pb-20 lg:pb-32">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200">
              <img
                src="https://via.placeholder.com/800x1000"
                alt="Our Workspace"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold font-global-primary-fontfamily text-black">
                How It All Began
              </h2>
              <div className="space-y-4 text-lg text-gray-500 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                  commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                  penatibus et magnis dis parturient montes.
                </p>
                <p>
                  Nulla consequat massa quis enim. Donec pede justo, fringilla
                  vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus
                  ut, imperdiet a, venenatis vitae, justo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Mission & Vision Grid --> */}
        <section className="bg-black text-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
              <div>
                <h3 className="text-3xl font-bold font-global-primary-fontfamily mb-6 text-white border-l-4 border-global-primary pl-6">Mission</h3>
                <p className="text-gray-400 text-lg leading-relaxed pl-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus imperdiet, nulla et dictum interdum, nisi lorem
                  egestas odio.
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold font-global-primary-fontfamily mb-6 text-white border-l-4 border-white pl-6">Vision</h3>
                <p className="text-gray-400 text-lg leading-relaxed pl-6">
                  Quisque volutpat condimentum velit. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos
                  himenaeos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- Team Section  --> */}
        <section className="container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <div className="text-center mb-16">
            <span className="uppercase tracking-widest text-sm font-bold text-gray-400 block mb-4">The People</span>
            <h2 className="text-4xl font-bold font-global-primary-fontfamily text-black">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6 bg-gray-100 aspect-[3/4]">
                  <img
                    src={`https://via.placeholder.com/400x500?text=Member+${item}`}
                    alt="Team Member"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-black mb-1 font-global-primary-fontfamily">
                    John Doe
                  </h3>
                  <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Founder & CEO</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* <!-- Call to Action --> */}
        <section className="bg-gray-50 py-24 text-center">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 font-global-primary-fontfamily text-black">Ready to Start?</h2>
            <p className="text-gray-500 text-lg mb-10">
              Join us on our journey and discover improvements in your life.
            </p>
            <Link href="/contact" className="inline-block px-10 py-4 bg-black text-white rounded-full font-bold uppercase tracking-wider hover:bg-gray-800 hover:shadow-xl transition-all duration-300">
              Get in Touch
            </Link>
          </div>
        </section>
      </div>
      <WebFooter />
    </>
  );
}
