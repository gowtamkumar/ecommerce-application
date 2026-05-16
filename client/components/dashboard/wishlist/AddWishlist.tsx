import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Avatar } from "antd";
import { ActionType } from "../../../constants/constants";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { saveWishlist, updateWishlist } from "@/lib/apis/wishlist";
import { getProducts } from "@/lib/apis/admin/product";
import { getUsers } from "@/lib/apis/user";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { errorNotification } from "@/lib/utils/notification";
import { UserOutlined, PictureOutlined } from "@ant-design/icons";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

const AddWishlist = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const global = useSelector(selectGlobal);
  const { payload, type } = global.action;
  
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      // Fetch products and customers in parallel
      const [productRes, customerRes] = await Promise.all([
        getProducts(),
        getUsers(1, 1000, { role: "User" }) // Fetch a large batch of customers for the dropdown
      ]);
      
      if (productRes?.success) setProducts(productRes.data);
      if (customerRes?.success) setCustomers(customerRes.data);
      
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (type === ActionType.CREATE || type === ActionType.UPDATE) {
      fetchData();
      if (type === ActionType.UPDATE && payload) {
        form.setFieldsValue(payload);
      } else {
        form.resetFields();
      }
    }
  }, [fetchData, form, type, payload]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateWishlist(values)
      : () => saveWishlist(values);

    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
    form.resetFields();
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      title={type === ActionType.UPDATE ? "Update Wishlist" : "Create Wishlist Item"}
      width={600}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <Form
        {...layout}
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        className="mt-4"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="userId"
          label="Customer"
          rules={[{ required: true, message: "Please select a customer" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Search for a customer..."
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {customers.map((user) => (
              <Select.Option key={user.id} value={user.id} label={user.name}>
                <div className="flex items-center gap-2">
                  <Avatar size="small" src={user.image ? getUploadImageUrl(user.image) : undefined} icon={<UserOutlined />} />
                  <span>{user.name}</span>
                  <span className="text-gray-400 text-xs">({user.email})</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="productId"
          label="Product"
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Search for a product..."
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            {products.map((product) => (
              <Select.Option key={product.id} value={product.id} label={product.name}>
                <div className="flex items-center gap-2">
                  <Avatar shape="square" size="small" src={product.thumbnailImage ? getUploadImageUrl(product.thumbnailImage) : undefined} icon={<PictureOutlined />} />
                  <span>{product.name}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
          >
            {payload?.id ? "Update" : "Add to Wishlist"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddWishlist;
