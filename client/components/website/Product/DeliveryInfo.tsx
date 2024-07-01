// src/components/DeliveryInfo.js
import { Divider } from "antd";
import React from "react";

const DeliveryInfo = ({ delivery }: any) => {
  return (
    <div className="bg-gray-50 p-4">
      <h2 className="text-sm text-gray-600 font-semibold ">Delivery</h2>
      <div className="text-gray-700 flex justify-between items-center">
        <span className="text-sm"> Khulna, Jashore, Jashore - Noapara</span>{" "}
        <button className="mt-2 text-blue-600">Change</button>
      </div>
      <hr />
      <span className="text-gray-700 text-sm">
        Shipping Cost: ৳ {delivery.price}
      </span>
    </div>
  );
};

export default DeliveryInfo;
