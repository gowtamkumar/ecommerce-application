import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveWishlist, updateWishlist } from "@/lib/apis/wishlist";
import { getProducts } from "@/lib/apis/admin/product";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";

const AddWishlist = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const categories = await getProducts();
      setProducts(categories.data);
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
    let newData = { ...values };

    const result = newData.id
      ? () => updateWishlist(newData)
      : () => saveWishlist(newData);

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
      dispatch(setAction({}));
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
      title={type === ActionType.UPDATE ? "Update Wishlist" : "Create Wishlist"}
      width={550}
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

        <Form.Item
          name="productId"
          label="Product"
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
            {(products || []).map((item: any, idx) => (
              <Select.Option key={idx} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
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

export default AddWishlist;
