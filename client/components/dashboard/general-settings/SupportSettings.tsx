"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, Divider, Empty, Form, Input, Typography } from "antd";
import { CaretRightOutlined, DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader } from "./CommonComponents";

const { Panel } = Collapse;

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
    }), [global.setting]);

    useEffect(() => {
        form.setFieldsValue(initialData);
    }, [form, initialData]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const { id, faq, phone, message, ...helpSupportFields } = values;

        const payload = {
            id,
            faq,
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

                    {/* Help & Support Features */}
                    <div className="space-y-4">
                        <SettingsHeader title="Support Features" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="cashDelivery" label={<span className="text-base font-medium">Cash on Delivery</span>} className="!mb-0" extra="e.g. Pay on arrival">
                                <Input size="large" placeholder="Enter text" />
                            </Form.Item>
                            <Form.Item name="returnSupport" label={<span className="text-base font-medium">Return Policy</span>} className="!mb-0" extra="e.g. 7-day easy returns">
                                <Input size="large" placeholder="Enter text" />
                            </Form.Item>
                            <Form.Item name="originalProduct" label={<span className="text-base font-medium">Product Authenticity</span>} className="!mb-0" extra="e.g. 100% Genuine">
                                <Input size="large" placeholder="Enter text" />
                            </Form.Item>
                            <Form.Item name="guarantee" label={<span className="text-base font-medium">Guarantee/Warranty</span>} className="!mb-0" extra="e.g. 1 Year Warranty">
                                <Input size="large" placeholder="Enter text" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* WhatsApp Section */}
                    <div className="space-y-4">
                        <SettingsHeader title="WhatsApp Integration" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="phone" label={<span className="text-base font-medium">WhatsApp Number</span>} className="!mb-0" extra="Format: 8801700000000">
                                <Input size="large" placeholder="880..." />
                            </Form.Item>
                            <Form.Item name="message" label={<span className="text-base font-medium">Default Message</span>} className="!mb-0" extra="Pre-filled customer message">
                                <Input size="large" placeholder="Hi, I have a query about..." />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* FAQ Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <SettingsHeader title="Frequently Asked Questions" />
                            <Form.List name="faq">
                                {(_, { add }) => (
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="middle">
                                        Add Question
                                    </Button>
                                )}
                            </Form.List>
                        </div>

                        <Form.List name="faq">
                            {(fields, { remove }) => (
                                fields.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No FAQs added" />
                                ) : (
                                    <Collapse accordion className="bg-white border-none space-y-3" expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Panel key={key} header={`Q${name + 1}: ${form.getFieldValue(['faq', name, 'question']) || 'New Question'}`} extra={<DeleteOutlined onClick={() => remove(name)} />}>
                                                <div className="pt-2">
                                                    <Form.Item {...restField} name={[name, "question"]} label="Question" rules={[{ required: true }]}>
                                                        <Input placeholder="Enter question" size="large" prefix={<QuestionCircleOutlined />} />
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[name, "answer"]} label="Answer" rules={[{ required: true }]}>
                                                        <Input.TextArea rows={4} placeholder="Enter detailed answer" />
                                                    </Form.Item>
                                                </div>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                )
                            )}
                        </Form.List>
                    </div>

                    <Form.Item className="!mb-0 !mt-8">
                        <Button type="primary" htmlType="submit" loading={loading} size="large" className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium">
                            Save Support & FAQ
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SupportSettings;
