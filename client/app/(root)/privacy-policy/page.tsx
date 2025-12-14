import { getPageBySlug } from "@/lib/apis/page";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiShield } from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export const metadata: Metadata = {
  title: "Privacy Policy | Ecommerce",
  description: "Learn how we collect, use, and protect your information.",
};

export default async function PrivacyPolicyPage() {
  const pageRes = await getPageBySlug('privacy-policy');
  const page = pageRes?.data;

  // Fallback content if no dynamic page is found
  const fallbackContent = (
    <div className="space-y-12">
      {/* Introduction */}
      <section>
        <p className="text-gray-600 leading-relaxed text-lg">
          This privacy policy outlines how our e-commerce platform collects,
          uses, and protects any information that you provide when using our
          services. We are committed to ensuring that your privacy is protected.
        </p>
      </section>

      {/* Information Collection */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Information Collection
        </h2>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <p className="text-gray-600 mb-4">
            We collect the following information to better understand your needs and provide you with a better service:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {['Name and job title', 'Contact information including email address', 'Demographic information', 'Payment details', 'Other preferences'].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use of Information */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          How We Use Your Information
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          The information collected is used for internal record keeping,
          processing orders, improving our products and services, and sending
          promotional emails about new products and offers.
        </p>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Security
        </h2>
        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
          <p className="text-gray-700 leading-relaxed">
            We are committed to ensuring that your information is secure. We
            have implemented suitable physical, electronic, and managerial
            procedures to safeguard and secure the information we collect
            online.
          </p>
        </div>
      </section>

      {/* Cookies */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Cookies
        </h2>
        <p className="text-gray-600 leading-relaxed">
          A cookie is a small file which asks permission to be placed on your
          computers hard drive. Cookies help us analyze web traffic and tailor
          our site to customer needs. You can choose to accept or decline cookies.
        </p>
      </section>

      {/* Your Control */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Your Control
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You may choose to restrict the collection or use of your personal
          information by opting out of receiving promotional communication or
          by contacting us to update or remove your information.
        </p>

        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Have questions?</h3>
          <p className="text-gray-400 mb-6">
            If you have any questions about this Privacy Policy, please contact our support team.
          </p>
          <a href="mailto:support@example.com" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[350px] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/90"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="font-medium text-white">{page?.title || "Privacy Policy"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              {page?.title || "Privacy Policy"}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-20 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 md:p-12 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiShield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Your Privacy Matters</h2>
                  <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {page ? (
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
                  {page.contentType === 'markdown' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {page.content}
                    </ReactMarkdown>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  )}
                </div>
              ) : (
                fallbackContent
              )}

            </div>
          </div>
        </section>
      </main>

      <WebFooter />
    </div>
  );
};
