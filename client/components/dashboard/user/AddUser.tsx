/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
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
import { saveUser, updateUser } from "@/lib/apis/user";
import dayjs from "dayjs";

const AddUser = () => {
  const global = useSelector(selectGlobal);
  const { payload } = global.action;
  // hook
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const newData = { ...payload };
    if (newData.dob) newData.dob = dayjs(newData.dob);
    setFormData(newData);
    return () => {
      dispatch(setFormValues({}));
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log('newData:', newData)
      dispatch(setLoading({ save: true }));
      const result = newData.id
        ? await updateUser(newData)
        : await saveUser(newData);
      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        router.refresh();
        toast.success(
          `User ${newData?.id ? "Updated" : "Created"} Successfully`
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

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData.dob) newData.dob = dayjs(newData.dob);
    if (newData?.id) {
      form.setFieldsValue(newData);
      dispatch(setFormValues(newData));
    } else {
      form.resetFields();
      dispatch(setFormValues(form.getFieldsValue()));
    }
  };

  return (
    <Modal
      title={
        global.action.type === ActionType.UPDATE ? "Update User" : "Create User"
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
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "username is required",
                },
              ]}
            >
              <Input placeholder="Enter" />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "password is required",
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </div>
          <div className="col-span-1">
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  required: true,
                  message: "email is required",
                },
              ]}
            >
              <Input placeholder="Enter " />
            </Form.Item>
          </div>
          <div className='col-span-1'>
            <Form.Item name="type" label="Type">
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
                {["Customer", "Vendor", "Delivery Man", "Admin"].map(
                  (item, idx) => (
                    <Select.Option key={idx} value={item}>
                      {item}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item
              name="phone"
              label="Phone No"
              rules={[
                {
                  required: true,
                  message: "Phone is required",
                },
              ]}
            >
              <Input placeholder="Enter phone" />
            </Form.Item>
          </div>

          <div className="col-span-1">
            <Form.Item name="dob" label="Date of Brith">
              <DatePicker placeholder="Enter Birth day" />
            </Form.Item>
          </div>

          <div className='col-span-1'>
            <Form.Item
              hidden={!global.action.payload?.id}
              name="status"
              label="Status"
            >
              <Select
                showSearch
                allowClear
                placeholder="Select Status"
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
            onClick={() => resetFormData(global.action?.payload)}
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
            {global.action.payload?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddUser;
