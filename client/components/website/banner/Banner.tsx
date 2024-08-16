// "use client";
import React from "react";
import Sidebar from "./Sidebar";
import { Carousel } from "antd";
import { getBanners } from "@/lib/apis/banner";
import Image from "next/image";

export default async function Banner() {
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "350px",
    color: "black",
    lineHeight: "350px",
    textAlign: "center",
    background: "black",
  };
  const banners = await getBanners({ type: "Slider" });
  return (
    <>
      <div className="flex gap-2 items-stretch">
        <div className="w-1/6">
          <Sidebar />
        </div>
        <div className="w-5/6 justify-center items-center border">
          <Carousel arrows autoplay pauseOnDotsHover centerMode adaptiveHeight>
            {banners.data?.map(({ image }: { image: string }) => (
              <div className="clear-both" key={image}>
                <Image
                  style={contentStyle}
                  src={
                    image
                      ? `http://localhost:3900/uploads/${image}`
                      : "/pos_software.png"
                  }
                  alt={image}
                  loading="lazy"
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-full h-auto"
                  // placeholder="blur"
                  // blurDataURL={image}
                  // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
}
