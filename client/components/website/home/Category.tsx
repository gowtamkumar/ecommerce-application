import { getAllCategories } from "@/lib/apis/categories";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Category() {
  const categories = await getAllCategories();
  return (
    <section className="py-6">
      <h3 className="text-2xl font-semibold mb-4">All Category</h3>
      <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-8">
        {categories?.data.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className="border mx-auto text-center hover:shadow-xl cursor-pointer p-3"
            >
              <Link href={`category/${idx}`}>
                <Image
                  width={0}
                  height={0}
                  src="/pos_software.png"
                  alt="Category Image"
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", padding: "15px" }}
                />
                <p>{item.name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
