"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";


import SyncGeoLocation from "./SyncGeoLocation";
import { useRouter, useSearchParams } from "next/navigation";
import StockAdjust from "./stock-adjust/StockAdjust";

const Size = dynamic(() => import("@/app/dashboard/size/page"), {
  ssr: false,
});
const Unit = dynamic(() => import("@/app/dashboard/unit/page"), {
  ssr: false,
});
const Tax = dynamic(() => import("@/app/dashboard/taxs/page"), {
  ssr: false,
});
const Color = dynamic(() => import("@/app/dashboard/color/page"), {
  ssr: false,
});
const Banner = dynamic(() => import("@/app/dashboard/banner/page"), {
  ssr: false,
});
const Review = dynamic(() => import("@/app/dashboard/review/page"), {
  ssr: false,
});
const Lead = dynamic(() => import("./lead/Lead"), { ssr: false });

export default function Index() {
  const [tabKey, setTabKey] = useState<any>("sizes");
  const route = useRouter();
  const params = useSearchParams();

  return (
    <Tabs
      tabPosition="left"
      defaultValue={tabKey}
      activeKey={tabKey}
      onChange={(key) => {
        setTabKey(key);
        route.push(`/dashboard/setting?tab=${key}`);
      }}
      type="card"
      items={[
        {
          label: "Sizes",
          key: "sizes",
          children: <Size />,
        },
        {
          label: "Units",
          key: "units",
          children: <Unit />,
        },
        {
          label: "Taxs",
          key: "taxs",
          children: <Tax />,
        },

        {
          label: "Colors",
          key: "colors",
          children: <Color />,
        },
        {
          label: "Banner",
          key: "banners",
          children: <Banner />,
        },
        {
          label: "Reviews",
          key: "reviews",
          children: <Review />,
        },
        // {
        //   label: "Status",
        //   key: "status",
        //   children: <Status />,
        // },
        // {
        //   label: "Post",
        //   key: "post",
        //   children: <Post />,
        // },
        {
          label: "Leads",
          key: "leads",
          children: <Lead />,
        },
        {
          label: "Stock Adjust",
          key: "stock_adjust",
          children: <StockAdjust />,
        },
        {
          label: "Sync Geo locaton",
          key: "geo_locations",
          children: <SyncGeoLocation />,
        },
      ]}
    />
  );
}
