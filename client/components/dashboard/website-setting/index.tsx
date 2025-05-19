"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import dynamic from "next/dynamic";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setLoading,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import appConfig from "@/appConfig";
import { errorNotification } from "@/lib/utils/notification";
import CompanySetting from "./CompanySetting";
const Menu = dynamic(() => import("./Menu"), { ssr: false });
const HelpSupport = dynamic(() => import("./HelpSupport"), { ssr: false });
const HeaderOption = dynamic(() => import("./HeaderOption"), { ssr: false });
const FooterOption = dynamic(() => import("./FooterOption"), { ssr: false });

export default function Index() {
  const [tabKey, setTabKey] = useState<any>("company");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [global.action]);

  const fetchData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const setting = await getSettings();
      const newData = setting.data;
      if (newData?.image) {
        const newfile = {
          uid: Math.random() * 1000 + "",
          name: `logo ${Math.random() * 10000 + ""}`,
          status: "done",
          fileName: newData.image,
          url: `${appConfig.baseApiUrl}/uploads/${
            newData.image || "no-data.png"
          }`,
        };
        newData.fileList = [newfile];
      }

      if (newData?.footerOption.image) {
        const newfile = {
          uid: Math.random() * 1000 + "",
          name: `logo ${Math.random() * 10000 + ""}`,
          status: "done",
          fileName: newData.footerOption.image,
          url: `${appConfig.baseApiUrl}/uploads/${
            newData.footerOption.image || "no-data.png"
          }`,
        };
        newData.footerOption.fileList = [newfile];
      }

      dispatch(setSetting(newData));
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Tabs
      tabPosition="left"
      defaultValue={tabKey}
      activeKey={tabKey}
      onChange={(key) => {
        setTabKey(key);
        // route.push(`/dashboard/setting?tab=${key}`);
      }}
      type="card"
      items={[
        {
          label: "Company Setting",
          key: "company",
          children: <CompanySetting />,
        },
        {
          label: "Menu",
          key: "menu",
          children: <Menu />,
        },

        {
          label: "Header Option",
          key: "header_option",
          children: <HeaderOption />,
        },

        {
          label: "Help Support",
          key: "help_Support",
          children: <HelpSupport />,
        },

        // {
        //   label: "Home Page",
        //   key: "home_page",
        //   children: <HomePage />,
        // },
        // {
        //   label: "About Page",
        //   key: "about_page",
        //   children: <AboutPage />,
        // },
        // {
        //   label: "Contact Page",
        //   key: "contact_page",
        //   children: <ContactPage />,
        // },
        // {
        //   label: "Term Policy Page",
        //   key: "term_policy_page",
        //   children: <TermPolicyPage />,
        // },

        {
          label: "Footer Option",
          key: "footer_option",
          children: <FooterOption />,
        },
      ]}
    />
  );
}
