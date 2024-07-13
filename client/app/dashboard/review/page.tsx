"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddReview from "@/components/dashboard/review/AddReview";
import ReviewList from "@/components/dashboard/review/ReviewList";

export default function Review() {
  const [tabKey, setTabKey] = useState("reviews_list");
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Reviews",
            key: "reviews_list",
            children: <ReviewList />,
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
            <PlusOutlined className="mx-1" /> New Review
          </Button>
        }
      />
      <AddReview />
    </div>
  );
}
