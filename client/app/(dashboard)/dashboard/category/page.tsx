"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const AddCategory = dynamic(() => import('@/components/dashboard/category/AddCategory'), { ssr: false })
const CategoryList = dynamic(() => import('@/components/dashboard/category/CategoryList'), { ssr: false })

export default function Category() {
  const [tabKey, setTabKey] = useState("category_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Category",
            key: "category_list",
            children: <CategoryList />,
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
            <PlusOutlined className="mx-1" /> New Category
          </Button>
        }
      />
      <AddCategory />
    </div>
  );
}
