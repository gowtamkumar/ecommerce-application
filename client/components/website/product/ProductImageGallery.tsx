/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import appConfig from "@/appConfig";
import Image from "next/image";

const ProductImageGallery = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(images ? images[0] : null);

  return (
    <div>
      <img
        className="w-full h-64 object-cover rounded-lg mb-4 hover:object-contain"
        src={`${appConfig.apiUrl}/uploads/${selectedImage}`}
        alt="Selected image"
      />
      <div className="flex space-x-2">
        {images?.map((image: any) => (
          <Image
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
