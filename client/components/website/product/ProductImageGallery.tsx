/* eslint-disable @next/next/no-img-element */
// src/components/ProductImageGallery.js
import React, { useState } from 'react';

const ProductImageGallery = ({ images }:any) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <img className="w-full h-64 object-cover rounded-lg mb-4" src={selectedImage} alt="Selected" />
      <div className="flex space-x-2">
        {images.map((image:any, index:number) => (
          <img
            key={index}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${selectedImage === image ? 'border-4 border-blue-500' : ''}`}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
