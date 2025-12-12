"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { discountStatusUpdate } from "@/lib/apis/discount";
import { useRouter } from "next/navigation";
import { ActionType } from "@/constants/constants";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function DiscountStatusUpdate() {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const value = { ...global.action.payload };
  const route = useRouter();
  
  useEffect(() => {
    form.setFieldsValue({ id: value.id });
    setSelectedStatus(""); // Reset selection when modal opens
  }, [form, value.id]);

  const handleSubmit = async () => {
    if (!value.id || !selectedStatus) return;

    setLoading(true);

    try {
      const result = await discountStatusUpdate({ 
        id: value.id, 
        status: selectedStatus 
      });

      if (!result.success) return;

      form.resetFields();
      setSelectedStatus("");
      dispatch(setAction({}));
      route.push("/dashboard/discounts");
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    {
      value: "Active",
      label: "Active",
      icon: <FiCheckCircle className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-400",
      textColor: "text-green-700",
    },
    {
      value: "Inactive",
      label: "Inactive",
      icon: <FiXCircle className="w-8 h-8" />,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      hoverColor: "hover:border-red-400",
      textColor: "text-red-700",
    },
  ];

  return (
    <Modal
      open={global.action.type === ActionType.UPDATE}
      footer={null}
      width={500}
      onCancel={() => {
        setSelectedStatus("");
        dispatch(setAction({}));
      }}
      closeIcon={null}
      centered
      style={{ padding: 0 }}
      bodyStyle={{ padding: 0, borderRadius: "16px" }}
    >
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h3 className="text-xl font-bold mb-1">Update Status</h3>
          <p className="text-white/80 text-sm">Select the new status for this discount</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedStatus(option.value)}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300
                    ${selectedStatus === option.value 
                      ? `${option.borderColor} ${option.bgColor} shadow-lg scale-105` 
                      : `border-gray-200 bg-white hover:shadow-md ${option.hoverColor}`
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  {selectedStatus === option.value && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                        <FiCheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`
                    flex justify-center mb-3
                    ${selectedStatus === option.value ? option.textColor : 'text-gray-400'}
                  `}>
                    {option.icon}
                  </div>

                  {/* Label */}
                  <div className={`
                    text-center font-semibold text-sm
                    ${selectedStatus === option.value ? option.textColor : 'text-gray-600'}
                  `}>
                    {option.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="large"
                className="flex-1"
                onClick={() => {
                  setSelectedStatus("");
                  dispatch(setAction({}));
                }}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="flex-1"
                type="primary"
                htmlType="submit"
                disabled={!selectedStatus}
                loading={loading}
              >
                Update Status
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
