"use client";

import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import {
    ClockCircleOutlined,
    EditOutlined, LinkOutlined,
    NotificationOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    TagOutlined
} from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Switch, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUploadField, PreviewModal, SettingsHeader } from "./CommonComponents";

const { Title, Text } = Typography;

const MarketingAndSeo = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const initialData = React.useMemo(() => ({
        id: global.setting?.id,
        ...global.setting?.marketing,
        ...global.setting?.seo,
    }), [global.setting]);

    useEffect(() => {
        form.setFieldsValue(initialData);
    }, [form, initialData]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        const { id, ...rest } = values;

        // Exhaustive lists of fields for each object
        const marketingFields = [
            'facebookPixelId', 'googleAdsId', 'mailchimpApiKey', 'mailchimpListId',
            'announcementEnabled', 'announcementText', 'announcementColor', 'announcementTextColor', 'announcementLink',
            'popupEnabled', 'popupTitle', 'popupDelay', 'popupDescription', 'popupImage', 'popupLink'
        ];

        const seoFields = [
            'metaTitle', 'metaDescription', 'metaKeywords', 'metaImage',
            'ogType', 'twitterCard', 'canonicalUrl', 'googleAnalyticsId', 'googleSearchConsoleId',
            'robotsTxt', 'headerCode', 'bodyStartCode', 'bodyEndCode'
        ];

        const marketing: any = {};
        const seo: any = {};

        Object.keys(rest).forEach(key => {
            if (marketingFields.includes(key)) marketing[key] = rest[key];
            else if (seoFields.includes(key)) seo[key] = rest[key];
        });

        const payload = { id, marketing, seo };

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
            <SettingsHeader
                title="Marketing & SEO"
                description="Manage your store's marketing integrations and search engine optimizations"
            />

            <Card className="shadow-sm border border-gray-100 rounded-2xl">
                <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" scrollToFirstError>
                    <Form.Item name="id" hidden><Input /></Form.Item>

                    {/* SEO Section */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <SettingsHeader title="Search Engine Optimization" description="Enhance how your store appears in search engine results and social media shares." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.Item name="metaTitle" label={<span className="text-base font-medium">Meta Title</span>} className="!mb-0 uppercase" extra="50-60 characters recommended">
                                    <Input size="large" prefix={<TagOutlined className="text-gray-400 mr-2" />} placeholder="Your Store - Tagline" />
                                </Form.Item>
                                <Form.Item name="metaKeywords" label={<span className="text-base font-medium">Meta Keywords</span>} className="!mb-0">
                                    <Select mode="tags" size="large" placeholder="Add keywords" />
                                </Form.Item>
                                <Form.Item name="metaDescription" label={<span className="text-base font-medium">Meta Description</span>} className="md:col-span-2 !mb-0" extra="150-160 characters recommended">
                                    <Input.TextArea rows={3} size="large" placeholder="Shop the best products online..." />
                                </Form.Item>
                                <FileUploadField
                                    name="metaImage"
                                    label="Social Share Image (OG)"
                                    fileList={global.setting?.seo?.metaImagefileList || []}
                                    extra="Recommended: 1200x630px"
                                    aspect={1200 / 630}
                                    onFileUpdate={(fileList, fileName) => {
                                        const seo = { ...global.setting.seo, metaImagefileList: fileList, metaImage: fileName };
                                        dispatch(setSetting({ ...global.setting, seo }));
                                        form.setFieldsValue({ metaImage: fileName, metaImagefileList: fileList });
                                    }}
                                />
                                <Form.Item name="canonicalUrl" label={<span className="text-base font-medium">Canonical URL</span>} className="!mb-0">
                                    <Input size="large" prefix={<LinkOutlined className="text-gray-400 mr-2" />} placeholder="https://yourstore.com" />
                                </Form.Item>
                                <Form.Item name="ogType" label={<span className="text-base font-medium">OG Type</span>} className="!mb-0">
                                    <Select size="large">
                                        <Select.Option value="website">Website</Select.Option>
                                        <Select.Option value="article">Article</Select.Option>
                                        <Select.Option value="product">Product</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="twitterCard" label={<span className="text-base font-medium">Twitter Card</span>} className="!mb-0">
                                    <Select size="large">
                                        <Select.Option value="summary">Summary</Select.Option>
                                        <Select.Option value="summary_large_image">Summary with Large Image</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>

                        </div>

                        <div className="space-y-4">
                            <SettingsHeader title="Tracking & Advanced SEO" description="Integrate core Google tools and manage robot visibility rules." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.Item name="googleAnalyticsId" label={<span className="text-base font-medium">Google Analytics ID</span>} className="!mb-0">
                                    <Input size="large" prefix={<SearchOutlined className="text-gray-400 mr-2" />} placeholder="G-XXXXXXXX" />
                                </Form.Item>
                                <Form.Item name="googleSearchConsoleId" label={<span className="text-base font-medium">Search Console ID</span>} className="!mb-0">
                                    <Input size="large" prefix={<SafetyCertificateOutlined className="text-gray-400 mr-2" />} placeholder="Verification ID" />
                                </Form.Item>
                                <Form.Item name="robotsTxt" label={<span className="text-base font-medium">Robots.txt Configuration</span>} className="md:col-span-2 !mb-0">
                                    <Input.TextArea rows={3} size="large" placeholder="User-agent: *..." className="font-mono bg-white" />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SettingsHeader title="Custom Scripts Injection" description="Inject dynamic scripts directly into the DOM (e.g. tracking pixels)." />
                            <div className="grid grid-cols-1 gap-6 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                <Form.Item name="headerCode" label={<span className="text-base font-medium">Header Code</span>} className="!mb-0" extra="Injected in <head>">
                                    <Input.TextArea rows={3} size="large" placeholder="<!-- Header scripts -->" className="font-mono bg-white" />
                                </Form.Item>
                                <Form.Item name="bodyStartCode" label={<span className="text-base font-medium">Body Start Code</span>} className="!mb-0" extra="Injected right after opening <body>">
                                    <Input.TextArea rows={3} size="large" placeholder="<!-- Body Start scripts -->" className="font-mono bg-white" />
                                </Form.Item>
                                <Form.Item name="bodyEndCode" label={<span className="text-base font-medium">Body End Code</span>} className="!mb-0" extra="Injected right before closing </body>">
                                    <Input.TextArea rows={3} size="large" placeholder="<!-- Body End scripts -->" className="font-mono bg-white" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Integrations Section */}
                        <div className="space-y-4">
                            <SettingsHeader title="Marketing Integrations" description="Manage connections to advertising and email marketing platforms." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-6 rounded-xl border border-blue-100">
                                <Form.Item name="facebookPixelId" label={<span className="text-base font-medium">Facebook Pixel ID</span>} className="!mb-0">
                                    <Input size="large" placeholder="Pixel ID" />
                                </Form.Item>
                                <Form.Item name="googleAdsId" label={<span className="text-base font-medium">Google Ads ID</span>} className="!mb-0">
                                    <Input size="large" placeholder="Ads ID" />
                                </Form.Item>
                                <Form.Item name="mailchimpApiKey" label={<span className="text-base font-medium">Mailchimp API Key</span>} className="!mb-0">
                                    <Input.Password size="large" placeholder="API Key" />
                                </Form.Item>
                                <Form.Item name="mailchimpListId" label={<span className="text-base font-medium">Mailchimp List ID</span>} className="!mb-0">
                                    <Input size="large" placeholder="List ID" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Announcement Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <SettingsHeader title="Announcement Bar" description="Broadcast promotions globally at the top of your store site." />
                                <Form.Item name="announcementEnabled" valuePropName="checked" className="!mb-0"><Switch /></Form.Item>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-yellow-50/50 p-6 rounded-xl border border-yellow-100">
                                <Form.Item name="announcementText" label={<span className="text-base font-medium">Message</span>} className="md:col-span-2 !mb-0">
                                    <Input size="large" prefix={<NotificationOutlined className="text-yellow-600 mr-2" />} placeholder="20% OFF on all products!" />
                                </Form.Item>
                                <Form.Item name="announcementColor" label={<span className="text-base font-medium">Background Color</span>} className="!mb-0">
                                    <Input type="color" className="h-12 w-full cursor-pointer p-1 rounded-md" />
                                </Form.Item>
                                <Form.Item name="announcementTextColor" label={<span className="text-base font-medium">Text Color</span>} className="!mb-0">
                                    <Input type="color" className="h-12 w-full cursor-pointer p-1 rounded-md" />
                                </Form.Item>
                                <Form.Item name="announcementLink" label={<span className="text-base font-medium">Link URL</span>} className="md:col-span-2 !mb-0">
                                    <Input size="large" prefix={<LinkOutlined className="text-gray-400 mr-2" />} placeholder="https://example.com/shop" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Popup Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <SettingsHeader title="Marketing Popup" description="Configure an interruptive popup to capture leads or drive sales." />
                                <Form.Item name="popupEnabled" valuePropName="checked" className="!mb-0"><Switch /></Form.Item>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50/30 p-6 rounded-xl border border-purple-100">
                                <div className="space-y-6 md:col-span-1">
                                    <Form.Item name="popupTitle" label={<span className="text-base font-medium">Popup Title</span>} className="!mb-0">
                                        <Input size="large" prefix={<EditOutlined className="text-purple-500 mr-2" />} placeholder="Subscribe now" />
                                    </Form.Item>
                                    <Form.Item name="popupDelay" label={<span className="text-base font-medium">Appearance Delay (ms)</span>} className="!mb-0" extra="Wait time before showing (e.g., 5000 = 5 seconds)">
                                        <Input type="number" size="large" prefix={<ClockCircleOutlined className="text-purple-500 mr-2" />} placeholder="5000" />
                                    </Form.Item>
                                    <Form.Item name="popupLink" label={<span className="text-base font-medium">Button Link Target</span>} className="!mb-0">
                                        <Input size="large" prefix={<LinkOutlined className="text-purple-500 mr-2" />} placeholder="https://example.com/join" />
                                    </Form.Item>
                                </div>

                                <div className="space-y-6 md:col-span-1">
                                    <Form.Item name="popupDescription" label={<span className="text-base font-medium">Description</span>} className="!mb-0">
                                        <Input.TextArea rows={3} size="large" placeholder="Sign up for updates and exclusive offers" />
                                    </Form.Item>
                                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                                        <FileUploadField
                                            name="popupImage"
                                            label="Popup Cover Image"
                                            fileList={global.setting?.marketing?.popupImagefileList || []}
                                            aspect={1}
                                            onFileUpdate={(fileList, fileName) => {
                                                const marketing = { ...global.setting.marketing, popupImagefileList: fileList, popupImage: fileName };
                                                dispatch(setSetting({ ...global.setting, marketing }));
                                                form.setFieldsValue({ popupImage: fileName, popupImagefileList: fileList });
                                            }}
                                        />
                                    </div>
                                </div>
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
                            Save Marketing & SEO
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <PreviewModal />
        </div>
    );
};

export default MarketingAndSeo;
