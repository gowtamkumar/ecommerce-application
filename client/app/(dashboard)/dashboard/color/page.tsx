"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";

const ColorList = dynamic(
  () => import("@/components/dashboard/color/ColorList"),
  { ssr: false }
);
const AddColor = dynamic(
  () => import("@/components/dashboard/color/AddColor"),
  { ssr: false }
);

export default function Color() {
  const [tabKey, setTabKey] = useState("Color_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Colors",
            key: "Color_list",
            children: <ColorList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  color: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Color
          </Button>
        }
      />
      <AddColor />
    </div>
  );
}
