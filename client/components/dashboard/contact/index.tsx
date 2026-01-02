'use client'
import ContactList from "./ContactList";

const Contact = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Contact Messages
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage messages received from the website contact form.
          </p>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <ContactList />
      </div>
    </div>
  );
};

export default Contact;
