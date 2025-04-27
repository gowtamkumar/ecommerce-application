"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencies } from "@/lib/apis/currency";
import appConfig from "@/appConfig";
import SyncGeoLocation from "./SyncGeoLocation";

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
const Banner = dynamic(
  () => import("@/app/dashboard/banner/page"),
  { ssr: false }
);
const Review = dynamic(
  () => import("@/app/dashboard/review/page"),
  { ssr: false }
);
// const Status = dynamic(
//   () => import("@/app/(dashboard)/dashboard/status/page"),
//   { ssr: false }
// );
// const EmailSetting = dynamic(() => import("./EmailSetting"), { ssr: false });
const Lead = dynamic(() => import("./lead/Lead"), { ssr: false });
// const Currency = dynamic(() => import("./currency/Currency"), { ssr: false });
const CompanySetting = dynamic(() => import("./CompanySetting"), {
  ssr: false,
});

export default function Index() {
  const [currencies, setCurrencies] = useState([] as any);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const setting = await getSettings();
        const currency = await getCurrencies();
        if (isMounted) {
          const data = setting?.data?.length ? setting?.data[0] : {};
          const newfile = {
            uid: Math.random() * 1000 + "",
            name: `logo ${Math.random() * 10000 + ""}`,
            status: "done",
            fileName: data.image,
            url: `${appConfig.baseApiUrl}/uploads/${data.image || "no-data.png"}`,
          };
          dispatch(setFormValues({ ...data, fileList: [newfile] }));
          setCurrencies(currency.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
      dispatch(setFormValues({}));
    };
  }, [dispatch, global.action]);

  return (
    <Tabs
      tabPosition="left"
      defaultValue={"company_stting"}
      type="card"
      items={[
        {
          label: "Company Setting",
          key: "web_site_stting",
          children: <CompanySetting currencies={currencies} />,
        },
        // {
        //   label: "Email Config",
        //   key: "email_config",
        //   children: <EmailSetting />,
        // },
        // {
        //   label: "Currency Setting",
        //   key: "currency_stting",
        //   children: <Currency />,
        // },
        {
          label: "Sizes",
          key: "size",
          children: <Size />,
        },
        {
          label: "Units",
          key: "unit",
          children: <Unit />,
        },
        {
          label: "Taxs",
          key: "tax",
          children: <Tax />,
        },
    
        {
          label: "Colors",
          key: "color",
          children: <Color />,
        },
        {
          label: "Banner",
          key: "banner",
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
          key: "lead",
          children: <Lead />,
        },
        {
          label: "Sync Geo locaton",
          key: "geo_location",
          children: <SyncGeoLocation />,
        },
      ]}
    />
  );
}
