import appConfig from '@/config'
import Image from 'next/image'
import React from 'react'

export default function TestImage({ image }: { image: string }) {
  console.log("appConfig", appConfig);
  
  return (
    <Image
      src={
        image
          ? `${appConfig.apiBaseUrl}/uploads/${image}`
          : "/pos_software.png"
      }
      width={100}
      height={100}
      // src="/pos_software.png"
      alt="Product"
      className="w-24 h-24 object-cover"
    />
  )
}
