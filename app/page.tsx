import Banner from "@/components/website/Banner/Banner";
import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/Header";
import React from "react";
export default function Home() {
  return (
    <div className="container mx-auto">
      <Header />
      <Banner />
      Home page
      <WebFooter />
    </div>
  );
}
