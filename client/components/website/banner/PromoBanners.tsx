"use client";
import React from "react";
import Link from "next/link";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import appConfig from "@/appConfig";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

export default function PromoBanners({ banners }: { banners: any[] }) {
  if (!banners?.length) return null;

  return (
    <section className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {banners.map((item: any, index: number) => (
          <div
            key={index}
            className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url(${getUploadImageUrl(item.image)})`,
              }}
            />

            {/* Dark Gradient Overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Glassmorphic Content Panel */}
            <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl overflow-hidden relative">
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
                
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                  {item.title}
                </h3>
                
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-gray-100 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
                      {item.description}
                    </p>
                    
                    <Link href={`/offers${item.url}`} className="inline-block w-full">
                      <Button 
                        block
                        size="large"
                        className="!bg-white !text-black !border-none !font-medium !h-12 !rounded-xl flex items-center justify-center gap-2 hover:!bg-gray-100 transition-colors duration-300 shadow-md"
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
    </section>
  );
}
