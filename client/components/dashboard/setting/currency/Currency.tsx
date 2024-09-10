"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddCurrency from "./AddCurrency";
import CurrencyList from "./CurrencyList";

export default function Currency() {
  const [tabKey, setTabKey] = useState("currency_list");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Currencies",
            key: "currency_list",
            children: <CurrencyList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  currency: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Currency
          </Button>
        }
      />
      <AddCurrency />
    </div>
  );
}
