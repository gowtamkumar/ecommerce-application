import Color from "@/app/dashboard/color/page";
import Discount from "@/app/dashboard/discounts/page";
import Review from "@/app/dashboard/review/page";
import Size from "@/app/dashboard/size/page";
import Status from "@/app/dashboard/status/page";
import Tax from "@/app/dashboard/taxs/page";
import Unit from "@/app/dashboard/unit/page";
import { Tabs } from "antd";
import React from "react";

export default function Setting() {
  return (
    <Tabs
      tabPosition="left"
      defaultValue={"company_stting"}
      type="card"
      items={[
        {
          label: "Company Setting",
          key: "company_stting",
          children: "company",
        },
        {
          label: "Sizes",
          key: "size",
          children: <Size />,
        },
        {
          label: "Units",
          key: "unit",
          children: <Unit />,
        },
        {
          label: "Taxs",
          key: "tax",
          children: <Tax />,
        },
        {
          label: "Discount",
          key: "discount",
          children: <Discount />,
        },
        {
          label: "Colors",
          key: "color",
          children: <Color />,
        },
        {
          label: "Reviews",
          key: "reviews",
          children: <Review />,
        },
        {
          label: "Status",
          key: "status",
          children: <Status />,
        },
      ]}
    />
  );
}
