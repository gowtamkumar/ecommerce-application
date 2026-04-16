import { ColumnWidthOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Switch } from "antd";
import { useEffect } from "react";
import { ActionType } from "../../../constants/constants";
import { saveSize, updateSize } from "@/lib/apis/size";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";

const AddSize = () => {
  const global = useSelector(selectGlobal);
  const { payload, size, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(global.action.payload);
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = values.id
      ? () => updateSize(values)
      : () => saveSize(values);

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
        <Space className="text-xl font-semibold">
          <ColumnWidthOutlined className="text-blue-500" />
          <span>{type === ActionType.UPDATE ? "Update Size" : "Create Size"}</span>
        </Space>
      }
      width={500}
      zIndex={1050}
      open={size && (type === ActionType.CREATE || type === ActionType.UPDATE)}
      onCancel={handleClose}
      centered
      maskClosable={false}
      forceRender
      footer={
        <div className="flex justify-end gap-3 pt-4">
          <Button size="large" onClick={resetFormData} style={{ borderRadius: "var(--button-border-radius)" }}>
            Reset
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={() => form.submit()}
            disabled={global.loading.save}
            loading={global.loading.save}
            className="!px-8"
            style={{ 
              borderRadius: "var(--button-border-radius)",
              backgroundColor: "var(--global-primary)"
            }}
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

        <div className="space-y-6">
          <Form.Item
            name="name"
            label="Size Name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
            className="!mb-0"
          >
            <Input placeholder="Enter size name (e.g., S, M, L, XL)" size="large" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
            className="!mb-0"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddSize;
