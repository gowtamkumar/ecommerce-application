import React from "react";
import Subscribe from "../footer/Subscribe";

export default function FourWeight() {
  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold uppercase">
        Newsletter Signup{" "}
      </h2>
      <p className="pb-4">
        Subscribe to our newsletter and get 10% off your first purchase
      </p>
      <Subscribe />
    </div>
  );
}
