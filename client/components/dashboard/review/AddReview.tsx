/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Rate, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setAction,
  setFormValues,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveReview, updateReview } from "@/lib/apis/review";
import { getProducts } from "@/lib/apis/product";

const AddReview = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      setFormData(newData);
      const products = await getProducts();
      setProducts(products.data);
      return () => {
        dispatch(setFormValues({}));
        form.resetFields();
      };
    })();
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log('newData:', newData)
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateReview(newData)
        : await saveReview(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        
        toast.success(
          `Review ${newData?.id ? "Updated" : "Created"} Successfully`
        );
        dispatch(setAction({}));
      }, 100);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    dispatch(setFormValues(form.getFieldsValue()));
  };

  const resetFormData = () => {
    if (payload?.id) {
      form.setFieldsValue(global.action?.payload);
      dispatch(setFormValues(global.action?.payload));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE
          ? "Update Review"
          : "Create Review"
      }
      width={500}
      zIndex={1050}
      open={
        global.action.type === ActionType.CREATE ||
        global.action.type === ActionType.UPDATE
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

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item name="productId" label="Product" className="mb-1">
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
            </div>

            <div className="col-span-1">
              <Form.Item name="rating" className="mb-1" label="Rating">
                <Rate allowHalf />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item name="comment" className="mb-1" label="Comment">
                <Input.TextArea placeholder="Enter" />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item name="status" label="Status" className="mb-1">
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
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Rejected">Rejected</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1 text-end">
              <Button
                className="mx-2 capitalize"
                size="small"
                onClick={resetFormData}
              >
                Reset
              </Button>
              <Button
                size="small"
                color="blue"
                htmlType="submit"
                className="capitalize"
                loading={global.loading.save}
              >
                {payload?.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddReview;
