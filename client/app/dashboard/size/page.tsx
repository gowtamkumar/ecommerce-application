"use client";
import React, { useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SizeList from "@/components/dashboard/size/SizeList";
import { ActionType } from "@/constants/constants";
import AddSize from "@/components/dashboard/size/AddSize";
import { getSizes } from "@/lib/apis/size";

export default function Size() {
  const [tabKey, setTabKey] = useState("size_list");
  const [action, setAction] = useState({});
  const [sizes, setSize] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getSizes();
      setSize(res?.data);
    })();
  }, [action]);

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Sizes",
            key: "size_list",
            children: <SizeList setAction={setAction} sizes={sizes} />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() => setAction({ type: ActionType.CREATE })}
          >
            <PlusOutlined className="mx-1" /> New size
          </Button>
        }
      />
      <AddSize action={action} setAction={setAction} />

      {/* {action.type === ActionType.CREATE && <AddBrand action={action} setAction={setAction} />}
      {action.type === ActionType.UPDATE && <AddBrand action={action} setAction={setAction} />} */}
    </div>
  );
}
