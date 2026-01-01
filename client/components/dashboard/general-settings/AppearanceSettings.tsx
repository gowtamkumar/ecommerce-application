"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader, FileUploadField, PreviewModal } from "./CommonComponents";

const AppearanceSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const initialData = React.useMemo(() => ({
        id: global.setting?.id,
        ...global.setting?.headerOption,
        ...global.setting?.footerOption,
        ...global.setting?.socialLink,
    }), [global.setting]);

    useEffect(() => {
        form.setFieldsValue(initialData);
    }, [form, initialData]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const {
            id,
            leftText,
            copyRight,
            image,
            facebookUrl,
            instagramUrl,
            linkedinUrl,
            twitterUrl,
        } = values;

        const payload = {
            id,
            headerOption: { leftText },
            footerOption: { copyRight, image },
            socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
        };

        try {
            const res = id
                ? await updateSetting(payload)
                : await saveSetting(payload);

            if (!res?.success) {
                return errorNotification({ message: res?.message || "Operation failed" });
            }

            successNotification({ message: res.message });
        } catch (error: any) {
            errorNotification({
                message: error?.response?.data?.message || error?.message || "Unexpected error",
            });
        } finally {
            setLoading(false);
            dispatch(setSetting({}));
            dispatch(setAction({}));
        }
    };

    return (
        <div className="space-y-6">
            <SettingsHeader 
                title="Appearance Settings" 
                description="Manage your website's header text, footer copyright, and social media integrations" 
            />

            <Card className="shadow-sm border border-gray-100 rounded-2xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                    scrollToFirstError
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    {/* Header Section */}
                    <div className="space-y-4">
                        <SettingsHeader title="Header Branding" />
                        <Form.Item
                            name="leftText"
                            label={<span className="text-base font-medium">Header Left Text</span>}
                            rules={[{ required: true, message: "Header text is required" }]}
                            extra="Text displayed at the top left of the website"
                            className="!mb-0"
                        >
                            <Input size="large" placeholder="Welcome to our store!" className="max-w-xl" />
                        </Form.Item>
                    </div>

                    <Divider className="!my-8" />

                    {/* Footer Section */}
                    <div className="space-y-4">
                        <SettingsHeader title="Footer Branding" />
                        <Form.Item
                            name="copyRight"
                            label={<span className="text-base font-medium">Copyright Text</span>}
                            rules={[{ required: true, message: "Copyright text is required" }]}
                            className="!mb-0"
                        >
                            <Input size="large" placeholder="© 2024 Your Store. All rights reserved." className="max-w-xl" />
                        </Form.Item>

                        <div className="pt-4">
                            <FileUploadField 
                                name="image" 
                                label="Payment Methods Image" 
                                fileList={global.setting?.footerOption?.fileList || []}
                                extra="Upload an image showing accepted payment methods"
                                aspect={2}
                                onFileUpdate={(fileList, fileName) => {
                                    const footerOption = { ...global.setting.footerOption, fileList, image: fileName };
                                    dispatch(setSetting({ ...global.setting, footerOption }));
                                    form.setFieldsValue({ image: fileName, fileList });
                                }}
                            />
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Social Media Section */}
                    <div className="space-y-4">
                        <SettingsHeader title="Social Media Connect" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="facebookUrl"
                                label={<span className="text-base font-medium">Facebook URL</span>}
                                className="!mb-0"
                            >
                                <Input size="large" placeholder="https://facebook.com/yourstore" />
                            </Form.Item>
                            <Form.Item
                                name="instagramUrl"
                                label={<span className="text-base font-medium">Instagram URL</span>}
                                className="!mb-0"
                            >
                                <Input size="large" placeholder="https://instagram.com/yourstore" />
                            </Form.Item>
                            <Form.Item
                                name="linkedinUrl"
                                label={<span className="text-base font-medium">LinkedIn URL</span>}
                                className="!mb-0"
                            >
                                <Input size="large" placeholder="https://linkedin.com/company/yourstore" />
                            </Form.Item>
                            <Form.Item
                                name="twitterUrl"
                                label={<span className="text-base font-medium">Twitter URL</span>}
                                className="!mb-0"
                            >
                                <Input size="large" placeholder="https://twitter.com/yourstore" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item className="!mb-0 !mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium"
                        >
                            Save Appearance Settings
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <PreviewModal />
        </div>
    );
};

export default AppearanceSettings;
