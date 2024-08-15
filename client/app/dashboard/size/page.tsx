"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import AddSize from "@/components/dashboard/size/AddSize";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import SizeList from "@/components/dashboard/size/SizeList";

export default function Size() {
  const [tabKey, setTabKey] = useState("size_list");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Sizes",
            key: "size_list",
            children: <SizeList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  size: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New size
          </Button>
        }
      />
      <AddSize />
    </div>
  );
}
