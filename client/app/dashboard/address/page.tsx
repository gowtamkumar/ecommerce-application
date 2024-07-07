"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddressList from "@/components/dashboard/address/AddressList";
import AddAddress from "@/components/dashboard/address/AddAddress";

export default function Address() {
  const [tabKey, setTabKey] = useState("address_list");
  const dispatch = useDispatch();


  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Address List",
            key: "address_list",
            children: <AddressList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Address
          </Button>
        }
      />
      <AddAddress />
    </div>
  );
}
