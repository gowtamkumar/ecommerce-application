"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";

const AddBrand = dynamic(() => import('@/components/dashboard/brand/AddBrand'), { ssr: false })
const BrandList = dynamic(() => import('@/components/dashboard/brand/BrandList'), { ssr: false })



export default function Brand() {
  const [tabKey, setTabKey] = useState("brand_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Brands",
            key: "brand_list",
            children: <BrandList />,
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
            <PlusOutlined className="mx-1" /> New Brand
          </Button>
        }
      />
      <AddBrand />
    </div>
  );
}
