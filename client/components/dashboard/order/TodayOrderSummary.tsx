'use client';
import React from "react";


const TodayOrderSummaryDashboard = () => {
  const cards = [
    {
      title: "Today Orders Summary",
      data: [
        { label: "Total Orders:", value: "0", valueColor: "text-black" },
        { label: "Cancelled Orders:", value: "0", valueColor: "text-red-500" },
        { label: "Actual Orders:", value: "0", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Today Amount Summary",
      data: [
        { label: "Total Amount:", value: "৳0", valueColor: "text-black" },
        { label: "Cancelled Amount:", value: "৳0", valueColor: "text-red-500" },
        { label: "Actual Amount:", value: "৳0", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Today Products Summary",
      data: [
        { label: "Total Products:", value: "0", valueColor: "text-black" },
        { label: "Cancelled Products:", value: "0", valueColor: "text-red-500" },
        { label: "Actual Products:", value: "0", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Today Payment Summary",
      data: [
        { label: "COD Order Amount:", value: "৳0", valueColor: "text-black" },
        { label: "SSL Order Amount:", value: "৳0", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Total Orders Summary",
      data: [
        { label: "Total Orders:", value: "44365", valueColor: "text-black" },
        { label: "Canceled Orders:", value: "168", valueColor: "text-red-500" },
        { label: "Actual Orders:", value: "44197", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Total Amount Summary",
      data: [
        { label: "Total Amount:", value: "৳77391624.08", valueColor: "text-black" },
        { label: "Cancel Amount:", value: "৳2610867.64", valueColor: "text-red-500" },
        { label: "Actual Amount:", value: "৳74780756.44", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Total Products Summary",
      data: [
        { label: "Total Products:", value: "74047", valueColor: "text-black" },
        { label: "Cancel Products:", value: "2013", valueColor: "text-red-500" },
        { label: "Actual Products:", value: "72034", valueColor: "text-green-500" },
      ],
    },
    {
      title: "Total Payment Summary",
      data: [
        { label: "COD Order Amount:", value: "৳68634797.26", valueColor: "text-black" },
        { label: "SSL Order Amount:", value: "৳2026983.54", valueColor: "text-green-500" },
      ],
    },
  ];


const SummaryCard = ({ title, data, color = "text-black" }: any) => (
  <div className="bg-white rounded-2xl shadow p-4 w-full md:w-[23%]">
    <h2 className="font-semibold text-lg mb-2 flex items-center justify-between">
      {title}
      <span>🛒</span>
    </h2>
    <div className="space-y-1 text-sm">
      {data.map(({ label, value, valueColor }: any, i: number) => (
        <div key={i} className="flex justify-between">
          <span>{label}</span>
          <span className={valueColor}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Today's Order</h1>
      <div className="flex flex-wrap gap-4">
        {cards.map((card, idx) => (
          <SummaryCard key={idx} {...card} />
        ))}
      </div>
    </div>
  );
};

export default TodayOrderSummaryDashboard;
