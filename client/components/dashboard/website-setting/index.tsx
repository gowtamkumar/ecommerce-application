"use client";
import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import WebSetting from "./WebSetting";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setFormValues,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import SocialLink from "./SocialLink";
import HeaderOption from "./HeaderOption";
import FooterOption from "./FooterOption";
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import TermPolicyPage from "./TermPolicyPage";
import ContactPage from "./ContactPage";
import HelpSupport from "./HelpSupport";
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
        setLoading(true)
        const setting = await getSettings();
        const currency = await getCurrencies();
        if (isMounted) {
          const newData = { ...setting.data[0] };
          if (newData.image) {
            const newfile = {
              uid: Math.random() * 1000 + "",
              name: `logo ${Math.random() * 10000 + ""}`,
              status: "done",
              fileName: newData.image,
              url: `http://localhost:3900/uploads/${newData.image || "no-data.png"
                }`,
            };
            newData.fileList = [newfile];
          }

          dispatch(setFormValues(newData));
        }

        setCurrencies(currency.data)

        setLoading(false)
      } catch (error) {
        setLoading(false)
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
      defaultValue={"web_site_stting"}
      type="card"
      items={[
        {
          label: "Company Setting",
          key: "web_site_stting",
          children: <WebSetting  currencies={currencies}  />,
        },
        {
          label: "Home Page",
          key: "home_page",
          children: <HomePage />,
        },
        {
          label: "About Page",
          key: "about_page",
          children: <AboutPage />,
        },
        {
          label: "Contact Page",
          key: "contact_page",
          children: <ContactPage />,
        },
        {
          label: "Term Policy Page",
          key: "term_policy_page",
          children: <TermPolicyPage />,
        },
        {
          label: "Help Support",
          key: "help_Support",
          children: <HelpSupport />
        },

        {
          label: "Header Option",
          key: "header_option",
          children: <HeaderOption />,
        },
        {
          label: "Social Links",
          key: "social_links",
          children: <SocialLink />,
        },
        {
          label: "Footer Option",
          key: "footer_option",
          children: <FooterOption />,
        },
       
      ]}
    />
  );
}
