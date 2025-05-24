"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import GeneralSettings from "./GeneralSettings";
import SyncGeoLocation from "./SyncGeoLocation";
import Seo from "./Seo";
import { useRouter, useSearchParams } from "next/navigation";
const Menu = dynamic(() => import("./Menu"), { ssr: false });
const HelpSupport = dynamic(() => import("./HelpSupport"), { ssr: false });
const HeaderOption = dynamic(() => import("./HeaderOption"), { ssr: false });
const FooterOption = dynamic(() => import("./FooterOption"), { ssr: false });

export default function Index() {
  const [tabKey, setTabKey] = useState<any>("site_settings");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  const search = useSearchParams();

    const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));

    const createUploadFile = (filename: string): any => ({
      uid: `${Date.now()}-${Math.random()}`,
      name: `image-${Math.floor(Math.random() * 10000)}`,
      status: "done",
      fileName: filename,
      url: `${appConfig.baseApiUrl}/uploads/${filename || "no-data.png"}`,
    });

    try {
      const setting = await getSettings();
      const newData = setting.data;

 

      if (newData?.image) {
        newData.fileList = [createUploadFile(newData.image)];
      }

      if (newData?.favicon) {
        newData.faviconfileList = [createUploadFile(newData.favicon)];
      }

      if (newData?.footerOption?.image) {
        newData.footerOption.fileList = [
          createUploadFile(newData.footerOption.image),
        ];
      }
      if (newData?.homePage?.metaImage) {
        newData.homePage.metaImagefileList = [
          createUploadFile(newData?.homePage?.metaImage),
        ];
      }
      

      dispatch(setSetting(newData));
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);


  useEffect(() => {
    setTabKey(search.get("tab"));
    fetchData();
  }, [fetchData, global.action, search]);


  return (
    <Tabs
      tabPosition="left"
      defaultValue={tabKey}
      activeKey={tabKey}
      onChange={(key) => {
        setTabKey(key);
        route.push(`/dashboard/general-setting?tab=${key}`);
      }}
      type="card"
      items={[
        {
          label: "General Settings",
          key: "site_settings",
          children: <GeneralSettings />,
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
        {
          label: "SEO",
          key: "seo",
          children: <Seo />,
        },

        {
          label: "Footer Option",
          key: "footer_option",
          children: <FooterOption />,
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
