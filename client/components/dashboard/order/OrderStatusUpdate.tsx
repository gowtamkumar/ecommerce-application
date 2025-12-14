import { orderStatusUpdateApi } from "@/lib/apis/orders";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ShoppingOutlined, TruckOutlined } from "@ant-design/icons";
import { Button, Form, Modal, Radio, Space, Tag, Timeline } from "antd";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../constants/constants";

const OrderStatusUpdate = () => {
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { payload, type } = global.action;

  console.log(payload);

  const fetchData = useCallback(async () => {
    try {
      form.setFieldsValue(payload);
    } catch (err: any) {
      errorNotification({ message: err.message });
    }
  }, [payload, form]);

  useEffect(() => {
    fetchData();
  }, [fetchData, global.action]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));

    try {
      const res = await orderStatusUpdateApi(values);

      if (!res?.success) {
        errorNotification({ message: res?.message || "Operation failed" });
        return null;
      }

      dispatch(setAction({}));
      successNotification({ message: res.message });
      return res;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      errorNotification({ message: errorMessage });
      return null;
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleClose = () => {
    dispatch(setAction({}));
    dispatch(setLoading({}));
  };

  const orderStatuses = [
    {
      value: "Pending",
      label: "Pending",
      color: "orange",
      icon: <ClockCircleOutlined />,
      description: "Order received, awaiting processing"
    },
    {
      value: "Processing",
      label: "Processing",
      color: "blue",
      icon: <ShoppingOutlined />,
      description: "Order is being prepared"
    },
    {
      value: "Shipped",
      label: "Shipped",
      color: "cyan",
      icon: <TruckOutlined />,
      description: "Order has been dispatched"
    },
    {
      value: "Delivered",
      label: "Delivered",
      color: "green",
      icon: <CheckCircleOutlined />,
      description: "Order successfully delivered"
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      color: "red",
      icon: <CloseCircleOutlined />,
      description: "Order has been cancelled"
    },
  ];

  const currentStatus = Form.useWatch('status', form);


  console.log(currentStatus);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <TruckOutlined className="text-xl text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">
              Update Order Status
            </h3>
            <p className="text-sm text-gray-500 m-0">
              Change the current status of order #{payload?.orderId || payload?.id}
            </p>
          </div>
        </div>
      }
      width={650}
      zIndex={1050}
      open={type === ActionType.CREATE || type === ActionType.UPDATE}
      onCancel={handleClose}
      footer={null}
      className="modern-modal"
      styles={{
        header: { borderBottom: 'none', paddingBottom: 0 },
        body: { paddingTop: 24 }
      }}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
        className="modern-form"
      >
        <Form.Item name="id" hidden>
          <input type="hidden" />
        </Form.Item>

        {/* Current Order Info */}
        {payload && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Order ID:</span>
                <span className="ml-2 font-semibold text-gray-900">#{payload.orderId || payload.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Current Status:</span>
                <Tag color={orderStatuses.find(s => s.value === payload.status)?.color || 'default'} className="ml-2">
                  {payload.status || 'N/A'}
                </Tag>
              </div>
            </div>
          </div>
        )}

        {/* Status Selection */}
        <Form.Item
          name="status"
          label={<span className="font-semibold text-gray-700">Select New Status</span>}
          rules={[
            {
              required: true,
              message: "Please select a status",
            },
          ]}
        >
          <Radio.Group className="w-full">
            <Space direction="vertical" className="w-full" size="middle">
              {orderStatuses.map((status) => (
                <Radio
                  key={status.value}
                  value={status.value}
                  className="w-full"
                >
                  <div className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`text-${status.color}-600 text-lg`}>
                        {status.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{status.label}</div>
                        <div className="text-xs text-gray-500">{status.description}</div>
                      </div>
                    </div>
                    <Tag color={status.color}>{status.label}</Tag>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        {/* Status Timeline Preview */}
        {currentStatus && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
            <h4 className="font-semibold text-gray-700 mb-4">Order Status Timeline</h4>
            <Timeline
              items={orderStatuses.map((status, index) => {
                const currentIndex = orderStatuses.findIndex(s => s.value === currentStatus);
                const isCompleted = index <= currentIndex;
                const isCurrent = status.value === currentStatus;

                return {
                  color: isCurrent ? status.color : (isCompleted ? 'green' : 'gray'),
                  dot: status.icon,
                  children: (
                    <div className={isCurrent ? 'font-semibold' : ''}>
                      <span className={isCurrent ? 'text-blue-600' : 'text-gray-700'}>
                        {status.label}
                      </span>
                      {isCurrent && (
                        <Tag color={status.color} className="ml-2">Current</Tag>
                      )}
                    </div>
                  ),
                };
              })}
            />
          </div>
        )}

        {/* Warning for Cancelled Status */}
        {currentStatus === 'Cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <CloseCircleOutlined className="text-red-600 text-lg mt-0.5" />
              <div>
                <h5 className="font-semibold text-red-800 mb-1">Warning</h5>
                <p className="text-sm text-red-700">
                  Cancelling this order will restore the product stock and may trigger a refund process.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            size="large"
            onClick={handleClose}
            className="rounded-lg"
          >
            Cancel
          </Button>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            disabled={global.loading.save}
            loading={global.loading.save}
            className="rounded-lg min-w-[140px]"
            icon={<CheckCircleOutlined />}
          >
            Update Status
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        .modern-modal .ant-modal-header {
          padding: 24px 24px 0 !important;
        }

        .modern-form .ant-form-item-label > label {
          height: auto !important;
        }

        .ant-radio-wrapper {
          width: 100% !important;
        }

        .ant-timeline-item-head {
          background-color: transparent !important;
        }
      `}</style>
    </Modal>
  );
};

export default OrderStatusUpdate;
