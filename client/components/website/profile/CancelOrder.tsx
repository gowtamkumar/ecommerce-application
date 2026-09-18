"use client";

import { orderStatusUpdateApi } from "@/lib/apis/orders";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import {
    selectGlobal,
    setAction,
    setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const CancelOrder = () => {
  const global = useSelector(selectGlobal);
  const { payload, cancelOrder, type } = global.action;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (global.action.payload) {
      form.setFieldsValue(global.action.payload);
    }
    return () => {
      form.resetFields();
    };
  }, [form, global.action]);

  const handleSubmit = async (values: any) => {
    const result = () => values.id && orderStatusUpdateApi(values);
    await handleAsyncAction(result, dispatch);
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2.5 text-gray-900 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <FiAlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              Cancel Order
            </h3>
            <p className="text-[11px] font-normal text-gray-400">
              Please tell us why you want to cancel this order
            </p>
          </div>
        </div>
      }
      width={480}
      zIndex={1050}
      open={type === ActionType.UPDATE && cancelOrder}
      onCancel={handleClose}
      footer={null}
      centered
      className="premium-modal"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        scrollToFirstError={true}
        className="pt-3"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="status" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="cancelResson"
          label={
            <span className="text-xs font-semibold text-gray-700">
              Cancellation Reason <span className="text-rose-500">*</span>
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please provide a reason for cancellation",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="e.g., Ordered by mistake, found a better price, shipping took too long..."
            className="!rounded-xl !p-3 resize-none !border-gray-200 focus:!border-rose-400"
          />
        </Form.Item>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 mt-6">
          <Button
            className="!h-10 !px-5 !rounded-xl !font-semibold !text-xs !border-gray-200 hover:!bg-gray-50"
            onClick={handleClose}
          >
            Keep Order
          </Button>
          <Button
            danger
            type="primary"
            htmlType="submit"
            loading={global.loading.save}
            disabled={!payload?.id}
            className="!h-10 !px-5 !rounded-xl !font-semibold !text-xs !bg-rose-600 hover:!bg-rose-700 !border-none"
          >
            Confirm Cancellation
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CancelOrder;
