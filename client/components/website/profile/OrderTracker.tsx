"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, Divider, Empty, Input, Popconfirm, Rate, Space, Timeline } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { addCart } from "@/redux/features/cart/cartSlice";
import { productDiscountCalculation } from "@/lib/share";
import { deleteWishlist } from "@/lib/apis/wishlist";
import {
  FormOutlined,
  PlusOutlined,
  UserAddOutlined,
  RestOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FaShoppingCart } from "react-icons/fa";

export default function OrderTracker() {
  const [tracker, setTracker] = useState({} as { orderTrackingNo: string });
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ tracker:", tracker);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  async function handleOrderTracking() {
    setLoading(true);
    console.log("sdfasdf", tracker);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  // if (!wishlists?.length) {
  //   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  //   return;
  // }

  return (
    <div>
      <label htmlFor="orderTrackingNo">Order Tracking No</label>
      <Space.Compact block size="small">
        <Input
          id="orderTrackingNo"
          size="middle"
          placeholder="Input Your tracking No"
          onChange={({ target }) =>
            setTracker({ orderTrackingNo: target.value })
          }
        />
        <Button
          size="middle"
          disabled={!tracker.orderTrackingNo}
          type="primary"
          loading={loading}
          onClick={handleOrderTracking}
        >
          Query
        </Button>
      </Space.Compact>

      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      {/* <div className="grid grid-cols-4 p-2">
        <div className="col-span-1 p-2">
          <h1 className="font-bold">Order No:{value.trackingNo}</h1>
          <Divider dashed />
          <Timeline
            items={(value?.orderTrackings || []).map(
              (timeline: any, idx: number) => ({
         
                children: (
                  <div key={idx}>
                    <div> {timeline.status}</div>
                    <div>
                      {" "}
                      {dayjs(timeline.createdAt).format("MMMM D, YYYY h:mm A")}
                    </div>
                    <div> {timeline.location}</div>
                  </div>
                ),
              })
            )}
          />
        </div>
        <div className="col-span-3">
          <div className="p-4 bg-white">
            <h1 className="font-semibold">Order Items</h1>
            <Table
              columns={childColumns}
              size="small"
              scroll={{ x: "auto" }}
              dataSource={value.orderItems}
              pagination={false}
              bordered
            />
          </div>
          <div className="grid grid-cols-3 mt-5">
            <div className="col-span-2">dasdf</div>
            <div className="grid gap-y-3 col-span-1">
              <div className="flex justify-between">
                <h1>
                  Net Amount: (+tax {value.orderTax}, - Discount{" "}
                  {value.discountAmount})
                </h1>
                <h1 className="font-semibold">
                  ${(+value.netAmount).toFixed(2)}
                </h1>
              </div>

              <div className="flex justify-between">
                <h1>Shipping:</h1>
                <h1 className="font-semibold">
                  + ${(+value.shippingAmount || 0).toFixed(2)}
                </h1>
              </div>
              <div className="flex justify-between border-t-2">
                <h1>Total Amount:</h1>
                <h1 className="font-semibold">
                  ${" "}
                  {(
                    +value.orderTotalAmount + +value.shippingAmount || 0
                  ).toFixed(2)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
