import ContactForm from "@/components/website/contact/ContactForm";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import React from "react";

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Need Help?</h1>
        <p className="mt-4 text-lg">We’re here to support you 24/7.</p>
      </div>

      {/* Support Options */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Email Us",
            description: "Get in touch with our support team via email.",
            icon: "📧",
          },
          {
            title: "Call Us",
            description: "Talk to a real person from our support team.",
            icon: "📞",
          },
          {
            title: "Live Chat",
            description: "Chat with us for instant support.",
            icon: "💬",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How do I track my order?",
              a: "You can track your order using the tracking link sent to your email after shipping.",
            },
            {
              q: "Can I return a product?",
              a: "Yes, returns are accepted within 7 days. Please check our return policy.",
            },
            {
              q: "Do you offer customer support on weekends?",
              a: "Yes, we provide 24/7 support including weekends.",
            },
          ].map((item, idx) => (
            <details key={idx} className="bg-white rounded-xl shadow p-4">
              <summary className="font-semibold cursor-pointer">{item.q}</summary>
              <p className="text-gray-600 mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit a Support Request</h2>
        <ContactForm />
      </div>

      <WebFooter />
    </div>
  );
}
