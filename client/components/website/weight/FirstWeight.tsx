import Image from "next/image";
import React from "react";

export default function FirstWeight({ data }: any) {
  return (
    <div className="leading-relaxed">
      <Image
        src={
          data.image
            ? `http://localhost:3900/uploads/${data.image}`
            : "/pos_software.png"
        }
        alt={data.image}
        loading="lazy"
        width="0"
        height="0"
        sizes="100vw"
        className="w-[10vh] h-[10vh]"
      />
      <p>{data.address}</p>
      <p>Mobile: {data.phone}</p>
      <p>E-mail: {data.email}</p>
    </div>
  );
}
