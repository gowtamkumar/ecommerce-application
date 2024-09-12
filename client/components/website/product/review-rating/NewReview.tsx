/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Rate, Select } from "antd";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setFormValues,
  setLoading,
  setProductRating,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveReview, updateReview } from "@/lib/apis/review";
import { ActionType } from "@/constants/constants";

const NewReview = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.productRating;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    setFormData(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.productRating]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));

      const result = newData.id
        ? await updateReview(newData)
        : await saveReview(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setProductRating({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleClose = () => {
    dispatch(setProductRating({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.productRating?.payload);
      dispatch(setFormValues(global.productRating?.payload));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <Modal
      title={
        global.productRating.type === ActionType.UPDATE
          ? "Update Review"
          : "New Review"
      }
      width={500}
      zIndex={1050}
      open={
        global.productRating.type === ActionType.CREATE ||
        global.productRating.type === ActionType.UPDATE
      }
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onValuesChange={(_v, values) => dispatch(setFormValues(values))}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="productId" hidden>
          <Input />
        </Form.Item>

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item name="rating" className="mb-1" label="Rating">
                <Rate />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item name="comment" className="mb-1" label="Comment">
                <Input.TextArea placeholder="Enter" />
              </Form.Item>
            </div>
            <div className="col-span-1 text-end">
              {/* <Button
                className="mx-2 capitalize"
                size="small"
                onClick={resetFormData}
              >
                Reset
              </Button> */}
              <Button
                size="small"
                color="blue"
                htmlType="submit"
                className="capitalize"
                loading={global.loading.save}
              >
                {payload?.id ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default NewReview;
