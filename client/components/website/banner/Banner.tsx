// // "use client";
// import React from "react";
// import Sidebar from "../header/Menu";
// import { Button, Carousel } from "antd";
// import { getBanners } from "@/lib/apis/banner";
// import Image from "next/image";
// import Link from "next/link";
// import Slider from "./Slider";

// export default async function Banner() {
//   const contentStyle: React.CSSProperties = {
//     margin: 0,
//     height: "600px",
//     color: "black",
//     backgroundColor: "red",
//     lineHeight: "400px",
//     textAlign: "center",
//     background: "black",
//   };
//   const banners = await getBanners({ type: "Slider" });
//   return (
//     <div className="mx-auto">
//       <Slider banners={banners} />
//     </div>
//   );
// }
