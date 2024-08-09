"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductList from "@/components/dashboard/product/ProductList";
import { useRouter } from "next/navigation";

export default function Product() {
  const [tabKey, setTabKey] = useState("product_list");
  const params = useRouter();

  return (
    <div className="container bg-white p-3">
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
            onClick={() => params.push("/dashboard/products/new")}
          >
            <PlusOutlined className="mx-1" /> New Product
          </Button>
        }
      />
    </div>
  );
}
