"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductList = dynamic(() => import('@/components/dashboard/product/ProductList'), { loading: () => <Spin /> })

export default function Product() {
  const [tabKey, setTabKey] = useState("product_list");
  const route = useRouter();

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
            onClick={() => route.push("/dashboard/product/new")}
          >
            <PlusOutlined className="mx-1" /> New Product
          </Button>
        }
      />
    </div>
  );
}
