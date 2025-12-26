"use client";
import { getProducts } from "@/lib/apis/admin/product";
import { saveReview, updateReview } from "@/lib/apis/review";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, Modal, Rate, Select, Tag } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

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
    const newValues = { ...values, rating: Number(values.rating) };
    const result = values.id
      ? () => updateReview(newValues)
      : () => saveReview(newValues);

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

  return (
    <Modal
      title={
        <span className="text-xl font-semibold">
          {type === ActionType.UPDATE ? "Update Review" : "Create Review"}
        </span>
      }
      width={600}
      zIndex={1050}
      open={
        review && (type === ActionType.CREATE || type === ActionType.UPDATE)
      }
      onCancel={handleClose}
      footer={
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={resetFormData} className="!rounded-lg">
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!bg-black hover:!bg-gray-800 !rounded-lg !px-8"
          >
            {payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
        className="mt-6"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="space-y-4">
          {/* Product Selection */}
          <Form.Item
            name="productId"
            label="Select Product"
            rules={[
              {
                required: true,
                message: "Product is required",
              },
            ]}
            className="!mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder="Search and select a product"
              size="large"
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

          {/* Rating */}
          <Form.Item
            name="rating"
            label="Rating"
            rules={[
              {
                required: true,
                message: "Rating is required",
              },
            ]}
            className="!mb-0"
          >
            <Rate allowHalf className="!text-2xl" />
          </Form.Item>

          {/* Comment */}
          <Form.Item
            name="comment"
            label="Review Comment"
            rules={[
              {
                required: true,
                message: "Comment is required",
              },
            ]}
            className="!mb-0"
          >
            <Input.TextArea
              placeholder="Enter review comment"
              rows={4}
              size="large"
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            name="status"
            label="Review Status"
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
            className="!mb-0"
          >
            <Select placeholder="Select status" size="large">
              <Select.Option value="Pending">
                <Tag color="gold" className="!mr-2">Pending</Tag>
                Pending
              </Select.Option>
              <Select.Option value="Approved">
                <Tag color="green" className="!mr-2">Approved</Tag>
                Approved
              </Select.Option>
              <Select.Option value="Rejected">
                <Tag color="red" className="!mr-2">Rejected</Tag>
                Rejected
              </Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddReview;
