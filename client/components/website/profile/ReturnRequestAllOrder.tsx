import { returnOrder } from "@/lib/apis/return";
import { getSettings } from "@/lib/apis/setting";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const ReturnRequestAllOrder = () => {
  const [reasons, setReasons] = useState<string[]>([
    "Defective product",
    "Wrong item received",
    "Size/Fit issue",
    "Quality not as expected",
    "Changed my mind",
  ]);
  const global = useSelector(selectGlobal);
  const { payload, returnAllOrder, type } = global.action;
  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await getSettings();
      if (res.success && res.data?.returnSetting?.predefinedReasons) {
        setReasons(res.data.returnSetting.predefinedReasons);
      }
    };
    fetchSettings();

    form.setFieldsValue(payload);
    return () => {
      form.resetFields();
    };
  }, [global.action]);

  const handleSubmit = async (values: any) => {
    console.log("retur request all order", values);


    const result = await returnOrder(values);

    console.log("result", result);


    if (!result.success) {
      errorNotification({ message: result.message });
    }
    handleClose();
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
      title={`Order Return`}
      width={500}
      zIndex={1050}
      open={type === ActionType.UPDATE && returnAllOrder}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
      >
        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Return Reason"
          rules={[
            {
              required: true,
              message: "Return Reason is required",
            },
          ]}
        >
          <Select placeholder="Select Reason">
            {reasons.map((reason) => (
              <Select.Option key={reason} value={reason}>
                {reason}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="comments"
          label="Additional Comments (Optional)"
        >
          <Input.TextArea placeholder="Enter additional details..." rows={3} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            {
              required: true,
              message: "Phone is required",
            },
          ]}
        >
          <Input role="alert" placeholder="Enter Reason" />
        </Form.Item>

        <Form.List name="images">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name]}
                    label={index === 0 ? "Images (URLs)" : ""}
                    rules={[{ required: true, message: 'Missing image URL' }]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="Enter image URL" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Proof Image
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div className="text-end">
          <Button
            className="mx-2 capitalize"
            size="small"
            onClick={resetFormData}
          >
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.orderId}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ReturnRequestAllOrder;
