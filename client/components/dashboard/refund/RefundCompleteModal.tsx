"use client";
import { completeRefund } from "@/lib/apis/refund";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Form, Input, Modal, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

const RefundCompleteModal: React.FC = () => {
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const refundData = global.action && global.action.refund ? global.action.payload : null;
  const isModalOpen = !!(global.action && global.action.refund);

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  const handleCancel = () => {
    dispatch(setAction(null));
  };

  const onFinish = async (values: any) => {
    if (!refundData) return;

    dispatch(setLoading({ save: true }));
    try {
      const res = await completeRefund(refundData.id, values);
      if (res.success) {
        successNotification({ message: "Refund marked as completed successfully!" });
        dispatch(setAction({ action: "REFUND_COMPLETED" })); // Trigger refresh
      } else {
        errorNotification({ message: res.message || "Failed to complete refund" });
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  return (
    <Modal
      title="Complete Manual Refund"
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={global.loading?.save}
      okText="Confirm Refund"
      okButtonProps={{
        className: "bg-green-600 hover:!bg-green-700",
        disabled: global.loading?.save
      }}
      destroyOnClose
    >
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex justify-between mb-2">
          <Text type="secondary">Customer:</Text>
          <Text strong>{refundData?.user?.name || "N/A"}</Text>
        </div>
        <div className="flex justify-between mb-2">
          <Text type="secondary">Order Tracking:</Text>
          <Text strong className="text-blue-600">#{refundData?.order?.trackingNo || "N/A"}</Text>
        </div>
        <div className="flex justify-between pt-2 border-t border-blue-200 mt-2">
          <Text type="secondary">Refund Amount:</Text>
          <Text strong className="text-red-600 text-lg">{refundData?.amount}</Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ transactionId: "", note: "" }}
      >
        <Form.Item
          name="transactionId"
          label="Manual Transaction ID / Reference"
          rules={[{ required: true, message: "Please enter the manual transaction ID" }]}
          extra="Enter the reference ID from your bank transfer, Bkash, Nagad, etc."
        >
          <Input placeholder="e.g. TRNX1234567890" />
        </Form.Item>

        <Form.Item
          name="note"
          label="Notes (Optional)"
        >
          <Input.TextArea
            placeholder="Add any specific details about the manual payment..."
            rows={3}
          />
        </Form.Item>
      </Form>

      <div className="bg-orange-50 p-3 rounded border border-orange-100 mt-2">
        <Text type="warning" className="text-xs">
          <strong>Important:</strong> Ensure the money has been successfully sent to the customer before confirming. This action will update the order's refund status.
        </Text>
      </div>
    </Modal>
  );
};

export default RefundCompleteModal;
