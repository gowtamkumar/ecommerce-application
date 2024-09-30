"use client";
import Banner from "@/app/dashboard/banner/page";
import Color from "@/app/dashboard/color/page";
import Discount from "@/app/dashboard/discounts/page";
import Review from "@/app/dashboard/review/page";
import Size from "@/app/dashboard/size/page";
import Status from "@/app/dashboard/status/page";
import Tax from "@/app/dashboard/taxs/page";
import Unit from "@/app/dashboard/unit/page";
import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import EmailSetting from "./EmailSetting";
import Post from "./blog/Post";
import Lead from "./lead/Lead";
import Currency from "./currency/Currency";
import CompanySetting from "./CompanySetting";
import { getCurrencies } from "@/lib/apis/currency";

export default function Index() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const setting = await getSettings();
        const currency = await getCurrencies();
        if (isMounted) {
          const data = setting.data[0] || {};
          const newfile = {
            uid: Math.random() * 1000 + "",
            name: `logo ${Math.random() * 10000 + ""}`,
            status: "done",
            fileName: data.image,
            url: `http://localhost:3900/uploads/${data.image || "no-data.png"}`,
          };
          dispatch(setFormValues({ ...data, fileList: [newfile] }));
          setCurrencies(currency.data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
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
        {
          label: "Email Config",
          key: "email_config",
          children: <EmailSetting />,
        },
        {
          label: "Currency Setting",
          key: "currency_stting",
          children: <Currency />,
        },
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
          label: "Discount",
          key: "discount",
          children: <Discount />,
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
        {
          label: "Status",
          key: "status",
          children: <Status />,
        },
        {
          label: "Post",
          key: "post",
          children: <Post />,
        },
        {
          label: "Leads",
          key: "lead",
          children: <Lead />,
        },
      ]}
    />
  );
}
