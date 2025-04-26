'use client';
import React from "react";


const TotalOrderSummaryDashboard = () => {
 
  return (
    <>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Order Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Orders:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Total Orders</span>
              <span>4000:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Products Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span>222</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Products:</span>
              <span>11</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Products:</span>
              <span>10:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Amount Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Amount:</span>
              <span>4000:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Payment Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>COD Order Amount::</span>
              <span>90000</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Order Amount:</span>
              <span>10000</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 my-2">
        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            TOTAL Sale Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Sale</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Sale:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Total Sale</span>
              <span>4000:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Products Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span>222</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Products:</span>
              <span>11</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Products:</span>
              <span>10:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Amount Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Amount:</span>
              <span>4000</span>
            </div>
            <div className="flex justify-between">
              <span>Actual Amount:</span>
              <span>4000:</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full">
          <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
            Total Payment Summary
            <span>🛒</span>
          </h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>COD Order Amount::</span>
              <span>90000</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Order Amount:</span>
              <span>10000</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalOrderSummaryDashboard;
