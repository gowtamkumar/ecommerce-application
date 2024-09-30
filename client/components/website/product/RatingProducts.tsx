import { ActionType } from "@/constants/constants";
import { setProductRating } from "@/redux/features/global/globalSlice";
import { Button, Divider, Rate } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import NewReview from "./review-rating/NewReview";

const RatingProduct = ({ product, productRating }: any) => {
  const dispatch = useDispatch();
  const { totalReview, rating1, rating2, rating3, rating4, rating5 } =
    productRating;
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Ratings & Reviews</h3>
      <div className="md:flex gap-16 justify-between bg-white p-4 items-center">
        <div className="flex basis-2/3 items-center">
          <div>
            <p className="text-2xl font-bold">
              {(
                (totalReview || 0) / (product?.reviews?.length || 0) || 0
              ).toFixed(1)}
            </p>
            <Rate
              allowHalf
              value={(totalReview || 0) / (product?.reviews?.length || 0) || 0}
              disabled
            />
            <p>{product?.reviews?.length || 0} ratings</p>
          </div>
          <Divider
            type="vertical"
            style={{
              height: "100px",
            }}
          />
          <div>
            <Rate allowHalf defaultValue={1} disabled /> {rating1}
            <br />
            <Rate allowHalf defaultValue={2} disabled /> {rating2}
            <br />
            <Rate allowHalf defaultValue={3} disabled /> {rating3}
            <br />
            <Rate allowHalf defaultValue={4} disabled /> {rating4}
            <br />
            <Rate allowHalf defaultValue={5} disabled /> {rating5}
          </div>
        </div>
        {/* <div className="basis-1/3">
          <p>Rate this product</p>
          <Rate defaultValue={2.5} disabled />
          <br />
          <Button
            type="primary"
            size="small"
            disabled={!product.enableReview}
            onClick={() =>
              dispatch(
                setProductRating({
                  type: ActionType.CREATE,
                  productRating: true,
                  payload: { productId: product.id },
                })
              )
            }
          >
            Write a Review
          </Button>
          <NewReview />
        </div> */}
      </div>
    </div>
  );
};

export default RatingProduct;
