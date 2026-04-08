"use client";
import Link from "next/link";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

export default function PromoBanners({ banners }: { banners: any[] }) {
  if (!banners?.length) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {banners.map((item: any, index: number) => (
          <div
            key={index}
            className="group relative h-[380px] lg:h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url(${getUploadImageUrl(item.image)})`,
              }}
            />

            {/* Dark Gradient Overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Glassmorphic Content Panel */}
            <div className="absolute bottom-5 left-5 right-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl overflow-hidden relative">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-sm tracking-tight">
                  {item.title}
                </h3>
                
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 font-medium leading-relaxed">
                      {item.description}
                    </p>
                    
                    <Link href={item.url ? `/offers${item.url}` : "/products"} className="inline-block w-full">
                      <Button 
                        block
                        size="large"
                        className="!font-bold !h-12 !bg-global-primary !text-white !border-none flex items-center justify-center gap-2 hover:!bg-opacity-90 transition-all rounded-lg"
                      >
                        Shop Now <ArrowRightOutlined className="text-xs transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
