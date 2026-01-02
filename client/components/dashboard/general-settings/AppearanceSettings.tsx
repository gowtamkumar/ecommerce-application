import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Form, Input, InputNumber, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader, FileUploadField, PreviewModal } from "./CommonComponents";

const fontOptions = [
    { label: "Poppins (Default)", value: "var(--font-poppins)" },
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Outfit", value: "Outfit, sans-serif" },
    { label: "System Sans", value: "system-ui, -apple-system, sans-serif" },
];

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
        ...global.setting?.appearance,
    }), [global.setting]);

    useEffect(() => {
        const defaultValues = {
            primaryFont: "var(--font-poppins)",
            secondaryFont: "var(--font-poppins)",
            baseFontSize: 16,
            pSize: 16,
            h1Size: 48,
            h2Size: 36,
            h3Size: 24,
            buttonFontSize: 14,
            buttonBorderRadius: 8,
            buttonFontWeight: 500,
            buttonPaddingVertical: 8,
            buttonPaddingHorizontal: 16,
            buttonPrimaryColor: "",
            buttonHoverColor: "",
            primaryColor: "#F7AA0E",
            primaryHoverColor: "#e59a0d",
            secondaryColor: "#000000",
            successColor: "#52c41a",
            warningColor: "#faad14",
            errorColor: "#ff4d4f",
            infoColor: "#1890ff",
            backgroundColor: "#ffffff",
            cardBackgroundColor: "#ffffff",
            inputPaddingVertical: 8,
            inputPaddingHorizontal: 12,
            inputBorderRadius: 8,
            inputBorderColor: "#d9d9d9",
            linkColor: "#F7AA0E",
            accentColor: "#F7AA0E",
            iconColor: "#1f2937",
            iconHoverColor: "#F7AA0E",
            iconBackgroundColor: "#F7AA0E",
            iconHoverBackgroundColor: "rgba(0,0,0,0.05)",
            iconSize: 18,
            topBarBg: "#000000",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#1f2937",
            footerBg: "#0f172a",
            footerText: "#ffffff",
            textColor: "#1f2937",
            ...initialData
        };
        form.setFieldsValue(defaultValues);
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
            primaryFont,
            secondaryFont,
            baseFontSize,
            pSize,
            h1Size,
            h2Size,
            h3Size,
            buttonFontSize,
            buttonBorderRadius,
            buttonFontWeight,
            buttonPaddingVertical,
            buttonPaddingHorizontal,
            buttonPrimaryColor,
            buttonHoverColor,
            primaryColor,
            primaryHoverColor,
            secondaryColor,
            successColor,
            warningColor,
            errorColor,
            infoColor,
            backgroundColor,
            cardBackgroundColor,
            inputPaddingVertical,
            inputPaddingHorizontal,
            inputBorderRadius,
            inputBorderColor,
            linkColor,
            accentColor,
            iconColor,
            iconHoverColor,
            iconBackgroundColor,
            iconHoverBackgroundColor,
            iconSize,
            topBarBg,
            topBarText,
            headerBg,
            headerText,
            footerBg,
            footerText,
            textColor,
        } = values;

        const payload = {
            id,
            headerOption: { leftText },
            footerOption: { copyRight, image },
            socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
            appearance: {
                primaryFont,
                secondaryFont,
                baseFontSize,
                pSize,
                h1Size,
                h2Size,
                h3Size,
                buttonFontSize,
                buttonBorderRadius,
                buttonFontWeight,
                buttonPaddingVertical,
                buttonPaddingHorizontal,
                buttonPrimaryColor,
                buttonHoverColor,
                primaryColor,
                primaryHoverColor,
                secondaryColor,
                successColor,
                warningColor,
                errorColor,
                infoColor,
                backgroundColor,
                cardBackgroundColor,
                inputPaddingVertical,
                inputPaddingHorizontal,
                inputBorderRadius,
                inputBorderColor,
                linkColor,
                accentColor,
                iconColor,
                iconHoverColor,
                iconBackgroundColor,
                iconHoverBackgroundColor,
                iconSize,
                topBarBg,
                topBarText,
                headerBg,
                headerText,
                footerBg,
                footerText,
                textColor,
            }
        };

        try {
            const res = id
                ? await updateSetting(payload)
                : await saveSetting(payload);

            if (!res?.success) {
                return errorNotification({ message: res?.message || "Operation failed" });
            }

            successNotification({ message: res.message });
            // Update global state with new settings
            dispatch(setSetting(res.data));
        } catch (error: any) {
            errorNotification({
                message: error?.response?.data?.message || error?.message || "Unexpected error",
            });
        } finally {
            setLoading(false);
            dispatch(setAction({}));
        }
    };

    return (
        <div className="space-y-6">
            <SettingsHeader 
                title="Appearance Settings" 
                description="Manage your website's colors, typography, branding, and social media integrations" 
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

                    {/* Color Palette Section */}
                    <div className="space-y-6">
                        <SettingsHeader title="Brand Color Palette" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item
                                name="primaryColor"
                                label={<span className="text-base font-medium">Primary Color</span>}
                                extra="Main theme color (buttons, accents)"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="secondaryColor"
                                label={<span className="text-base font-medium">Secondary Color</span>}
                                extra="Secondary brand color"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item 
                                name="primaryHoverColor"
                                label={<span className="text-base font-medium">Hover Color</span>}
                                extra="Color when interacting with items"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="successColor"
                                label={<span className="text-base font-medium">Success Color</span>}
                                extra="For success states/messages"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="warningColor"
                                label={<span className="text-base font-medium">Warning Color</span>}
                                extra="For warning states/messages"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="errorColor"
                                label={<span className="text-base font-medium">Error Color</span>}
                                extra="For error states/messages"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="infoColor"
                                label={<span className="text-base font-medium">Info Color</span>}
                                extra="For informational states"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                             <Form.Item
                                name="backgroundColor"
                                label={<span className="text-base font-medium">Page Background</span>}
                                extra="Main site background color"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                             <Form.Item
                                name="cardBackgroundColor"
                                label={<span className="text-base font-medium">Card Background</span>}
                                extra="Background for cards/containers"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                           
                            <Form.Item
                                name="textColor"
                                label={<span className="text-base font-medium">Default Text Color</span>}
                                extra="Color for standard paragraph text"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            
                            <Form.Item
                                name="linkColor"
                                label={<span className="text-base font-medium">Link Color</span>}
                                extra="Color for hyperlinks"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="accentColor"
                                label={<span className="text-base font-medium">Accent Color</span>}
                                extra="Secondary accent color"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                             <Form.Item
                                name="iconColor"
                                label={<span className="text-base font-medium">Global Icon Color</span>}
                                extra="Default color for icons"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="iconHoverColor"
                                label={<span className="text-base font-medium">Icon Hover Color</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Layout Component Colors Section */}
                    <div className="space-y-6">
                        <SettingsHeader title="Layout Component Colors" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item
                                name="topBarBg"
                                label={<span className="text-base font-medium">Top Bar Background</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="topBarText"
                                label={<span className="text-base font-medium">Top Bar Text</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="headerBg"
                                label={<span className="text-base font-medium">Header Background</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="headerText"
                                label={<span className="text-base font-medium">Header Navigation Text</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="footerBg"
                                label={<span className="text-base font-medium">Footer Background</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="footerText"
                                label={<span className="text-base font-medium">Footer Text</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Icon Settings Section */}
                    <div className="space-y-6">
                        <SettingsHeader title="Icon & Ornament Settings" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item 
                                name="iconSize" 
                                label={<span className="text-base font-medium">Base Icon Size (px)</span>}
                                extra="Default scaling for icons"
                            >
                                <InputNumber size="large" className="w-full" min={12} max={48} />
                            </Form.Item>

                            

                            
                            <Form.Item
                                name="iconBackgroundColor"
                                label={<span className="text-base font-medium">Icon Background</span>}
                            >
                                <Input  type="color" className="h-10 w-full p-1 cursor-pointer" placeholder="transparent or #hex" />
                            </Form.Item>
                            <Form.Item
                                name="iconHoverBackgroundColor"
                                label={<span className="text-base font-medium">Icon Hover Background</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" placeholder="rgba(0,0,0,0.05) or #hex" />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

                    {/* Typography & Global Styles */}
                    <div className="space-y-6">
                        <SettingsHeader title="Typography & Global Styles" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Form.Item
                                name="primaryFont"
                                label={<span className="text-base font-medium">Primary Font (Headings)</span>}
                                extra="Used for headings and prominent text"
                            >
                                <Select size="large" options={fontOptions} />
                            </Form.Item>

                            <Form.Item
                                name="secondaryFont"
                                label={<span className="text-base font-medium">Secondary Font (Body)</span>}
                                extra="Used for body text and descriptions"
                            >
                                <Select size="large" options={fontOptions} />
                            </Form.Item>

                            <Form.Item
                                name="baseFontSize"
                                label={<span className="text-base font-medium">Global Scale (Base px)</span>}
                                extra="Scales everything site-wide (rem context)"
                            >
                                <InputNumber size="large" className="w-full" min={10} max={24} />
                            </Form.Item>

                            <Form.Item
                                name="pSize"
                                label={<span className="text-base font-medium">Paragraph font size (px)</span>}
                                extra="Specifically for standard body/paragraph text"
                            >
                                <InputNumber size="large" className="w-full" min={10} max={30} />
                            </Form.Item>


                        </div>

                        <Divider className="!my-8" />

                        {/* Button & Interactive Settings */}
                        <SettingsHeader title="Buttons & Interactivity" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item name="buttonFontSize" label={<span className="text-base font-medium">Text Size (px)</span>}>
                                <InputNumber size="large" className="w-full" min={10} max={20} />
                            </Form.Item>
                            <Form.Item name="buttonBorderRadius" label={<span className="text-base font-medium">Border Radius (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={50} />
                            </Form.Item>
                            <Form.Item name="buttonFontWeight" label={<span className="text-base font-medium">Font Weight</span>}>
                                <Select size="large" options={[
                                    { label: "Regular (400)", value: 400 },
                                    { label: "Medium (500)", value: 500 },
                                    { label: "Semi Bold (600)", value: 600 },
                                    { label: "Bold (700)", value: 700 },
                                ]} />
                            </Form.Item>
                            <Form.Item name="buttonPaddingVertical" label={<span className="text-base font-medium">Vertical Padding (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={30} />
                            </Form.Item>
                            <Form.Item name="buttonPaddingHorizontal" label={<span className="text-base font-medium">Horizontal Padding (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={60} />
                            </Form.Item>
                            <Form.Item name="buttonPaddingHorizontal" label={<span className="text-base font-medium">Horizontal Padding (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={60} />
                            </Form.Item>
                             <Form.Item
                                name="buttonPrimaryColor"
                                label={<span className="text-base font-medium">Button Primary Color</span>}
                                extra="Override global primary color"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                            <Form.Item
                                name="buttonHoverColor"
                                label={<span className="text-base font-medium">Button Hover Color</span>}
                                extra="Override global hover color"
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                        </div>

                        <Divider className="!my-8" />

                        {/* Input Field Settings */}
                        <SettingsHeader title="Input Fields (Forms)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item name="inputPaddingVertical" label={<span className="text-base font-medium">Vertical Padding (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={30} />
                            </Form.Item>
                            <Form.Item name="inputPaddingHorizontal" label={<span className="text-base font-medium">Horizontal Padding (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={60} />
                            </Form.Item>
                             <Form.Item name="inputBorderRadius" label={<span className="text-base font-medium">Border Radius (px)</span>}>
                                <InputNumber size="large" className="w-full" min={0} max={50} />
                            </Form.Item>
                             <Form.Item
                                name="inputBorderColor"
                                label={<span className="text-base font-medium">Default Border Color</span>}
                            >
                                <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                            </Form.Item>
                        </div>


                        <Divider plain><span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Heading Sizes</span></Divider>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item name="h1Size" label={<span className="text-sm font-medium">H1 size (px)</span>}>
                                <InputNumber size="large" className="w-full" min={24} max={100} />
                            </Form.Item>
                            <Form.Item name="h2Size" label={<span className="text-sm font-medium">H2 size (px)</span>}>
                                <InputNumber size="large" className="w-full" min={20} max={80} />
                            </Form.Item>
                            <Form.Item name="h3Size" label={<span className="text-sm font-medium">H3 size (px)</span>}>
                                <InputNumber size="large" className="w-full" min={16} max={60} />
                            </Form.Item>
                        </div>
                    </div>

                    <Divider className="!my-8" />

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
                            className="!h-11 !px-8 !font-medium"
                            style={{ borderRadius: "var(--button-border-radius)" }}
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
