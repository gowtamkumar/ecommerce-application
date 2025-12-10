import { ActionType } from "@/constants/constants";
import { getCoupon } from "@/lib/apis/admin/coupon";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { Modal, Spin, Tag } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CouponProduct from "./CouponProduct";

export default function CouponDetails() {
  const [loading, setLoading] = React.useState(false);
  const [coupon, setCoupon] = React.useState<any>({});
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const value = { ...global.action.payload };

  const featchData = useCallback(async () => {
    setLoading(true);
    const id = value.id;
    if (!id) {
      setLoading(false);
      return;
    }
    const res = await getCoupon(id);
    setCoupon(res.data);
    setLoading(false);
  }, [value.id]);

  useEffect(() => {
    featchData();
  }, [featchData]);

  return (
    <Modal
      title="Coupon Details"
      open={global.action.type === ActionType.VIEW && global.action.coupon}
      footer={null}
      width={1000}
      onCancel={() => dispatch(setAction({}))}
    >
      {loading ? (
        <Spin className="flex justify-center items-center" />
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>Code: {coupon.code}</p>
              <p>Type: {coupon.type}</p>
              <p>Discount Type: {coupon.discountType}</p>
              <p>value: {coupon.value}</p>
              <p>
                Start Date:{" "}
                {dayjs(coupon.startDate).format("DD-MM-YYYY h:mm A")}
              </p>
              <p>
                Expiry Date:{" "}
                {dayjs(coupon.expiryDate).format("DD-MM-YYYY h:mm A")}
              </p>
              <p>Min Order Amount: {coupon.minOrderAmount}</p>
              <p>Max User: {coupon.maxUser}</p>
              <p>Min Cart Value: {coupon.mincartValue}</p>
              <p>Max Discount Value: {coupon.maxDiscountValue}</p>
              <p>Usage Limit: {coupon.usageLimit}</p>
              <p>Usage Per User: {coupon.usagePerUser}</p>
              <p>
                Status:{" "}
                <Tag color={coupon.active ? "green" : "red"}>
                  {" "}
                  {coupon.active ? "Active" : "Inactive"}
                </Tag>
              </p>
            </div>
          </div>
          <CouponProduct products={coupon?.products || []} />
        </div>
      )}
    </Modal>
  );
}
