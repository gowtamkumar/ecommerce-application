import React from "react";
import Category from "./Category";
import AntCarousel from "./Carousel";


export default function Banner() {
  return (
    <>
      <div className="flex">
        <div className="w-1/6">
          <Category />
        </div>
        <div className="w-5/6  justify-center items-center ">
          <AntCarousel />
        </div>
      </div>
    </>
  );
}
