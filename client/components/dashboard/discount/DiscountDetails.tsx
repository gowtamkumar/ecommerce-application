import appConfig from "@/appConfig";
import { ActionType } from "@/constants/constants";
import { getDiscount, getDiscounts } from "@/lib/apis/discount";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { message, Modal } from "antd";
import dayjs from "dayjs";
import { create } from "domain";
import Image from "next/image";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { start } from "repl";

export default function DiscountDetails() {
  const [discount, setDiscount] = React.useState<any>({});
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const value = { ...global.action.payload };

  console.log("value", value);

  useEffect(() => {
    featchData();
  }, [global.action]);

  const featchData = async () => {
    const id = value.id;
    const res = await getDiscount(id);
    console.log("res", res);

    if (res.error) {
      message.error("Error");
      return;
    }

    res.data = {
      ...res.data,
      startDate: res.data.startDate
        ? dayjs(res.data.startDate).format("YYYY-MM-DD")
        : null,
      endDate: res.data.endDate
        ? dayjs(res.data.endDate).format("YYYY-MM-DD")
        : null,
      createdAt: res.data.createdAt
        ? dayjs(res.data.createdAt).format("YYYY-MM-DD")
        : null,
      updatedAt: res.data.updatedAt
        ? dayjs(res.data.updatedAt).format("YYYY-MM-DD")
        : null,
    };

    setDiscount(res.data);
  };

  console.log(discount);

  return (
    <Modal
      title="Basic Modal"
      open={global.action.type === ActionType.VIEW && global.action.discount}
      footer={null}
      width={1000}
      onCancel={() => dispatch(setAction({}))}
    >
      <p>CODE: {discount.key}</p>
      <p>
        <Image
          width={200}
          height={200}
          className="rounded-lg"
          style={{ objectFit: "cover" }}
          alt={discount.name}
          src={`${appConfig.baseApiUrl}/uploads/${
            discount.Image || "no-data.png"
          }`}
        />
      </p>

      <p>Name: {discount.name}</p>
      <p>Value: {discount.value}</p>
      <p>Scope: {discount.scope}</p>
      <p>Promotion Type: {discount.promotionType}</p>

      <p>Discount Strategy: {discount.discountStrategy}</p>
      <p>Start Date: {discount.startDate}</p>
      <p>End Date: {discount.endDate}</p>
      <p>Status: {discount.status}</p>

      {/* <p>{discount.applicableProducts}</p>
      <p>{discount.applicableBrands}</p>
      <p>{discount.applicableCategories}</p> */}
    </Modal>
  );
}
