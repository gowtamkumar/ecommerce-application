"use client";
import { selectProduct } from "@/redux/features/products/productSlice";
import { useSelector } from "react-redux";
import { Tabs } from "antd";
import { FileTextOutlined, InfoCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const ProductDescription = () => {
  const products = useSelector(selectProduct);
  const { description, shortDescription } = products.product;

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2 px-2 py-1">
          <FileTextOutlined />
          <span className="text-xs font-black uppercase tracking-widest">Full Description</span>
        </span>
      ),
      children: (
        <div className="py-8 animate-in fade-in duration-700">
           <div
            className="prose max-w-none text-gray-600 leading-relaxed
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-p:mb-6 prose-p:leading-8 prose-p:text-base
              prose-strong:text-gray-900 prose-strong:font-black
              prose-ul:list-disc prose-ul:pl-6
              prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2 px-2 py-1">
          <InfoCircleOutlined />
          <span className="text-xs font-black uppercase tracking-widest">Specifications</span>
        </span>
      ),
      children: (
        <div className="py-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
             {/* Dynamic specifications could go here, for now using description fallback or static info */}
             <div className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Material</span>
                <span className="text-sm font-bold text-gray-900">Premium Cotton Blend</span>
             </div>
             <div className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fitting</span>
                <span className="text-sm font-bold text-gray-900">Regular Fit</span>
             </div>
             <div className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wash Care</span>
                <span className="text-sm font-bold text-gray-900">Machine Wash Cold</span>
             </div>
             <div className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Origin</span>
                <span className="text-sm font-bold text-gray-900">Imported Quality</span>
             </div>
          </div>
          <div className="mt-12 p-8 rounded-3xl bg-gray-50 border border-gray-100 italic text-gray-500 text-sm">
             Note: Product colors may slightly vary due to photographic lighting sources or your monitor settings.
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2 px-2 py-1">
          <QuestionCircleOutlined />
          <span className="text-xs font-black uppercase tracking-widest">Shipping & Returns</span>
        </span>
      ),
      children: (
        <div className="py-8 animate-in fade-in duration-700 space-y-8">
           <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
                 <InfoCircleOutlined />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Standard Delivery</h4>
                 <p className="text-sm text-gray-500 leading-relaxed">Estimated delivery time is 2-5 business days depending on your location within the country. Express shipping options available at checkout.</p>
              </div>
           </div>
           <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 flex items-center justify-center flex-shrink-0">
                 <FileTextOutlined />
              </div>
              <div className="space-y-2">
                 <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">7-Day Easy Returns</h4>
                 <p className="text-sm text-gray-500 leading-relaxed">Not satisfied with your purchase? Return it within 7 days for a full refund or exchange. Item must be in original condition with tags attached.</p>
              </div>
           </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-16 sm:mt-24">
      <Tabs 
        defaultActiveKey="1" 
        items={items} 
        className="premium-tabs"
        size="large"
      />
    </div>
  );
};

export default ProductDescription;
