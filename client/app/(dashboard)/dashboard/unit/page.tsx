"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const AddUnit = dynamic(() => import("@/components/dashboard/unit/AddUnit"), {
  ssr: false,
});
const UnitList = dynamic(() => import("@/components/dashboard/unit/UnitList"), {
  ssr: false,
});

export default function Unit() {
  const [tabKey, setTabKey] = useState("unit_list");
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Units",
            key: "unit_list",
            children: <UnitList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  unit:true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Unit
          </Button>
        }
      />
      <AddUnit />
    </div>
  );
}
