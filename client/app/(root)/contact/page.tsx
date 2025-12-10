import { Metadata } from "next";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const ContactForm = dynamic(
  () => import("@/components/website/contact/ContactForm")
);

export const metadata: Metadata = {
  title: "Contact Us",
  description: "...",
};

export default function page() {
  return (
    <>
      <Header />
      <section className="bg-white py-20 lg:py-28 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 -z-10" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <span className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-4 block font-global-secondary-fontfamily">
            Get in touch
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6 font-global-primary-fontfamily tracking-tight">
            Let's Start a Conversation
          </h1>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed font-global-secondary-fontfamily">
            Have a question or proposal? We'd love to hear from you. Fill out the form below and we'll be in touch shortly.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 pb-20 lg:pb-32 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 p-8 lg:p-16">
            <h3 className="text-2xl font-bold mb-8 font-global-primary-fontfamily">Send a Message</h3>
            <ContactForm />
          </div>

          {/* Map/Info Section */}
          <div className="w-full lg:w-1/2 bg-gray-50 relative min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117394.87566535539!2d89.06877404914009!3d23.148661981544205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff3d0ce09471fb%3A0xaec2fc842533fbab!2sGowtam%20kumar!5e0!3m2!1sen!2sbd!4v1725337541456!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              className="border-0 w-full h-full absolute inset-0 opacity-80 hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <WebFooter />
    </>
  );
}
