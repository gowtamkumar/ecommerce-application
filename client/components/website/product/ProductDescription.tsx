"use client";

import { selectProduct } from "@/redux/features/products/productSlice";
import { useState } from "react";
import {
    FiCheckCircle,
    FiFileText,
    FiHelpCircle,
    FiPackage,
    FiRotateCcw,
    FiShield,
    FiTruck,
} from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ProductDescription() {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping" | "returns"
  >("description");

  const products = useSelector(selectProduct);
  const { description, shortDescription, brand, productCategories, slug } =
    products?.product || {};

  const categoriesList = (productCategories || [])
    .map((c: any) => c?.category?.name)
    .filter(Boolean)
    .join(", ");

  const TABS = [
    {
      id: "description",
      label: "Product Overview",
      icon: FiFileText,
    },
    {
      id: "specifications",
      label: "Specifications",
      icon: FiPackage,
    },
    {
      id: "shipping",
      label: "Shipping & Delivery",
      icon: FiTruck,
    },
    {
      id: "returns",
      label: "Returns & Warranty",
      icon: FiRotateCcw,
    },
  ];

  return (
    <div className="mt-16 sm:mt-24 p-6 sm:p-10 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50">
      {/* Segmented Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-100 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 font-black"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-amber-400" : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-8">
        {activeTab === "description" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {description ? (
              <div
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-5"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : shortDescription ? (
              <div
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : (
              <p className="text-slate-500 text-sm leading-relaxed">
                Experience premium comfort and craftsmanship with this genuine product. Designed with attention to detail and durable materials suited for daily wear and modern lifestyles.
              </p>
            )}

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Premium Soft Touch
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Breathable, hypoallergenic fabrics engineered for skin sensitivity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Reinforced Stitching
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    High-stress seam reinforcement ensures shape retention wash after wash.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Easy Wash Care
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Colorfast dye technology resists fading over continuous laundering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Brand
                </span>
                <span className="font-black text-slate-900">
                  {brand?.name || "Certified Official"}
                </span>
              </div>

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Category
                </span>
                <span className="font-black text-slate-900 truncate max-w-xs text-right">
                  {categoriesList || "Store Collection"}
                </span>
              </div>

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Material
                </span>
                <span className="font-black text-slate-900">
                  100% Breathable Combed Cotton
                </span>
              </div>

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Fit Type
                </span>
                <span className="font-black text-slate-900">
                  Relaxed Comfort Fit
                </span>
              </div>

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  SKU Identifier
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {slug?.slice(0, 12).toUpperCase() || "SKU-STD-01"}
                </span>
              </div>

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Origin
                </span>
                <span className="font-black text-slate-900">
                  Ethically Sourced & Manufactured
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Note: Minor measurement variations of 0.5-1 cm may occur due to hand-tailoring and production tolerances.
            </p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <FiTruck className="text-amber-500 w-4 h-4" />
                  <span>Standard Delivery (2–5 Business Days)</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Complimentary on all orders exceeding \$99. Fast regional carrier dispatch with real-time tracking code sent via SMS and email immediately upon handover.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <FiShield className="text-amber-500 w-4 h-4" />
                  <span>Insured Express Shipping (24–48 Hours)</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Priority fulfillment available at checkout with comprehensive parcel insurance covering damage or loss in transit.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "returns" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <FiRotateCcw className="text-amber-500 w-4 h-4" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Initiate a return online with zero hassle within 30 calendar days of delivery. Prepaid return courier pick-up provided directly from your shipping address.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <FiHelpCircle className="text-amber-500 w-4 h-4" />
                  <span>Authenticity & Quality Guarantee</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every garment undergoes double quality control inspection prior to packaging. In the rare event of a manufacturing defect, enjoy an instant replacement or 100% refund.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
