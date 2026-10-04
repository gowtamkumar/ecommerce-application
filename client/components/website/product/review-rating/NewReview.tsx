"use client";
import { ActionType } from "@/constants/constants";
import { saveReview } from "@/lib/apis/review";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import {
  selectGlobal,
  setLoading,
  setProductRating,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, Modal, Rate, Select } from "antd";
import { useEffect } from "react";
import { FiEdit3, FiPackage, FiStar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const RATING_DESC = ["Terrible", "Poor", "Average", "Good", "Excellent"];

const NewReview = () => {
  const global = useSelector(selectGlobal);
  const { payload, type } = global.productRating || {};
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (payload) {
      form.setFieldsValue({
        id: payload.id,
        productId: payload.productId,
        rating: payload.rating || 5,
        comment: payload.comment || "",
      });
    }
    return () => {
      form.resetFields();
    };
  }, [form, payload]);

  const handleSubmit = async (values: any) => {
    const result = () => saveReview(values);
    await handleAsyncAction(result, dispatch);
    dispatch(setProductRating({}));
  };

  const handleClose = () => {
    dispatch(setProductRating({}));
    dispatch(setLoading({}));
  };

  const isModalOpen = type === ActionType.CREATE || type === ActionType.UPDATE;
  const isDirectProduct = Boolean(payload?.productId && payload?.product?.name);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-500 flex items-center justify-center shrink-0">
            <FiEdit3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {type === ActionType.UPDATE ? "Update Your Review" : "Write a Review"}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Share your honest feedback with other customers
            </p>
          </div>
        </div>
      }
      width={520}
      zIndex={1050}
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      centered
      className="rounded-3xl overflow-hidden"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        className="pt-4 space-y-4"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* Product Display or Selection */}
        {isDirectProduct ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reviewing Product
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-bold text-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FiPackage className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{payload.product.name}</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-semibold shrink-0">
                Selected
              </span>
            </div>
            <Form.Item name="productId" hidden>
              <Input />
            </Form.Item>
          </div>
        ) : (
          <Form.Item
            name="productId"
            label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Product</span>}
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Choose a product to review"
              size="large"
              className="w-full rounded-xl"
            >
              {(payload?.orderItems || []).map((item: any) => (
                <Select.Option key={item.productId} value={item.productId}>
                  {item.product?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Rating Field */}
        <Form.Item
          name="rating"
          label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Rating</span>}
          rules={[{ required: true, message: "Please select a rating" }]}
          initialValue={5}
        >
          <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Rate
              tooltips={RATING_DESC}
              className="text-amber-400 text-2xl"
            />
            <span className="text-xs font-semibold text-slate-500">
              Click a star to rate
            </span>
          </div>
        </Form.Item>

        {/* Comment Field */}
        <Form.Item
          name="comment"
          label={<span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Review</span>}
          rules={[
            { required: true, message: "Please write your review thoughts" },
            { min: 5, message: "Review must be at least 5 characters long" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="What did you like or dislike? How was the quality, fit, or performance?"
            className="rounded-2xl border-slate-200 p-3 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/10"
            showCount
            maxLength={1000}
          />
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            onClick={handleClose}
            className="rounded-full px-5 h-10 text-xs font-bold text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={global.loading?.save}
            loading={global.loading?.save}
            className="rounded-full px-6 h-10 text-xs font-bold bg-global-primary hover:bg-global-hover text-white shadow-md shadow-global-primary/25 border-none cursor-pointer"
          >
            {payload?.id ? "Update Review" : "Submit Review"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewReview;
