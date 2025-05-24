import appConfig from "@/appConfig";
import { ActionType } from "@/constants/constants";
import { getDiscountDetails } from "@/lib/apis/discount";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { message, Modal, Spin } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscountProduct from "./DiscountProduct";

export default function DiscountDetails() {
  const [loading, setLoading] = React.useState(false);
  const [discount, setDiscount] = React.useState<any>({});
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
    const res = await getDiscountDetails(id);
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
    setLoading(false);
  }, [value.id]);
  
  useEffect(() => {
    featchData();
  }, [featchData]);

  return (
    <Modal
      title="Discount Details"
      open={global.action.type === ActionType.VIEW && global.action.discount}
      footer={null}
      width={1000}
      onCancel={() => dispatch(setAction({}))}
    >
      {loading ? (
        <Spin className="flex justify-center items-center" />
      ) : (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Image
                width={200}
                height={200}
                className="rounded-lg"
                style={{ objectFit: "cover" }}
                alt={discount.name}
                src={`${appConfig.baseApiUrl}/uploads/${
                  discount.image || "no-data.png"
                }`}
              />
            </div>
            <div>
              <p className="text-sm">Created At: {discount.createdAt}</p>
              <p>Code: {discount.key}</p>

              <p>Name: {discount.name}</p>
              <p>
                Value: {+discount.discountValue}
                {discount.discountStrategy === "Percentage" ? "%" : "BDT"}
              </p>
              <p>Scope: {discount.scope}</p>
              <p>Promotion Type: {discount.promotionType}</p>
              <p>Start Date: {discount.startDate}</p>
              <p>End Date: {discount.endDate}</p>
              <p>Status: {discount.status}</p>
            </div>
          </div>
          <DiscountProduct discount={discount} />
        </div>
      )}
    </Modal>
  );
}
