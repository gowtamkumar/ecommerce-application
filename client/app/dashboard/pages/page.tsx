"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";

const PageList = dynamic(() => import("@/components/dashboard/page/PageList"), { ssr: false });

export default function PagesPage() {
  const [tabKey, setTabKey] = useState("page_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Pages",
            key: "page_list",
            children: <PageList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  page: true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Page
          </Button>
        }
      />
    </div>
  );
}
