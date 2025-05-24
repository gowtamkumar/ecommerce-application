"use client";
import appConfig from "@/appConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Caregory({ categories }: any) {
  const router = useRouter();
  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-6 gap-2 items-center justify-center ">
        {(categories || []).map((item: any) => {
          return (
            <div
            key={item.id}
              className="py-5 flex flex-col items-center gap-2 justify-center bg-gray-100 cursor-pointer rounded-lg"
              onClick={() => {
                router.push(`/products?categoryId=${item.id}&`);
              }}
            >
              <Image
                alt={item.name || "image"}
                src={`${appConfig.baseApiUrl}/uploads/${item.image}`}
                loading="lazy"
                width={70}
                height={70}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <p className="hover:underline mt-1">{item.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
