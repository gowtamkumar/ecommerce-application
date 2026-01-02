import { getPageBySlug } from "@/lib/apis/page";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FiTruck, FiMapPin, FiGlobe, FiPackage, FiClock, FiAlertCircle } from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



export const metadata: Metadata = {
  title: "Shipping Policy | Ecommerce",
  description: "Read our shipping policy and delivery information.",
};

export default async function ShippingPolicyPage() {
  const pageRes = await getPageBySlug('shipping-policy');
  const page = pageRes?.data;

  // Fallback content if no dynamic page is found
  const fallbackContent = (
    <div className="space-y-12">
      {/* Introduction */}
      <section>
        <p className="text-gray-600 leading-relaxed text-lg">
          We are committed to delivering your order accurately, in good condition, and always on time. 
          Please review our shipping policy below to understand our shipping practices.
        </p>
      </section>

      {/* Shipping Processing */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Shipment Processing Time
        </h2>
        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex gap-4 items-start">
            <div className="mt-1 bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                <FiClock className="w-5 h-5" />
            </div>
            <div>
                <p className="text-gray-700 leading-relaxed mb-2 font-medium">
                    All orders are processed within 1-2 business days.
                </p>
                <p className="text-gray-600 text-sm">
                    Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, 
                    shipments may be delayed by a few days. Please allow additional days in transit for delivery. 
                    If there will be a significant delay in shipment of your order, we will contact you via email or telephone.
                </p>
            </div>
        </div>
      </section>

      {/* Shipping Rates & Delivery Estimates */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          Shipping Rates & Delivery Estimates
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="p-4">Shipping Method</th>
                            <th className="p-4">Estimated Delivery Time</th>
                            <th className="p-4">Shipment Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600 text-sm">
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">Standard Shipping</td>
                            <td className="p-4">3-5 business days</td>
                            <td className="p-4">Free</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">Expedited Shipping</td>
                            <td className="p-4">2-3 business days</td>
                            <td className="p-4">$12.95</td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 font-medium text-gray-900">Overnight Shipping</td>
                            <td className="p-4">1-2 business days</td>
                            <td className="p-4">$25.95</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-gray-50/50 text-xs text-gray-500 border-t border-gray-100 flex items-start gap-2">
                <FiAlertCircle className="w-4 h-4 mt-0.5" />
                <p>Delivery delays can occasionally occur.</p>
            </div>
        </div>
      </section>

      {/* International Shipping */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
          International Shipping Policy
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                 <FiGlobe className="w-5 h-5" />
               </div>
               <h3 className="font-semibold text-gray-900 mb-2">We Ship Worldwide</h3>
               <p className="text-sm text-gray-600 leading-relaxed">
                   We currently ship to over 100 countries worldwide. Shipping rates and fees may vary depending on the delivery address for your order.
               </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                 <FiPackage className="w-5 h-5" />
               </div>
               <h3 className="font-semibold text-gray-900 mb-2">Customs, Duties & Taxes</h3>
               <p className="text-sm text-gray-600 leading-relaxed">
                   Ecommerce is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
               </p>
            </div>
        </div>
      </section>

       {/* Tracking */}
       <section>
        <div className="bg-gray-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  <FiMapPin /> Track your order
              </h3>
              <p className="text-gray-400">
                Once your order ships, you will receive an email containing your tracking number(s).
              </p>
          </div>
          <a href="/profile?tab=track_order" className="whitespace-nowrap bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30">
            Track Order
          </a>
        </div>
      </section>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[350px] flex items-center justify-center overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50/90"></div>
          </div>

          {/* Animated Blobs */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="font-medium text-white">{page?.title || "Shipping Policy"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight animate-in slide-in-from-bottom-6 fade-in duration-700 delay-100">
              {page?.title || "Shipping Policy"}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-20 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 md:p-12 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiTruck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Information</h2>
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
    </div>
  );
};
