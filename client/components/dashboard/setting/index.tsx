"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import {
  selectGlobal,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";

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
  // const [currencies, setCurrencies] = useState([] as any);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab");

  // useEffect(() => {
  //   let isMounted = true;
  //   setTabKey(tab);
  //   // const fetchSettings = async () => {
  //   //   try {
  //   //     const setting = await getSettings();

  //   //     // const currency = await getCurrencies();
  //   //     if (isMounted) {
  //   //       const data = setting?.data;
  //   //       const newfile = {
  //   //         uid: Math.random() * 1000 + "",
  //   //         name: `logo ${Math.random() * 10000 + ""}`,
  //   //         status: "done",
  //   //         fileName: data.image,
  //   //         url: `${appConfig.baseApiUrl}/uploads/${
  //   //           data.image || "no-data.png"
  //   //         }`,
  //   //       };
  //   //       dispatch(setSetting({ ...data, fileList: [newfile] }));
  //   //       // setCurrencies(currency.data);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Failed to fetch settings:", error);
  //   //   }
  //   // };
  //   // fetchSettings();
  //   return () => {
  //     isMounted = false;
  //     dispatch(setFormValues({}));
  //   };
  // }, [dispatch, global.action]);

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
