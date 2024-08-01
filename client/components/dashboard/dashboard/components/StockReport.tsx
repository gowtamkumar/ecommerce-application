"use client";
import React, { useEffect, useState } from "react";
import { Card, Statistic, Tabs } from "antd";
import StockDataTable from "../tables/DataTable";

const StockReport = ({ recentHistory }: any) => {
  const [tabKey, setTabKey] = useState("Pending");
  const { orders = [], total_order_count, total_sale_count } = recentHistory;

  // useEffect(() => {
  //   (async () => {
  //     const orders = await getDashboardReports({
  //       status: tabKey,
  //       startDate: datePic.startDate,
  //       endDate: datePic.endDate,
  //     });
  //     setDashboardReports(orders.data);
  //   })();
  // }, [tabKey]);

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-2 p-0 bg-white mb-3 ">
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
