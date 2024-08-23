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
                  width={0}
                  height={0}
                  src="/pos_software.png"
                  alt="Category Image"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", padding: "15px" }}
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
