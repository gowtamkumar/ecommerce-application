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

const { Title, Text } = Typography;

const Menu = dynamic(() => import("./Menu"), { ssr: false });
const AppearanceSettings = dynamic(() => import("./AppearanceSettings"), { ssr: false });
const MarketingAndSeo = dynamic(() => import("./MarketingAndSeo"), { ssr: false });
const SupportSettings = dynamic(() => import("./SupportSettings"), { ssr: false });
const PageLayoutSettings = dynamic(() => import("./PageLayoutSettings"), { ssr: false });
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
      if (newData?.seo?.metaImage) {
        newData.seo.metaImagefileList = [
          createUploadFile(newData?.seo?.metaImage),
        ];
      }
      if (newData?.marketing?.popupImage) {
        newData.marketing.popupImagefileList = [
          createUploadFile(newData?.marketing?.popupImage),
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
    const tab = search.get("tab") || "site_settings";
    setTabKey(tab);
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
        activeKey={tabKey}
        onChange={(key) => {
          setTabKey(key);
          route.push(`/dashboard/general-setting?tab=${key}`);
        }}
        type="card"
        className="modern-tabs"
        items={[
          {
            label: "Basic Information",
            key: "site_settings",
            children: <GeneralSettings />,
          },
          {
            label: "Navigation Menu",
            key: "menu",
            children: <Menu />,
          },
          {
            label: "Appearance",
            key: "appearance",
            children: <AppearanceSettings />,
          },
          {
            label: "Orders & Shipping",
            key: "order_and_shipping",
            children: <OrderAdnShhiping />,
          },
          {
            label: "Support & FAQ",
            key: "support",
            children: <SupportSettings />,
          },
          {
            label: "Marketing & SEO",
            key: "marketing_seo",
            children: <MarketingAndSeo />,
          },
          {
            label: "Page Layout",
            key: "page_layout",
            children: <PageLayoutSettings />,
          },
          {
            label: "Advanced (Geo)",
            key: "geo_locations",
            children: <SyncGeoLocation />,
          },
        ]}
      />
    </div>
  );
}
