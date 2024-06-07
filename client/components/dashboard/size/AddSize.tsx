/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ActionType } from "../../../constants/constants";
import { toast } from "react-toastify";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { saveSize, updateSize } from "@/lib/apis/size";

const AddSize = ({ action = {}, setAction }: any) => {
  const [formValues, setFormValues] = useState({} as any);
  const [loading, setLoading] = useState({} as any);

  // oparetion
  const { payload: data } = action;
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    const newData = { ...data };
    setFormData(newData);
    return () => {
      setFormValues({});
      form.resetFields();
    };
  }, [action]);

  const handleSubmit = async (values: any) => {
    try {
      let newData = { ...values };
      // return console.log('newData:', newData)
      console.log("newData:", newData);
      setLoading({ save: true });
      const result = newData.id
        ? await updateSize(newData)
        : await saveSize(newData);

      if (result.errorName) return toast.error(result.message);
      setTimeout(async () => {
        setLoading({ save: false });
        router.refresh();
        toast.success(
          `Size ${newData?.id ? "Updated" : "Created"} Successfully`
        );
        setAction({});
      }, 100);
    } catch (err) {
      console.log("", err);
    }
  };

  const handleClose = () => {
    setAction({});
    setLoading({});
  };

  const setFormData = (v: any) => {
    const newData = { ...v };
    form.setFieldsValue(newData);
    setFormValues(form.getFieldsValue());
  };

  const resetFormData = () => {
    form.resetFields();
    setFormValues(form.getFieldsValue());
  };

  return (
    <Modal
      title={action.type === ActionType.UPDATE ? "Update Size" : "Create Size"}
      width={500}
      zIndex={1050}
      open={
        action.type === ActionType.CREATE || action.type === ActionType.UPDATE
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

        <div className="my-5 flex items-start justify-between gap-4">
          <div className="grid flex-grow grid-cols-1 gap-5">
            <div className="col-span-1">
              <Form.Item
                name="name"
                className="mb-1"
                label="Size Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input placeholder="Enter Size Name" />
              </Form.Item>
            </div>
            <div className={`col-span-1 `}>
              <Form.Item
                hidden={!data?.id}
                name="status"
                label="Status"
                className="mb-1"
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
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
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
                loading={loading.save}
              >
                {formValues.id ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddSize;
