import { getPageBySlug } from "@/lib/apis/page";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiAlertCircle, FiCheckCircle, FiFileText, FiInfo, FiShield } from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export const metadata: Metadata = {
  title: "Terms & Conditions | Ecommerce",
  description: "Read our terms and conditions for using our services.",
};

export default async function TermsPage() {
  const pageRes = await getPageBySlug('terms-conditions');
  const page = pageRes?.data;

  const fallbackSections = [
    {
      title: "1. Acceptance of Terms",
      icon: FiCheckCircle,
      content: "By accessing our platform, you agree to all terms outlined in this document. If you do not agree with any of these terms, you are prohibited from using or accessing this site. These terms apply to all visitors, users, and others who access or use the Service."
    },
    {
      title: "2. Intellectual Property",
      icon: FiShield,
      content: "All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of our company and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission."
    },
    {
      title: "3. User Responsibilities",
      icon: FiInfo,
      content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must notify us immediately of any breach of security or unauthorized use of your account."
    },
    {
      title: "4. Product Information",
      icon: FiFileText,
      content: "We attempt to be as accurate as possible in describing products. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition."
    },
    {
      title: "5. Limitation of Liability",
      icon: FiAlertCircle,
      content: "We shall not be liable for any damages that result from the use of, or the inability to use, the materials on this site, even if we or an authorized representative has been advised of the possibility of such damages. This includes direct, indirect, incidental, punitive, and consequential damages."
    },
    {
      title: "6. Changes to Terms",
      icon: FiFileText,
      content: "We reserve the right to modify or replace these terms at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new terms. We prefer to provide at least 30 days notice prior to any new terms taking effect."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[350px] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/90"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="font-medium text-white">{page?.title || "Terms & Conditions"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              {page?.title || "Terms & Conditions"}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-20 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 md:p-12 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">

              <div className="mb-12 text-center md:text-left">
                {page ? (
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600">
                    {page.contentType === 'markdown' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {page.content}
                      </ReactMarkdown>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: page.content }} />
                    )}
                    <p className="text-sm text-gray-400 mt-4">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Welcome to our e-commerce platform. By using our website, you agree
                      to comply with and be bound by the following terms and conditions.
                    </p>
                    <p className="text-sm text-gray-400 mt-4">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    {fallbackSections.map((section, idx) => (
                      <div key={idx} className="group hover:bg-gray-50 p-6 rounded-2xl transition-colors duration-300 border border-transparent hover:border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <section.icon className="w-5 h-5" />
                          </div>
                          {section.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed pl-[3.25rem]">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!page && (
                <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                  <p className="text-gray-700 mb-6">
                    If you have any questions about these Terms & Conditions, please contact us.
                  </p>
                  <a href="mailto:support@example.com" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                    Contact Legal Team
                  </a>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <WebFooter />
    </div>
  );
};
