"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Rate, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveReview, updateReview } from "@/lib/apis/review";
import { getProducts } from "@/lib/apis/admin/product";
import { errorNotification } from "@/lib/utils/notification";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddReview = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload, type, review } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const products = await getProducts();
      setProducts(products.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    const newData = { ...global.action.payload };
    form.setFieldsValue(newData);
    fetchData();
    return () => {
      form.resetFields();
    };
  }, [fetchData, form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateReview(values)
      : () => saveReview(values);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(payload);
    } else {
      form.resetFields();
    }
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Review" : "Create Review"}
      width={500}
      zIndex={1050}
      open={
        review && (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
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

        <Form.Item name="productId" label="Product">
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
            {(products || []).map(
              ({ name, id }: { name: string; id: number }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              )
            )}
          </Select>
        </Form.Item>

        <Form.Item name="rating" label="Rating">
          <Rate allowHalf />
        </Form.Item>

        <Form.Item name="comment" label="Comment">
          <Input.TextArea placeholder="Enter" />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select placeholder="Select">
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
            <Select.Option value="Approved">Approved</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <div className="flex gap-2">
            <Button size="small" onClick={resetFormData}>
              Reset
            </Button>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              disabled={global.loading.save}
              loading={global.loading.save}
            >
              {payload?.id ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddReview;
