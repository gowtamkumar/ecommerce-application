"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddUnit from "@/components/dashboard/unit/AddUnit";
import UnitList from "@/components/dashboard/unit/UnitList";

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
