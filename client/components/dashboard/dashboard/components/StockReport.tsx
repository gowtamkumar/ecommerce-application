"use client";
import React, { useState } from "react";
import { Card, Statistic, Tabs, Tag } from "antd";
import StockDataTable from "../tables/StockDataTable";

const StockReport = ({ recentHistory }: any) => {
  const [tabKey, setTabKey] = useState("Order");
  const { orders, sales } = recentHistory;
  console.log("🚀 ~ sales:", sales);
  console.log("🚀 ~ orders:", orders);

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-2 p-0 bg-white mb-3 ">
        <Card title="Recent History" size="small">
          <div className="alert alert-success">
            Total Order
            <Statistic value={orders?.length || "0"} />
          </div>
          <div className="alert alert-warning">
            Total Sales Items
            <Statistic value={sales?.length || "0"} />
          </div>
          <div className="alert alert-warning">
            Active user
            <Statistic value={+10000 || "0"} />
          </div>
        </Card>
      </div>
      <div className="col-span-4 p-0 bg-white">
        <Tabs
          type="card"
          activeKey={tabKey}
          onChange={(key) => setTabKey(key)}
          items={[
            {
              label: "Recent Order",
              key: "Order",
              children: <StockDataTable type={tabKey} orderData={orders} />,
            },
            {
              label: "Sale",
              key: "Sale",
              children: <StockDataTable type={tabKey} orderData={sales} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default StockReport;
