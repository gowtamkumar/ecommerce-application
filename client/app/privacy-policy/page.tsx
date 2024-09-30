import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import React from "react";

const page = () => {
  return (
    <>
      <Header />
      <div className="bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-700 mb-4">
            This privacy policy outlines how our e-commerce platform collects,
            uses, and protects any information that you provide when using our
            services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Information Collection
          </h2>
          <p className="text-gray-700 mb-4">
            We collect the following information: name, contact information,
            email address, payment details, and other relevant information for
            processing orders.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            The information collected is used for internal record keeping,
            processing orders, improving our products and services, and sending
            promotional emails about new products and offers.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Security
          </h2>
          <p className="text-gray-700 mb-4">
            We are committed to ensuring that your information is secure. We
            have implemented suitable physical, electronic, and managerial
            procedures to safeguard and secure the information we collect
            online.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies</h2>
          <p className="text-gray-700 mb-4">
            A cookie is a small file which asks permission to be placed on your
            computers hard drive. Cookies help us analyze web traffic and tailor
            our site to customer needs.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Control
          </h2>
          <p className="text-gray-700 mb-4">
            You may choose to restrict the collection or use of your personal
            information by opting out of receiving promotional communication or
            by contacting us to update or remove your information.
          </p>

          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact
            us at <span className="font-semibold">support@example.com</span>.
          </p>
        </div>
      </div>
      <WebFooter />
    </>
  );
};

export default page;
