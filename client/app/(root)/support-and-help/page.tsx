import ContactForm from "@/components/website/contact/ContactForm";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { getPageBySlug } from "@/lib/apis/page";
import { Metadata } from "next";
import Link from "next/link";
import { FiChevronDown, FiHelpCircle, FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata: Metadata = {
  title: "Support & Help | Ecommerce",
  description: "Get assistance, view FAQs, or contact our 24/7 support team.",
};

export default async function Support() {
  const pageRes = await getPageBySlug('support-and-help');
  const page = pageRes?.data;

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get in touch with our team via email.",
      icon: FiMail,
      action: "mailto:support@example.com",
      actionText: "Send Email"
    },
    {
      title: "Phone Support",
      description: "Talk to a real person 24/7.",
      icon: FiPhone,
      action: "tel:+1234567890",
      actionText: "Call Now"
    },
    {
      title: "Live Chat",
      description: "Chat with us for instant support.",
      icon: FiMessageCircle,
      action: "#",
      actionText: "Start Chat"
    },
  ];

  const faqs = [
    {
      q: "How do I track my order?",
      a: "You can track your order using the tracking link sent to your email after shipping. You can also view it in your dashboard under Orders."
    },
    {
      q: "Can I return a product?",
      a: "Yes, returns are accepted within 7 days of delivery. Please ensure the product is unused and in original packaging. Check our return policy for more details."
    },
    {
      q: "Do you offer customer support on weekends?",
      a: "Yes, we provide 24/7 support including weekends and holidays to ensure you have the best shopping experience."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and various secure payment gateways to make your checkout process smooth."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/90"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="font-medium text-white">{page?.title || "Support & Help"}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              {page ? page.title : "How can we help you?"}
            </h1>

            <div className="text-xl text-blue-100 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
              {page ? (
                <div className="prose prose-invert max-w-none">
                  {page.contentType === 'markdown' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {page.content}
                    </ReactMarkdown>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: page.content }} />
                  )}
                </div>
              ) : (
                "Our support team is available 24/7 to assist you with any questions or issues."
              )}
            </div>
          </div>
        </section>

        {/* Support Options Cards */}
        <section className="relative z-20 -mt-24 pb-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((item, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6 min-h-[3rem]">{item.description}</p>
                  <a href={item.action} className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                    {item.actionText}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Quick answers to common questions about our services.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((item, idx) => (
                <details key={idx} className="group bg-white rounded-2xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden overflow-hidden transition-all duration-300 open:shadow-md">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                    {item.q}
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-open:bg-indigo-50 group-open:text-indigo-600 transition-colors">
                      <FiChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed border-t border-transparent group-open:border-gray-50 animate-in slide-in-from-top-2 fade-in duration-300">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gray-100/50 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <FiHelpCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>

      </main>

      <WebFooter />
    </div>
  );
}
