"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { getSettings } from "@/lib/apis/setting";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { selectProduct } from "@/redux/features/products/productSlice";
import { useEffect, useMemo, useState } from "react";
import {
    FiCheckCircle,
    FiFileText,
    FiPackage,
    FiPhoneCall,
    FiRotateCcw,
    FiShield,
} from "react-icons/fi";
import { useSelector } from "react-redux";

interface ProductDescriptionProps {
  product?: any;
  setting?: any;
}

export default function ProductDescription({
  product: propProduct,
  setting: propSetting,
}: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "returns"
  >("description");

  const products = useSelector(selectProduct);
  const product = propProduct || products?.product || {};
  const global = useSelector(selectGlobal);
  const { formatPrice } = useCurrency();

  const hasValidSetting = (s: any) =>
    Boolean(s && (s.id || s.returnSetting || s.helpSupport || s.siteName));

  const [storeSetting, setStoreSetting] = useState<any>(() => {
    if (hasValidSetting(propSetting)) return propSetting;
    if (hasValidSetting(global?.setting)) return global.setting;
    return null;
  });

  useEffect(() => {
    if (hasValidSetting(propSetting)) {
      setStoreSetting(propSetting);
    } else if (hasValidSetting(global?.setting)) {
      setStoreSetting(global.setting);
    } else if (!hasValidSetting(storeSetting)) {
      getSettings()
        .then((res) => {
          if (res?.data) {
            setStoreSetting(res.data);
          }
        })
        .catch(() => {});
    }
  }, [propSetting, global?.setting]);

  const activeSetting = hasValidSetting(storeSetting)
    ? storeSetting
    : hasValidSetting(global?.setting)
      ? global.setting
      : hasValidSetting(propSetting)
        ? propSetting
        : {};

  const helpSupport = activeSetting?.helpSupport || {};
  const returnSetting = activeSetting?.returnSetting || {};
  const freeShipping = activeSetting?.orderFreeShippingAmount;
  const phone = activeSetting?.whatsAppWidget?.phone || activeSetting?.phone;
  const email = activeSetting?.email;

  const {
    id,
    name,
    sku,
    slug,
    description,
    shortDescription,
    brand,
    productCategories,
    productVariants,
    tags,
    tax,
    unit,
    stockQty,
    isReturnable,
    is_returnable,
  } = product || {};

  const categoriesList = (productCategories || [])
    .map((c: any) => c?.category?.name)
    .filter(Boolean)
    .join(", ");

  const availableSizes = useMemo(() => {
    if (!productVariants || !Array.isArray(productVariants)) return [];
    const list: string[] = [];
    productVariants.forEach((v: any) => {
      const sName = v?.size?.name;
      if (sName && !list.includes(sName)) list.push(sName);
    });
    return list;
  }, [productVariants]);

  const availableColors = useMemo(() => {
    if (!productVariants || !Array.isArray(productVariants)) return [];
    const list: string[] = [];
    productVariants.forEach((v: any) => {
      const cName = v?.color?.name;
      if (cName && !list.includes(cName)) list.push(cName);
    });
    return list;
  }, [productVariants]);

  const availableMaterials = useMemo(() => {
    if (!productVariants || !Array.isArray(productVariants)) return [];
    const list: string[] = [];
    productVariants.forEach((v: any) => {
      const mat = v?.material;
      if (mat && !list.includes(mat)) list.push(mat);
    });
    return list;
  }, [productVariants]);

  const effectiveSku =
    sku ||
    productVariants?.find((v: any) => v.sku)?.sku ||
    (id
      ? `SKU-${id.toString().padStart(6, "0")}`
      : slug
        ? slug.slice(0, 12).toUpperCase()
        : null);

  const returnDays = returnSetting?.returnWindowDays || 7;
  const canReturn = isReturnable !== false && is_returnable !== false;

  const parsedTags = useMemo(() => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags
      .split(/[,;\n]/)
      .map((t: string) => t.trim())
      .filter(Boolean);
  }, [tags]);

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
              className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-global-primary hover:bg-global-hover text-white shadow-md shadow-global-primary/25"
                  : "bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-600 border border-slate-200/60"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-white" : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-8">
        {/* TAB 1: PRODUCT OVERVIEW */}
        {activeTab === "description" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {shortDescription && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/50 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                <div className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FiCheckCircle className="text-amber-600" />
                  Short Overview
                </div>
                <div>{shortDescription}</div>
              </div>
            )}

            {description ? (
              <div
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-5 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : !shortDescription ? (
              <p className="text-slate-400 text-sm italic">
                No description provided for this product.
              </p>
            ) : null}
          </div>
        )}

        {/* TAB 2: SPECIFICATIONS */}
        {activeTab === "specifications" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {name && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Product Name
                  </span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[260px]">
                    {name}
                  </span>
                </div>
              )}

              {brand?.name && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Brand
                  </span>
                  <span className="font-black text-slate-900">
                    {brand.name}
                  </span>
                </div>
              )}

              {categoriesList && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Category
                  </span>
                  <span className="font-black text-slate-900 truncate max-w-xs text-right">
                    {categoriesList}
                  </span>
                </div>
              )}

              {effectiveSku && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    SKU Identifier
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {effectiveSku}
                  </span>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Available Sizes
                  </span>
                  <span className="font-bold text-slate-900">
                    {availableSizes.join(", ")}
                  </span>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Available Colors
                  </span>
                  <span className="font-bold text-slate-900">
                    {availableColors.join(", ")}
                  </span>
                </div>
              )}

              {availableMaterials.length > 0 && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Material
                  </span>
                  <span className="font-bold text-slate-900">
                    {availableMaterials.join(", ")}
                  </span>
                </div>
              )}

              {unit?.name && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Packaging Unit
                  </span>
                  <span className="font-bold text-slate-900">{unit.name}</span>
                </div>
              )}

              {stockQty !== undefined && stockQty !== null && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    Availability
                  </span>
                  <span
                    className={`font-bold ${stockQty > 0 ? "text-emerald-700" : "text-rose-600"}`}
                  >
                    {stockQty > 0
                      ? `In Stock (${stockQty} units)`
                      : "Out of Stock"}
                  </span>
                </div>
              )}

              {tax?.name && (
                <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">
                    VAT / Tax
                  </span>
                  <span className="font-bold text-slate-900">
                    {tax.name} ({tax.value}%)
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Return Policy
                </span>
                <span
                  className={`font-bold ${canReturn ? "text-slate-900" : "text-rose-600"}`}
                >
                  {canReturn
                    ? `${returnDays}-Day Easy Returns`
                    : "Non-Returnable Item"}
                </span>
              </div>
            </div>

            {parsedTags.length > 0 && (
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Tags:
                </span>
                {parsedTags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RETURNS & WARRANTY */}
        {activeTab === "returns" && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Return Policy Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <FiRotateCcw className="text-amber-500 w-4 h-4 shrink-0" />
                  <span>
                    {canReturn
                      ? helpSupport?.returnSupport ||
                        `${returnDays}-Day Returns`
                      : "Non-Returnable Product"}
                  </span>
                </div>

                {canReturn ? (
                  helpSupport?.returnSupportDesc ? (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {helpSupport.returnSupportDesc}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Returns are accepted within {returnDays} days of delivery.
                    </p>
                  )
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This item is non-returnable.
                  </p>
                )}

                {canReturn && returnSetting?.predefinedReasons?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Return Conditions:
                    </p>
                    <ul className="space-y-1">
                      {returnSetting.predefinedReasons.map(
                        (reason: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-center gap-1.5 text-xs text-slate-600"
                          >
                            <FiCheckCircle className="text-emerald-500 w-3 h-3 shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* Guarantee / Authenticity Card */}
              {(helpSupport?.originalProduct ||
                helpSupport?.guarantee ||
                helpSupport?.originalProductDesc ||
                helpSupport?.guaranteeDesc) && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <FiShield className="text-indigo-500 w-4 h-4 shrink-0" />
                    <span>
                      {helpSupport.originalProduct || helpSupport.guarantee}
                    </span>
                  </div>
                  {(helpSupport.originalProductDesc ||
                    helpSupport.guaranteeDesc) && (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {helpSupport.originalProductDesc ||
                        helpSupport.guaranteeDesc}
                    </p>
                  )}
                </div>
              )}

              {/* Store Support Contact */}
              {(phone || email) && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <FiPhoneCall className="text-amber-500 w-4 h-4 shrink-0" />
                    <span>Customer Support</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    {phone && <p>Phone / WhatsApp: {phone}</p>}
                    {email && <p>Email: {email}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
