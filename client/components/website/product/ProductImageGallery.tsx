/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import appConfig from "@/appConfig";
import ImageN from "next/image";
import { Image } from "antd";

const ProductImageGallery = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(images ? images[0] : null);

  return (
    <div>
      <Image
        className="w-full object-cover rounded-lg mb-4"
        src={`${appConfig.apiUrl}/uploads/${selectedImage}`}
        alt={selectedImage}
      />
      <div className="flex space-x-2">
        {images?.map((image: any) => (
          <ImageN
            src={
              image
                ? `${appConfig.apiUrl}/uploads/${image}`
                : "/pos_software.png"
            }
            key={image}
            width={100}
            height={100}
            className={`w-14 h-14 object-cover rounded-lg cursor-pointer ${
              selectedImage === image ? "border-4 border-blue-500" : ""
            }`}
            alt={image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
