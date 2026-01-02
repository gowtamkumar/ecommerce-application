/* eslint-disable @next/next/no-img-element */
import {
  GlobalOutlined,
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/apis/setting";

export const metadata: Metadata = {
  title: "About Us | Our Story & Mission",
  description: "Learn about our journey, our values, and the team committed to bringing you the best experience.",
};

const stats = [
  { label: "Years of Excellence", value: "10+", icon: <TrophyOutlined /> },
  { label: "Happy Customers", value: "50k+", icon: <TeamOutlined /> },
  { label: "Countries Served", value: "30+", icon: <GlobalOutlined /> },
  { label: "Products Delivered", value: "1M+", icon: <RocketOutlined /> },
];

export default async function About() {
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const aboutPage = setting?.aboutPage || {};
  
  const sections = (aboutPage?.sections || [
    { slug: "hero", status: true, sequence: 1 },
    { slug: "stats", status: true, sequence: 2 },
    { slug: "origin_story", status: true, sequence: 3 },
    { slug: "mission_vision", status: true, sequence: 4 },
    { slug: "team", status: true, sequence: 5 },
    { slug: "cta", status: true, sequence: 6 },
  ])
  .filter((s: any) => s.status)
  .sort((a: any, b: any) => a.sequence - b.sequence);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero" className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 -z-10" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/40 to-transparent -z-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 text-blue-600 text-sm font-semibold tracking-wider mb-6 border border-blue-100">
              OUR JOURNEY
            </span>
            <h1 className="text-5xl lg:text-8xl font-bold font-global-primary-fontfamily text-gray-900 mb-8 tracking-tight leading-tight">
              Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-global-primary to-purple-600">Digital</span> Experiences
            </h1>
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/50 shadow-sm inline-block max-w-3xl">
              <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed">
                We started with a simple idea: to create a platform that brings premium quality and exceptional design to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    stats: (
      <section key="stats" className="container mx-auto px-6 mb-20 relative z-20 pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 lg:p-12 border border-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 border-r last:border-r-0 border-gray-100">
              <div className="text-3xl text-global-primary mb-3 opacity-80">{stat.icon}</div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    ),
    origin_story: (
      <section key="origin_story" className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute top-10 -left-10 w-full h-full bg-global-primary/5 rounded-3xl -z-10 transform -rotate-3" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 aspect-[4/3] group">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                alt="Our Workspace"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-global-primary-fontfamily text-gray-900 mb-6">
                How It All <span className="text-global-primary">Began</span>
              </h2>
              <div className="h-1 w-20 bg-global-primary rounded-full" />
            </div>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-light">
              <p>
                Founded in a small garage in 2020, we saw a gap in the market for products that didn't just function well, but looked beautiful while doing it. We believed that technology and aesthetics shouldn't be mutually exclusive.
              </p>
              <p>
                What started as a passion project has grown into a global community of creators, thinkers, and innovators. We're driven by the belief that good design can change the way we interact with the world around us.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/contact" className="text-global-primary font-semibold hover:text-gray-900 transition-colors inline-flex items-center gap-2 group">
                Read more about our timeline
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    mission_vision: (
      <section key="mission_vision" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-800 to-transparent opacity-50" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-colors duration-500">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl mb-8 text-blue-400">
                <RocketOutlined />
              </div>
              <h3 className="text-3xl font-bold font-global-primary-fontfamily mb-4">Our Mission</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To empower individuals and businesses by providing innovative, high-quality solutions that enhance productivity and inspire creativity in everyday life.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 hover:bg-white/10 transition-colors duration-500">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl mb-8 text-purple-400">
                <GlobalOutlined />
              </div>
              <h3 className="text-3xl font-bold font-global-primary-fontfamily mb-4">Our Vision</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To be the world's leading destination for design-centric technology, fostering a global community where innovation knows no boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
    team: (
      <section key="team" className="container mx-auto px-4 lg:px-8 py-24 lg:py-32">
        <div className="text-center mb-20">
          <span className="uppercase tracking-widest text-xs font-bold text-gray-400 block mb-4">THE MINDS BEHIND THE MAGIC</span>
          <h2 className="text-4xl lg:text-5xl font-bold font-global-primary-fontfamily text-gray-900">
            Meet the Team
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl mb-6 bg-gray-100 aspect-[3/4]">
                <img
                  src={`https://images.unsplash.com/photo-${item === 1 ? '1560250097-0b93528c311a' : item === 2 ? '1573496359142-b8d87734a5a2' : item === 3 ? '1580489944761-15a19d654956' : '1534528741775-53994a69daeb'}?auto=format&fit=crop&w=800&q=80`}
                  alt="Team Member"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm">"Driven by passion, defined by quality."</p>
                </div>
              </div>
              <div className="text-center transform transition-transform group-hover:-translate-y-2">
                <h3 className="text-xl font-bold text-gray-900 mb-1 font-global-primary-fontfamily">
                  {item === 1 ? 'John Doe' : item === 2 ? 'Jane Smith' : item === 3 ? 'Mike Johnson' : 'Sarah Wilson'}
                </h3>
                <p className="text-sm font-medium text-global-primary uppercase tracking-wider">
                  {item === 1 ? 'Founder & CEO' : item === 2 ? 'Head of Design' : item === 3 ? 'Lead Developer' : 'Product Manager'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    cta: (
      <section key="cta" className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 opacity-50 patterned-bg" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 lg:p-20 text-white shadow-2xl">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-global-primary-fontfamily">Ready to start your journey?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto font-light">
              Join thousands of satisfied customers and discover why we are the preferred choice for premium quality products.
            </p>
            <Link href="/contact" className="inline-block px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-wider hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className="font-global-secondary-fontfamily text-gray-800 bg-gray-50/50">
      {sections.map((section: any) => sectionMap[section.slug])}
    </div>
  );
}
