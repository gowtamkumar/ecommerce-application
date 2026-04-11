import { returnOrder } from "@/lib/apis/return";
import { getSettings } from "@/lib/apis/setting";
import { normFile } from "@/lib/utils/commonFunctions";
import { handleGlobalUpload } from "@/lib/utils/handleGlobalUpload";
import { errorNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
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

    // Transform fileList to array of filenames
    const images = values.images?.map((file: any) => file.fileName || file.name) || [];
    const submissionData = { ...values, images };

    const result = await returnOrder(submissionData);

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

        <Form.Item
          name="images"
          label="Proof Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            multiple
            customRequest={async (options) => {
              const res = await handleGlobalUpload({
                ...options,
                filename: "image",
              });
              if (res) {
                options.onSuccess?.(res.newFile);
              }
            }}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

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
