"use client";
import { getSettings } from "@/lib/apis/setting";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setLoading,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { Tabs, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Seo from "./Seo";
import WhatsAppWidgetSetting from "./WhatsAppWidgetSetting";

const { Title, Text } = Typography;

const Menu = dynamic(() => import("./Menu"), { ssr: false });
const HelpSupport = dynamic(() => import("./HelpSupport"), { ssr: false });
const HeaderOption = dynamic(() => import("./HeaderOption"), { ssr: false });
const FooterOption = dynamic(() => import("./FooterOption"), { ssr: false });
const FaqSettings = dynamic(() => import("./FaqSettings"), { ssr: false });
const OrderAdnShhiping = dynamic(() => import("./OrderAndShipping"), {
  ssr: false,
});
const GeneralSettings = dynamic(() => import("./GeneralSettings"), {
  ssr: false,
});
const SyncGeoLocation = dynamic(() => import("./SyncGeoLocation"), {
  ssr: false,
});

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
      url: getUploadImageUrl(filename || "no-data.png"),
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
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-1">
          General Settings
        </Title>
        <Text type="secondary">
          Configure your store settings and preferences
        </Text>
      </div>

      {/* Tabs */}
      <Tabs
        tabPosition="left"
        defaultValue={tabKey}
        activeKey={tabKey}
        onChange={(key) => {
          setTabKey(key);
          route.push(`/dashboard/general-setting?tab=${key}`);
        }}
        type="card"
        className="modern-tabs"
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
            label: "Order & Shipping",
            key: "order_and_shipping",
            children: <OrderAdnShhiping />,
          },
          {
            label: "Header Option",
            key: "header_option",
            children: <HeaderOption />,
          },
          {
            label: "Help & Support",
            key: "help_Support",
            children: <HelpSupport />,
          },
          {
            label: "FAQ",
            key: "faq",
            children: <FaqSettings />,
          },
          {
            label: "WhatsApp Widget",
            key: "whatsApp_widget",
            children: <WhatsAppWidgetSetting />,
          },
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
            label: "Sync Geo Location",
            key: "geo_locations",
            children: <SyncGeoLocation />,
          },
        ]}
      />
    </div>
  );
}
