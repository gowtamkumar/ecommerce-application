"use client";
import { Tabs } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

const StockDataTable = dynamic(() => import("../tables/DataTable"), {
  ssr: false,
});

const StockReport = ({ recentHistory }: any) => {
  const [tabKey, setTabKey] = useState("Pending");
  const {
    orders = [],
  } = recentHistory;

  return (

    <Tabs
      type="card"
      activeKey={tabKey}
      onChange={(key) => setTabKey(key)}
      items={[
        {
          label: "Recent Order",
          key: "Pending",
          children: (
            <StockDataTable
              type={tabKey}
              orderData={orders.filter(
                (item: any) => item.status === tabKey
              )}
            />
          ),
        },
        {
          label: "Sale",
          key: "Completed",
          children: (
            <StockDataTable
              type={tabKey}
              orderData={orders.filter(
                (item: any) => item.status === tabKey
              )}
            />
          ),
        },
      ]}
    />
  );
};

export default StockReport;
