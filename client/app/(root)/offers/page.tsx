import appConfig from "@/appConfig";
import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import ScrollToCart from "@/components/website/ScrollToCart";
import { getDiscounts } from "@/lib/apis/discount";
import Link from "next/link";
import React from "react";

export default async function Offers() {
  const offers = await getDiscounts({
    scope: "Global,Products,Brand,Category",
  });

  return (
    <>
      <Header />
      <div>
        {offers.data.length > 0 && (
          <section className="container mx-auto grid md:grid-cols-4 gap-8 py-3">
            {offers.data.map((item: any, index: number) => (
              <Link className="bottom-auto" href={`/offers/${item.slug}`}>
                <div
                  key={index}
                  className="bg-cover  bg-center rounded-lg h-56 flex flex-col justify-center items-start text-white p-4 text-start"
                  style={{
                    backgroundImage: `url(${appConfig.baseApiUrl}/uploads/${item.image})`,
                  }}
                >
                  {/* <h3 className="text-xl font-bold text-black">{item.title}</h3>
                  <p className="text-sm mb-2 text-black">{item.description}</p>
                  <Link className="bottom-auto" href={`/offers/${item.slug}`}>
                    <Button type="primary">Visite</Button>
                  </Link> */}
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>

      <ScrollToCart />
      <WebFooter />
    </>
  );
}
