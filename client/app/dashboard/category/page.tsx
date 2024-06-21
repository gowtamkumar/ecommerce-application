"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import CategoryList from "@/components/dashboard/category/CategoryList";
import AddCategory from "@/components/dashboard/category/AddCategory";

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
