"use client";
import React, { useEffect, useState } from "react";
import { Card, Statistic, Tabs } from "antd";
import StockDataTable from "../tables/DataTable";

const StockReport = ({ recentHistory }: any) => {
  const [tabKey, setTabKey] = useState("Pending");
  const {
    orders = [],
    total_order_count,
    total_sale_count,
    total_active_user,
    total_sale_return_count,
    total_canceled_count,
  } = recentHistory;

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 bg-white mb-3 ">
        <Card title="Recent History" size="small">
          <div className="alert alert-success">
            Total Order
            <Statistic value={total_order_count || "0"} />
          </div>
          <div>
            Total Sales Items
            <Statistic value={total_sale_count || "0"} />
          </div>
          <div>
            Total Sales Return Items
            <Statistic value={total_sale_return_count || "0"} />
          </div>
          <div>
            Total Order Canceled Items
            <Statistic value={total_canceled_count || "0"} />
          </div>
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
            {
              label: "Sale Returned",
              key: "Returned",
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
