// "use client";
import React from "react";
import { Button } from "antd";
import Link from "next/link";

const SellerAds = () => {
  return (
    <div className="container mx-auto grid min-h-[40vh] grid-cols-12 items-center gap-5">
      <div className="col-span-12 lg:col-span-6 lg:text-start text-center">
        <h1 className="text-4xl font-bold">Sell your Proudct</h1>
        <p className="my-3 text-xl font-medium">
          Easily create an advert for your Proudct and reach millions of
          potential buyers per month
        </p>
        <Button size="large" type="primary">
          <Link href="/products"> Shop Now</Link>
        </Button>
      </div>
      <div className="col-span-12 overflow-hidden  lg:col-span-6">
        <div className="flex h-[40vh] w-auto items-center rounded-full bg-red-300/5 ">
          <img src="/image-box-12.jpg" className="h-auto w-full" alt="" />
        </div>
      </div>
    </div>
  );
};

export default SellerAds;
