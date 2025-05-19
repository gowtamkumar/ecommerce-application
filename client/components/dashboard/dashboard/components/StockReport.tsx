"use client";
import React, { useState } from "react";
import { Card, Statistic, Tabs } from "antd";
import dynamic from "next/dynamic";

const StockDataTable = dynamic(() => import("../tables/DataTable"), {
  ssr: false,
});

const StockReport = ({ recentHistory }: any) => {
  const [tabKey, setTabKey] = useState("Pending");
  const {
    orders = [],
    total_active_user,
  } = recentHistory;

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 bg-white mb-3 ">
        <Card title="Recent History" size="small">
          <div>
            Active user
            <Statistic value={total_active_user || "0"} />
          </div>
        </Card>
      </div>
      <div className="col-span-9 bg-white">
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
      </div>
    </div>
  );
};

export default StockReport;
