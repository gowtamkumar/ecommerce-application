// "use client";
import React from "react";
import Sidebar from "./Sidebar";
import { Carousel } from "antd";
import Image from "next/image";

export default function Banner() {
  const contentStyle: React.CSSProperties = {
    height: "400px",
    color: "#fff",
    lineHeight: "400px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <>
      <div className="flex gap-2 items-stretch">
        <div className="w-1/6 self-auto">
          <Sidebar />
        </div>
        <div className="w-5/6 self-auto justify-center items-center border">
          <Carousel arrows autoplay draggable centerMode>
            <div>
              <Image
                width={300}
                height={500}
                className="mx-auto h-full w-auto"
                src="/banner.webp"
                alt="Logo"
              />
            </div>

            <div>
              <Image
                width={600}
                height={500}
                className="mx-auto h-full w-auto"
                src="/banner.webp"
                alt="Logo"
              />
            </div>

            {/* <div>
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <h3 style={contentStyle}>4</h3>
            </div> */}
          </Carousel>
        </div>
      </div>
    </>
  );
}
