"use client";

import { useState } from "react";
import { FiCheck, FiInfo } from "react-icons/fi";

interface LandingSizeGuideProps {
  sizes?: any[];
  selectedSize?: string;
  onSelectSize?: (sizeName: string) => void;
}

export default function LandingSizeGuide({
  sizes = [],
  selectedSize,
  onSelectSize,
}: LandingSizeGuideProps) {
  // Standard BD clothing measurements
  const measurementTable = [
    { size: "M", chest: '38"-40"', length: '28"', shoulder: '17.5"' },
    { size: "L", chest: '40"-42"', length: '29"', shoulder: '18.5"' },
    { size: "XL", chest: '42"-44"', length: '30"', shoulder: '19.5"' },
    { size: "XXL", chest: '44"-46"', length: '31"', shoulder: '20.5"' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest font-black text-global-primary">
            মাপের চার্ট
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            সাইজ গাইড (Size Measurement Guide)
          </h2>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiInfo className="text-global-primary" /> পরিমাপগুলো ইঞ্চিতে (Inches) দেওয়া হলো
        </p>
      </div>

      {/* Measurement Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-gray-900 text-white text-[11px] sm:text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">সাইজ (Size)</th>
              <th className="py-3 px-4">বুকের মাপ (Chest)</th>
              <th className="py-3 px-4">দৈর্ঘ্য (Length)</th>
              <th className="py-3 px-4">কাঁধ (Shoulder)</th>
              <th className="py-3 px-4 text-center">নির্বাচন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {measurementTable.map((item, idx) => {
              const isSelected = selectedSize?.toUpperCase() === item.size;
              return (
                <tr
                  key={idx}
                  onClick={() => onSelectSize?.(item.size)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-global-primary/10 font-bold text-gray-950"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <td className="py-3.5 px-4 font-black">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200">
                      {item.size}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{item.chest}</td>
                  <td className="py-3.5 px-4">{item.length}</td>
                  <td className="py-3.5 px-4">{item.shoulder}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-global-primary text-white shadow-xs"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isSelected ? "সিলেক্টেড ✓" : "সিলেক্ট করুন"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
        <FiInfo className="text-amber-600 text-base shrink-0 mt-0.5" />
        <span>
          <strong>পরামর্শ:</strong> আপনি রেগুলার যে সাইজ পরেন, সেই সাইজটি বেছে নিন। কোনো কনফিউশন থাকলে অর্ডার করার পর আমাদের প্রতিনিধি আপনাকে কল করে সাইজ নিশ্চিত করবেন।
        </span>
      </div>
    </div>
  );
}
