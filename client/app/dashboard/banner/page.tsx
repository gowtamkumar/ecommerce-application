"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import BannerList from "@/components/dashboard/banner/BannerLIst";
import AddBanner from "@/components/dashboard/banner/AddBanner";

export default function Banner() {
  const [tabKey, setTabKey] = useState("banner_list");
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Banner",
            key: "banner_list",
            children: <BannerList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  banner:true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Banner
          </Button>
        }
      />
      <AddBanner />
    </div>
  );
}
