import React from "react";

export default function CategorySidebar() {
  return (
    <aside className="shadow-sm p-2 ">
      <h2 className="text-lg font-bold mb-2">Filters</h2>
      <ul className="space-y-2">
        <li className="font-semibold">Promotion & Services</li>
        {[
          "Free Delivery",
          "Hot Deals",
          "Authentic Brands",
          "Daraz Verified",
          "Cash On Delivery",
          "Installment",
        ].map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> {item}
            </label>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-bold mt-4 mb-2">Category</h2>
      <p>Blouses & Shirts</p>
    </aside>
  );
}
