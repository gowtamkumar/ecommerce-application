"use client";
import React, { use, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { useRouter } from "next/navigation";
import DiscountDetails from "@/components/dashboard/discount/DiscountDetails";

const DiscountList = dynamic(
  () => import("@/components/dashboard/discount/DiscountList")
);

export default function Discount() {
  const [tabKey, setTabKey] = useState("discount_list");
  const route = useRouter();
  const global = useSelector(selectGlobal);  

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Discounts",
            key: "discount_list",
            children: <DiscountList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() => route.push("/dashboard/discounts/new")}
          >
            <PlusOutlined className="mx-1" /> New Discount
          </Button>
        }
      />
      {global.action.type === ActionType.VIEW && <DiscountDetails/>}
    </div>
  );
}
