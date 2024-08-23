"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function SmallCard({ categories }: any) {
  const router = useRouter();

  return (
    <div className="py-6">
      <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-8">
        {(categories?.data || []).map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className="border mx-auto text-center hover:shadow-xl cursor-pointer p-3"
            >
              <div
                // href={`category/${idx}`}
                onClick={() => {
                  router.push(`/products?categoryId=${item.id}&`);
                }}
              >
                <Image
                  src={
                    item.image
                      ? `http://localhost:3900/uploads/${item.image}`
                      : "/pos_software.png"
                  }
                  alt={item.image}
                  loading="lazy"
                  // fill
                  width={100}
                  height={100}
                  // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <p>{item.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
