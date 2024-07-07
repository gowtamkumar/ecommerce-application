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
  TreeSelect,
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
import {
  getAllCategories,
  getCategories,
  saveCategory,
  updateCategory,
} from "@/lib/apis/categories";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const newData = { ...payload };
      const categories = await getCategories();
      console.log("🚀 ~ newData:", newData)
      setCategories(categories.data);
      setFormData(newData);
    })();

    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log("newData:", newData);
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateCategory(newData)
        : await saveCategory(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        toast.success(
          `Category ${newData?.id ? "Updated" : "Created"} Successfully`
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
          ? "Update Category"
          : "Create Category"
      }
      width={850}
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

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <Form.Item
              name="name"
              label="name"
              rules={[
                {
                  required: true,
                  message: "name is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="parentId" label="parent">
            
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  // value={value}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder="Please select"
                  allowClear
                  treeDefaultExpandAll
                  // onChange={onChange}
                  treeData={categories}
                  // onPopupScroll={onPopupScroll}
                />

                {/* <Select.Option value={false}>Inactive</Select.Option> */}
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="description" label="Description">
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="image" label="Image">
              <Input placeholder="Enter " />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              hidden={!payload?.id}
              name="status"
              label="Status"
              className="mb-1"
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
                <Select.Option value={"Active"}>Active</Select.Option>
                <Select.Option value={"Inactive"}>Inactive</Select.Option>
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

export default AddCategory;
