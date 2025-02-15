"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const TaxList = dynamic(() => import("@/components/dashboard/tax/Taxlist"), {
  ssr: false,
});

const AddTax = dynamic(() => import("@/components/dashboard/tax/AddTax"), {
  ssr: false,
});

export default function Tax() {
  const [tabKey, setTabKey] = useState("tax_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Taxs",
            key: "tax_list",
            children: <TaxList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  tax: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Tax
          </Button>
        }
      />
      <AddTax />
    </div>
  );
}
