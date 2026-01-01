"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Form, Input, Select, Switch, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader, FileUploadField, PreviewModal } from "./CommonComponents";

const { Title } = Typography;

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
                    <div className="space-y-4">
                        <SettingsHeader title="Search Engine Optimization" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item name="metaTitle" label={<span className="text-base font-medium">Meta Title</span>} className="!mb-0 uppercase" extra="50-60 characters recommended">
                                <Input size="large" placeholder="Your Store - Tagline" />
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
                                <Input size="large" placeholder="https://yourstore.com" />
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

                        <Divider className="!my-6" />
                        <Title level={5}>Advanced SEO & Scripts</Title>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="googleAnalyticsId" label={<span className="text-base font-medium">Google Analytics ID</span>} className="!mb-0">
                                <Input size="large" placeholder="G-XXXXXXXX" />
                            </Form.Item>
                            <Form.Item name="googleSearchConsoleId" label={<span className="text-base font-medium">Search Console ID</span>} className="!mb-0">
                                <Input size="large" placeholder="Verification ID" />
                            </Form.Item>
                            <Form.Item name="robotsTxt" label={<span className="text-base font-medium">Robots.txt</span>} className="md:col-span-2 !mb-0">
                                <Input.TextArea rows={3} size="large" placeholder="User-agent: *..." className="font-mono" />
                            </Form.Item>
                            <Form.Item name="headerCode" label={<span className="text-base font-medium">Header Code</span>} className="md:col-span-2 !mb-0" extra="Injected in <head>">
                                <Input.TextArea rows={3} size="large" placeholder="<!-- scripts -->" className="font-mono" />
                            </Form.Item>
                            <Form.Item name="bodyStartCode" label={<span className="text-base font-medium">Body Start Code</span>} className="md:col-span-2 !mb-0" extra="Injected after <body>">
                                <Input.TextArea rows={3} size="large" placeholder="<!-- scripts -->" className="font-mono" />
                            </Form.Item>
                            <Form.Item name="bodyEndCode" label={<span className="text-base font-medium">Body End Code</span>} className="md:col-span-2 !mb-0" extra="Injected before </body>">
                                <Input.TextArea rows={3} size="large" placeholder="<!-- scripts -->" className="font-mono" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Integrations Section */}
                    <div className="space-y-4">
                        <SettingsHeader title="Marketing Integrations" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <Divider className="!my-8" />

                    {/* Announcement Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <SettingsHeader title="Announcement Bar" />
                            <Form.Item name="announcementEnabled" valuePropName="checked" className="!mb-0"><Switch /></Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="announcementText" label={<span className="text-base font-medium">Message</span>} className="md:col-span-2 !mb-0">
                                <Input size="large" placeholder="20% OFF on all products!" />
                            </Form.Item>
                            <Form.Item name="announcementColor" label={<span className="text-base font-medium">Background Color</span>} className="!mb-0">
                                <Input type="color" className="h-12 w-full" />
                            </Form.Item>
                            <Form.Item name="announcementTextColor" label={<span className="text-base font-medium">Text Color</span>} className="!mb-0">
                                <Input type="color" className="h-12 w-full" />
                            </Form.Item>
                            <Form.Item name="announcementLink" label={<span className="text-base font-medium">Link URL</span>} className="md:col-span-2 !mb-0">
                                <Input size="large" placeholder="/shop" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Popup Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <SettingsHeader title="Marketing Popup" />
                            <Form.Item name="popupEnabled" valuePropName="checked" className="!mb-0"><Switch /></Form.Item>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="popupTitle" label={<span className="text-base font-medium">Popup Title</span>} className="!mb-0">
                                <Input size="large" placeholder="Subscribe now" />
                            </Form.Item>
                            <Form.Item name="popupDelay" label={<span className="text-base font-medium">Delay (ms)</span>} className="!mb-0">
                                <Input type="number" size="large" placeholder="5000" />
                            </Form.Item>
                            <Form.Item name="popupDescription" label={<span className="text-base font-medium">Description</span>} className="md:col-span-2 !mb-0">
                                <Input.TextArea rows={2} size="large" placeholder="Get updates and offers" />
                            </Form.Item>
                            <FileUploadField 
                                name="popupImage" 
                                label="Popup Image" 
                                fileList={global.setting?.marketing?.popupImagefileList || []}
                                aspect={1}
                                onFileUpdate={(fileList, fileName) => {
                                    const marketing = { ...global.setting.marketing, popupImagefileList: fileList, popupImage: fileName };
                                    dispatch(setSetting({ ...global.setting, marketing }));
                                    form.setFieldsValue({ popupImage: fileName, popupImagefileList: fileList });
                                }}
                            />
                            <Form.Item name="popupLink" label={<span className="text-base font-medium">Button Link</span>} className="!mb-0">
                                <Input size="large" placeholder="/join" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item className="!mb-0 !mt-8">
                        <Button type="primary" htmlType="submit" loading={loading} size="large" className="!bg-black hover:!bg-gray-800 !rounded-xl !h-11 !px-8 !font-medium">
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
