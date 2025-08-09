"use client";
import DiscountDetails from "@/components/dashboard/discount/DiscountDetails";
import DiscountStatusUpdate from "@/components/dashboard/discount/DiscountStatusUpdate";
import { ActionType } from "@/constants/constants";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

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
      {global.action.type === ActionType.VIEW && <DiscountDetails />}
      {global.action.type === ActionType.UPDATE && <DiscountStatusUpdate />}
    </div>
  );
}
