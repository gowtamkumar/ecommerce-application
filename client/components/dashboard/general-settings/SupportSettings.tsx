"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, Divider, Empty, Form, Input, InputNumber, Typography } from "antd";
import { 
    CaretRightOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined,
    WalletOutlined, RollbackOutlined, SafetyCertificateOutlined, FileProtectOutlined,
    WhatsAppOutlined, MessageOutlined, CarOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader } from "./CommonComponents";

// const { Panel } = Collapse;

const SupportSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const initialData = React.useMemo(() => ({
        id: global.setting?.id,
        ...global.setting?.helpSupport,
        ...global.setting?.whatsAppWidget,
        faq: global.setting?.faq || [],
        orderFreeShippingAmount: global.setting?.orderFreeShippingAmount,
    }), [global.setting]);

    useEffect(() => {
        form.setFieldsValue(initialData);
    }, [form, initialData]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const { id, faq, phone, message, orderFreeShippingAmount, ...helpSupportFields } = values;

        const payload = {
            id,
            faq,
            orderFreeShippingAmount,
            whatsAppWidget: { phone, message },
            helpSupport: {
                cashDelivery: helpSupportFields.cashDelivery,
                returnSupport: helpSupportFields.returnSupport,
                originalProduct: helpSupportFields.originalProduct,
                guarantee: helpSupportFields.guarantee,
            },
        };

        try {
            const res = id ? await updateSetting(payload) : await saveSetting(payload);
            if (!res?.success) return errorNotification({ message: res?.message || "Operation failed" });
            successNotification({ message: res.message });
        } catch (error: any) {
            errorNotification({ message: error?.message || "Unexpected error" });
        } finally {
            setLoading(false);
            dispatch(setSetting({}));
            dispatch(setAction({}));
        }
    };

    return (
        <div className="space-y-6">
            <SettingsHeader title="Support & FAQ" description="Manage your store's customer support options and frequently asked questions" />

            <Card className="shadow-sm border border-gray-100 rounded-2xl">
                <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" scrollToFirstError>
                    <Form.Item name="id" hidden><Input /></Form.Item>

                    <div className="space-y-10">
                        {/* Help & Support Features */}
                        <div className="space-y-4">
                            <SettingsHeader title="Store Promises & Badges" description="Configure the core guarantees displayed to customers (e.g., in the footer)." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.Item name="cashDelivery" label={<span className="text-base font-medium">Cash on Delivery</span>} className="!mb-0" extra="e.g. Pay on arrival">
                                    <Input size="large" prefix={<WalletOutlined className="text-gray-400 mr-1" />} placeholder="Enter text" />
                                </Form.Item>
                                <Form.Item name="returnSupport" label={<span className="text-base font-medium">Return Policy</span>} className="!mb-0" extra="e.g. 7-day easy returns">
                                    <Input size="large" prefix={<RollbackOutlined className="text-gray-400 mr-1" />} placeholder="Enter text" />
                                </Form.Item>
                                <Form.Item name="originalProduct" label={<span className="text-base font-medium">Product Authenticity</span>} className="!mb-0" extra="e.g. 100% Genuine">
                                    <Input size="large" prefix={<SafetyCertificateOutlined className="text-gray-400 mr-1" />} placeholder="Enter text" />
                                </Form.Item>
                                <Form.Item name="guarantee" label={<span className="text-base font-medium">Guarantee/Warranty</span>} className="!mb-0" extra="e.g. 1 Year Warranty">
                                    <Input size="large" prefix={<FileProtectOutlined className="text-gray-400 mr-1" />} placeholder="Enter text" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* WhatsApp Section */}
                        <div className="space-y-4">
                            <SettingsHeader title="WhatsApp Live Chat" description="Configure the floating WhatsApp chat widget for instant customer support." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-green-50/30 p-6 rounded-xl border border-green-100">
                                <Form.Item name="phone" label={<span className="text-base font-medium">WhatsApp Number</span>} className="!mb-0" extra="Format: 8801700000000 (No '+')">
                                    <Input size="large" prefix={<WhatsAppOutlined className="text-green-500 mr-1" />} placeholder="880..." />
                                </Form.Item>
                                <Form.Item name="message" label={<span className="text-base font-medium">Default Message</span>} className="!mb-0" extra="Pre-filled text when customers click the widget">
                                    <Input size="large" prefix={<MessageOutlined className="text-green-500 mr-1" />} placeholder="Hi, I have a query about..." />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Order & Shipping Section */}
                        <div className="space-y-4">
                            <SettingsHeader title="Shipping Configurations" description="Set up threshold rules for order shipping capabilities." />
                            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.Item
                                  name="orderFreeShippingAmount"
                                  label={<span className="text-base font-medium">Free Shipping Threshold</span>}
                                  className="!mb-0 max-w-sm"
                                  extra="Orders above this cart subtotal will automatically get free shipping."
                                >
                                  <InputNumber
                                    size="large"
                                    placeholder="e.g. 500"
                                    className="!w-full"
                                    min={0}
                                    addonBefore={<CarOutlined className="text-gray-400" />}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  />
                                </Form.Item>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <SettingsHeader title="Frequently Asked Questions" description="Build out your knowledge base to help customers instantly." />
                                <Form.List name="faq">
                                    {(_, { add }) => (
                                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} className="text-global-primary border-global-primary/30">
                                            Add New FAQ
                                        </Button>
                                    )}
                                </Form.List>
                            </div>

                            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.List name="faq">
                                    {(fields, { remove }) => (
                                        fields.length === 0 ? (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No FAQs added yet. Click 'Add New FAQ' above." className="my-8" />
                                        ) : (
                                            <Collapse 
                                                accordion 
                                                className="bg-white border border-gray-200 overflow-hidden shadow-sm" 
                                                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                                items={fields.map(({ key, name, ...restField }) => ({
                                                    key: key.toString(),
                                                    label: <span className="font-medium text-gray-800">Q{name + 1}: {form.getFieldValue(['faq', name, 'question']) || 'New Question'}</span>,
                                                    extra: <DeleteOutlined className="text-red-400 hover:text-red-600 transition-colors" onClick={(e) => { e.stopPropagation(); remove(name); }} />,
                                                    children: (
                                                        <div className="pt-3 pb-1 border-t border-gray-100">
                                                            <Form.Item {...restField} name={[name, "question"]} label="Question Title" rules={[{ required: true, message: "Question cannot be empty" }]}>
                                                                <Input placeholder="E.g., How long does delivery take?" size="large" prefix={<QuestionCircleOutlined className="text-gray-400 mr-2" />} className="bg-gray-50" />
                                                            </Form.Item>
                                                            <Form.Item {...restField} name={[name, "answer"]} label="Detailed Answer" rules={[{ required: true, message: "Answer cannot be empty" }]} className="!mb-0">
                                                                <Input.TextArea rows={4} placeholder="Write a highly descriptive answer..." className="bg-gray-50" />
                                                            </Form.Item>
                                                        </div>
                                                    )
                                                }))}
                                            />
                                        )
                                    )}
                                </Form.List>
                            </div>
                        </div>
                    </div>

                    <Form.Item className="!mb-0 !mt-8">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
                            size="large" 
                            className="!h-11 !px-8 !font-medium"
                            style={{ 
                                borderRadius: "var(--button-border-radius)",
                                backgroundColor: "var(--global-primary)"
                            }}
                        >
                            Save Support & FAQ
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SupportSettings;
