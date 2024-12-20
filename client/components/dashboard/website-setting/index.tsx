"use client";
import React, { useEffect } from "react";
import { Tabs } from "antd";
import dynamic from "next/dynamic";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import appConfig from "@/appConfig";
import { errorNotification } from "@/lib/utils/notification";


const Menu = dynamic(() => import("./Menu"), { ssr: false })
const HomePage = dynamic(() => import("./HomePage"), { ssr: false })
const AboutPage = dynamic(() => import("./AboutPage"), { ssr: false })
const ContactPage = dynamic(() => import("./ContactPage"), { ssr: false })
const TermPolicyPage = dynamic(() => import("./TermPolicyPage"), { ssr: false })
const HelpSupport = dynamic(() => import("./HelpSupport"), { ssr: false })
const HeaderOption = dynamic(() => import("./HeaderOption"), { ssr: false })
const SocialLink = dynamic(() => import("./SocialLink"), { ssr: false })
const FooterOption = dynamic(() => import("./FooterOption"), { ssr: false })

export default function Index() {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();



  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchSettings = async () => {

  //     try {
  //       setLoading(true)
  //       const setting = await getSettings();

  //       if (isMounted) {
  //         const newData = setting.data?.length ? setting.data[0] : {};
  //         if (newData.image) {
  //           const newfile = {
  //             uid: Math.random() * 1000 + "",
  //             name: `logo ${Math.random() * 10000 + ""}`,
  //             status: "done",
  //             fileName: newData.image,
  //             url: `${appConfig.apiUrl}/uploads/${newData.image || "no-data.png"
  //               }`,
  //           };
  //           newData.fileList = [newfile];
  //         }

  //         dispatch(setFormValues(newData));
  //       }

  //       setLoading(false)
  //     } catch (error) {
  //       setLoading(false)
  //       console.error("Failed to fetch settings:", error);
  //     }
  //   };

  //   fetchSettings();
  //   return () => {
  //     isMounted = false;
  //     dispatch(setFormValues({}));
  //   };
  // }, [dispatch, global.action]);

  useEffect(() => {
    fetchData();
  }, [global.action]);


  const fetchData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const setting = await getSettings();
      

      const newData = setting.data?.length ? setting.data[0] : {};
      if (newData?.image) {
        const newfile = {
          uid: Math.random() * 1000 + "",
          name: `logo ${Math.random() * 10000 + ""}`,
          status: "done",
          fileName: newData.image,
          url: `${appConfig.apiUrl}/uploads/${newData.image || "no-data.png"
            }`,
        };
        newData.fileList = [newfile];
      }

      dispatch(setFormValues(newData));
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  return (
    <Tabs
      tabPosition="left"
      defaultValue="web_site_stting"
      type="card"
      items={[
        {
          label: "Menu",
          key: "menu",
          children: <Menu />,
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
