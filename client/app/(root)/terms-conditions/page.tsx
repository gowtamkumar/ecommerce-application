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
            Terms & Conditions
          </h1>
          <p className="text-gray-700 mb-4">
            Welcome to our e-commerce platform. By using our website, you agree
            to comply with and be bound by the following terms and conditions.
            Please review these terms carefully before using our services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            By accessing our platform, you agree to all terms outlined in this
            document. If you do not agree with any of these terms, you are
            prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Intellectual Property
          </h2>
          <p className="text-gray-700 mb-4">
            All content on this website, including but not limited to text,
            graphics, logos, images, and software, is the property of our
            company and is protected by copyright and trademark laws.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your computer.
            You agree to accept responsibility for all activities that occur
            under your account or password.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Product Information
          </h2>
          <p className="text-gray-700 mb-4">
            We attempt to be as accurate as possible in describing products.
            However, we do not warrant that product descriptions or other
            content is accurate, complete, reliable, current, or error-free.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            We shall not be liable for any damages that result from the use of,
            or the inability to use, the materials on this site, even if we or
            an authorized representative has been advised of the possibility of
            such damages.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify or replace these terms at any time.
            Your continued use of the platform after any such changes
            constitutes your acceptance of the new terms.
          </p>

          <p className="text-gray-700">
            If you have any questions about these Terms & Conditions, please
            contact us at{" "}
            <span className="font-semibold">support@example.com</span>.
          </p>
        </div>
      </div>
      <WebFooter />
    </>
  );
};

export default page;
