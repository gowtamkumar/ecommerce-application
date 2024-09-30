"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import LeadList from "./LeadList";
import AddLead from "./AddLead";


export default function Lead() {
  const [tabKey, setTabKey] = useState("lead_list");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3 ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Leads",
            key: "lead_list",
            children: <LeadList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  lead: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Lead
          </Button>
        }
      />
      <AddLead />
    </div>
  );
}
