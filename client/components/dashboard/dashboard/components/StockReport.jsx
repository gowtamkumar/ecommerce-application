"use client";
import React, { useState } from "react";
import { Card, Statistic, Tabs, Tag } from "antd";
import StockDataTable from "../tables/StockDataTable";

const StockReport = ({ stockRecords }) => {
  const [tabKey, setTabKey] = useState("Sale");

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-2 p-0 bg-white mb-3 ">
        <Card title="Recent Stock History" size="small">
          <div className="alert alert-success">
            Total Sales Items
            <Statistic value={stockRecords?.totalSaleItems || "0"} />
          </div>
          <div className="alert alert-warning">
            Total Sales Returns Items
            <Statistic value={stockRecords?.totalSaleReturnItems || "0"} />
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
              label: "Order",
              key: "Order",
              children: (
                <StockDataTable type={tabKey} orderData={stockRecords?.sales} />
              ),
            },
            {
              label: "Order Return",
              key: "Order_Return",
              children: (
                <StockDataTable
                  type={tabKey}
                  orderData={stockRecords?.saleReturns}
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
