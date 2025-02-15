"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const AddStatus = dynamic(() => import("@/components/dashboard/status/AddStatus"), {
  ssr: false,
});

const StatusList = dynamic(() => import("@/components/dashboard/status/StatusList"), {
  ssr: false,
});


export default function Status() {
  const [tabKey, setTabKey] = useState("status_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "status",
            key: "status_list",
            children: <StatusList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  status:true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New status
          </Button>
        }
      />
      <AddStatus />
    </div>
  );
}
