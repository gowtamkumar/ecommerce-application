// "use client";
import React from "react";
import Sidebar from "../header/Menu";
import { Button, Carousel } from "antd";
import { getBanners } from "@/lib/apis/banner";
import Image from "next/image";
import Link from "next/link";

export default async function Banner() {
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "600px",
    color: "black",
    backgroundColor: "red",
    lineHeight: "400px",
    textAlign: "center",
    background: "black",
  };
  const banners = await getBanners({ type: "Slider" });
  return (
    <div className="mx-auto">
      <Carousel
        arrows
        dotPosition="bottom"
        autoplay
        effect="fade"
        easing="linear"
      >
        {banners.data?.map(
          ({
            image,
            title,
            description,
            url,
          }: {
            image: string;
            title: string;
            description: string;
            url: string;
          }) => (
            <div className="clear-both " key={image}>
              <div className="relative  font-mono">
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
                />
                <div className="absolute p-10 flex items-center bottom-0 left-0 top-0 bg-local w-1/3 backdrop-blur-sm bg-white/5 ">
                  <div>
                    <h1 className="text-4xl">{title}</h1>
                    <p className="my-4">{description}</p>
                    <Button size="large" type="primary">
                      <Link href={`${url ? url : "/shop"}`}> Shop Now</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* <Image
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
            /> */}
            </div>
          )
        )}
      </Carousel>
    </div>
  );
}
