"use client";
import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import WidgetStats from "./components/WidgetStats";
import StockReport from "./components/StockReport";
import TopCustomer from "./components/TopCustomer";
import StockAlert from "./components/StockAlert";
import {
  SendOutlined,
  DollarOutlined,
  RetweetOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  LineChartOutlined,
  DownSquareOutlined,
} from "@ant-design/icons";
// import { reportsApi } from 'src/store/features/reports/reportsApi'
import dayjs from "dayjs";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const [dashboardReports, setDashboardReports] = useState({});

  const dispatch = useDispatch();
  const { summary, stockRecords, topCustomers, stockReports } =
    dashboardReports || {};
  const { RangePicker } = DatePicker;

  const firstDateOfMonth = dayjs().date(1);
  const lastDateOfMonth = dayjs().endOf("month");

  useEffect(() => {
    (async () => {
      try {
        // const results = await Promise.resolve(
        //   dispatch(
        //     reportsApi.endpoints.getDashboard.initiate({
        //       startDate: firstDateOfMonth.toISOString(),
        //       endDate: lastDateOfMonth.toISOString(),
        //     }),
        //   ),
        // )
        setDashboardReports([]);
      } catch (err) {
        if (err.data) {
          console.log(err);
        }
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="grid pb-3">
        <div className="col-span-4">
          <RangePicker
            format="DD/MM/YYYY"
            style={{ background: "#fff" }}
            defaultValue={[firstDateOfMonth, lastDateOfMonth]}
            onChange={async (value) => {
              const newDate = {};

              if (value) newDate.startDate = dayjs(value[0]).toISOString();

              if (value) newDate.endDate = dayjs(value[1]).toISOString();

              if (!value) newDate.startDate = firstDateOfMonth.toISOString();
              if (!value) newDate.endDate = lastDateOfMonth.toISOString();

              const results = await Promise.resolve(
                dispatch(
                  reportsApi.endpoints.getDashboard.initiate(newDate, {
                    forceRefetch: true,
                  })
                )
              );
              setDashboardReports(results.data);
            }}
            className="mx-2 w-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <WidgetStats
          title="TOTAL SALE"
          value={summary?.Purchase.totalAmount || "0.00"}
          percentage={-2.65}
          subtitle="since last week"
          icon={<ShoppingOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL ORDER"
          value={summary?.Sale.totalAmount || "0.00"}
          percentage={3.65}
          subtitle="since last week"
          icon={<LineChartOutlined />}
          color="primary"
        />

        <WidgetStats
          title="ORDER RETURN"
          value={summary?.SaleReturn.totalAmount || "0.00"}
          percentage={-2.65}
          subtitle="since last week"
          icon={<RollbackOutlined />}
          color="primary"
        />

        <WidgetStats
          title="TOTAL VISITOR"
          value={summary?.PaymentOut.totalAmount || "0.00"}
          percentage={-2.65}
          subtitle="since last week"
          icon={<SendOutlined />}
          color="primary"
        />
      </div>

      <div className="py-4">
        <StockReport stockRecords={stockRecords} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4 mb-3">
          Ernings
          <h1>1. Revenue </h1>
          <h2>2. Profit</h2>
      
          {/* <TopCustomer topCustomers={topCustomers} /> */}
        </div>
        <div className="col-span-4 mb-3">
          <TopCustomer topCustomers={topCustomers} />
        </div>
        <div className="col-span-4 mb-3">
          <StockAlert stockReports={stockReports} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
