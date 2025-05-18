"use client";
import dynamic from 'next/dynamic'
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";

const AddStockAdjust = dynamic(()=> import('./AddStockAdjust'), {ssr: false})
const StockAdjustList = dynamic(()=> import('./StockAdjustList'), {ssr: false})


export default function StockAdjust() {
  const [tabKey, setTabKey] = useState("stock_adjust");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3 ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Stock Adjust",
            key: "stock_adjust",
            children: <StockAdjustList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            onClick={() =>
              dispatch(
                setAction({
                  stockAdjust: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> Stock Adjust
          </Button>
        }
      />
      <AddStockAdjust />
    </div>
  );
}
