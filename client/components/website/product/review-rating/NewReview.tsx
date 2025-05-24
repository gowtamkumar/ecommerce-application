"use client";
import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Rate, Select } from "antd";
import {
  selectGlobal,
  setLoading,
  setProductRating,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveReview } from "@/lib/apis/review";
import { ActionType } from "@/constants/constants";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const NewReview = () => {
  const global = useSelector(selectGlobal);
  const { payload, type } = global.productRating;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...global.productRating.payload };
    form.setFieldsValue(newData);
    return () => {
      form.resetFields();
    };
  }, [form, global.productRating]);

  const handleSubmit = async (values: any) => {
    const result = () => saveReview(values);

    await handleAsyncAction(result, dispatch);
    dispatch(setProductRating({}));
  };

  const handleClose = () => {
    dispatch(setProductRating({}));
    dispatch(setLoading({}));
  };

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 7, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Review" : "New Review"}
      width={500}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="rating" className="mb-1" label="Rating">
          <Rate />
        </Form.Item>

        <Form.Item
          name="productId"
          label="Product"
          className="mb-1"
          rules={[
            {
              required: true,
              message: "Product is required",
            },
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as any)
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {(payload?.orderItems || []).map((item: any) => (
              <Select.Option key={item.productId} value={item.productId}>
                {item.product.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="comment" className="mb-1" label="Comment">
          <Input.TextArea placeholder="Enter" />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            disabled={global.loading.save}
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewReview;
