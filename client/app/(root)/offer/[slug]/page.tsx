import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import React from "react";

export default function Offer({ params }: { params: { slug: string } }) {
  const { slug } = params;
  console.log("slug", slug);
  return (
    <>
      <Header />
      <section className="container mx-auto lg:py-5 px-3">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <h1>kkk</h1>
          </div>
        </div>
      </section>
      <WebFooter />
    </>
  );
}
