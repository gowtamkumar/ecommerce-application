"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import ProductList from "@/components/dashboard/product/ProductList";
import AddProduct from "@/components/dashboard/product/AddProduct";
import { useParams, useRouter } from "next/navigation";

export default function Product() {
  const [tabKey, setTabKey] = useState("product_list");
  const dispatch = useDispatch();
  const params = useRouter();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Products",
            key: "product_list",
            children: <ProductList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={
              () => params.push("/dashboard/products/new")
              // dispatch(
              //   setAction({
              //     type: ActionType.CREATE,
              //   })
              // )
            }
          >
            <PlusOutlined className="mx-1" /> New Product
          </Button>
        }
      />
      {/* <AddProduct /> */}
    </div>
  );
}
