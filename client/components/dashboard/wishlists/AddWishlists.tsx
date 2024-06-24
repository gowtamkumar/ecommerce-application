/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
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
import { GetProducts } from "@/lib/apis/product";
import { saveWishlist, updateWishlist } from "@/lib/apis/wishlist";

const AddWishlists = () => {
  const [products, setProducts] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const products = await GetProducts();
      console.log("🚀 ~ wishlists:", products);
      setProducts(products.data);
      const newData = { ...payload };
      setFormData(newData);
      return () => {
        dispatch(setFormValues({}));
        form.resetFields();
      };
    })();
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateWishlist(newData)
        : await saveWishlist(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        router.refresh();
        toast.success(
          `Wishlist ${newData?.id ? "Updated" : "Created"} Successfully`
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
          ? "Update Wishlist"
          : "Create Wishlist"
      }
      width={550}
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
        onValuesChange={(_v, values) => setFormValues(values)}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="grid gap-5">
          <div className="col-span-1">
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
                {(products || []).map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
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
      </Form>
    </Modal>
  );
};

export default AddWishlists;
