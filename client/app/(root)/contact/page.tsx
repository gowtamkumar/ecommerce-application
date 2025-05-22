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
      <section className="bg-[#F6F6F6]">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600">
            Share your query and ideas with us!
          </p>
        </div>
      </section>

      <div className="w-8/12 mx-auto p-10 grid grid-cols-2 items-center justify-between gap-9">
        <ContactForm />
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117394.87566535539!2d89.06877404914009!3d23.148661981544205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff3d0ce09471fb%3A0xaec2fc842533fbab!2sGowtam%20kumar!5e0!3m2!1sen!2sbd!4v1725337541456!5m2!1sen!2sbd"
            width="600"
            height="450"
            className="border-0"
            // allowfullscreen=""
            loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <WebFooter />
    </>
  );
}
