/* eslint-disable @next/next/no-img-element */
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { Button, Divider, Progress, Rate } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import NewReview from "./NewReview";

const RatingProduct = ({ product }: any) => {
  const dispatch = useDispatch();
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Ratings & Reviews</h3>
      <div className="md:flex gap-16 justify-between bg-white p-4 items-center">
        <div className="flex basis-2/3 items-center">
          <div>
            <p className="text-2xl font-bold">3.1</p>
            <Rate allowHalf defaultValue={2.5} disabled />
            <p>37 ratings</p>
          </div>
          <Divider
            type="vertical"
            style={{
              height: "100px",
            }}
          />
          <div>
            <Rate allowHalf defaultValue={1} disabled /> 12
            <br />
            <Rate allowHalf defaultValue={2} disabled /> 22
            <br />
            <Rate allowHalf defaultValue={3} disabled /> 33
            <br />
            <Rate allowHalf defaultValue={4} disabled /> 44
            <br />
            <Rate allowHalf defaultValue={5} disabled /> 100
            <br />
          </div>
        </div>
        <div className="basis-1/3">
          <p>Rate this product</p>
          <Rate allowHalf defaultValue={2.5} />
          <br />
          <Button
            type="primary"
            size="small"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                  payload: { productId: product.id },
                })
              )
            }
          >
            Write a Review
          </Button>
          <NewReview />
        </div>
      </div>
    </div>
  );
};

export default RatingProduct;
