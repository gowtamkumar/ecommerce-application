"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";

const UserList = dynamic(() => import("@/components/dashboard/user/UserList"), {
  ssr: false,
});

const AddUser = dynamic(() => import("@/components/dashboard/user/AddUser"), {
  ssr: false,
});

export default function User() {
  const [tabKey, setTabKey] = useState("user_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Users",
            key: "user_list",
            children: <UserList />,
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
            <PlusOutlined className="mx-1" /> New User
          </Button>
        }
      />
      <AddUser />
    </div>
  );
}
