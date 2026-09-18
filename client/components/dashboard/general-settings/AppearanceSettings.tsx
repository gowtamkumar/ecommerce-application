import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import {
    BgColorsOutlined,
    FontSizeOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, InputNumber, Select, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileUploadField, PreviewModal, SettingsHeader } from "./CommonComponents";

const fontOptions = [
    { label: "Poppins (Default)", value: "var(--font-poppins)" },
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Roboto", value: "Roboto, sans-serif" },
    { label: "Outfit", value: "Outfit, sans-serif" },
    { label: "System Sans", value: "system-ui, -apple-system, sans-serif" },
];

const THEME_PRESETS = [
    {
        name: "Classic Amber",
        description: "Warm gold accent with clean slate footer",
        preview: { primary: "#F7AA0E", secondary: "#000000", header: "#ffffff", footer: "#0f172a" },
        values: {
            primaryColor: "#F7AA0E",
            primaryHoverColor: "#e59a0d",
            secondaryColor: "#000000",
            backgroundColor: "#ffffff",
            textColor: "#1f2937",
            topBarBg: "#0f172a",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#1f2937",
            footerBg: "#0f172a",
            footerText: "#ffffff",
            buttonBorderRadius: 8,
        },
    },
    {
        name: "Nordic Minimal",
        description: "Sleek slate and monochrome aesthetic",
        preview: { primary: "#18181b", secondary: "#71717a", header: "#ffffff", footer: "#18181b" },
        values: {
            primaryColor: "#18181b",
            primaryHoverColor: "#27272a",
            secondaryColor: "#71717a",
            backgroundColor: "#ffffff",
            textColor: "#18181b",
            topBarBg: "#18181b",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#18181b",
            footerBg: "#18181b",
            footerText: "#ffffff",
            buttonBorderRadius: 8,
        },
    },
    {
        name: "Emerald Luxe",
        description: "Rich botanical green with gold highlights",
        preview: { primary: "#059669", secondary: "#064e3b", header: "#ffffff", footer: "#064e3b" },
        values: {
            primaryColor: "#059669",
            primaryHoverColor: "#047857",
            secondaryColor: "#064e3b",
            backgroundColor: "#ffffff",
            textColor: "#064e3b",
            topBarBg: "#064e3b",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#064e3b",
            footerBg: "#064e3b",
            footerText: "#ffffff",
            buttonBorderRadius: 8,
        },
    },
    {
        name: "Cobalt Tech",
        description: "Vibrant royal blue and high-contrast dark accents",
        preview: { primary: "#2563eb", secondary: "#1e3a8a", header: "#ffffff", footer: "#0f172a" },
        values: {
            primaryColor: "#2563eb",
            primaryHoverColor: "#1d4ed8",
            secondaryColor: "#1e3a8a",
            backgroundColor: "#ffffff",
            textColor: "#1e293b",
            topBarBg: "#1e3a8a",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#1e293b",
            footerBg: "#0f172a",
            footerText: "#ffffff",
            buttonBorderRadius: 8,
        },
    },
    {
        name: "Warm Charcoal",
        description: "Neutral charcoal with soft amber accent",
        preview: { primary: "#d97706", secondary: "#1c1917", header: "#ffffff", footer: "#1c1917" },
        values: {
            primaryColor: "#d97706",
            primaryHoverColor: "#b45309",
            secondaryColor: "#1c1917",
            backgroundColor: "#ffffff",
            textColor: "#1c1917",
            topBarBg: "#1c1917",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#1c1917",
            footerBg: "#1c1917",
            footerText: "#ffffff",
            buttonBorderRadius: 8,
        },
    },
];

const TYPE_SCALE_PRESET = {
    headingWeight: 600,
    typeDisplay: 48,
    typeH1: 36,
    typeH2: 28,
    typeH3: 20,
    typeBody: 16,
    typeBodySm: 14,
    typeCaption: 12,
    typeOverline: 11,
};

const AppearanceSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const handleApplyPreset = (preset: (typeof THEME_PRESETS)[0]) => {
        form.setFieldsValue(preset.values);
        successNotification({ message: `Applied "${preset.name}" preset` });
    };

    const handleApplyTypeScale = () => {
        form.setFieldsValue(TYPE_SCALE_PRESET);
        successNotification({ message: "Applied recommended type scale" });
    };

    const initialData = React.useMemo(
        () => ({
            id: global.setting?.id,
            ...global.setting?.headerOption,
            ...global.setting?.footerOption,
            ...global.setting?.socialLink,
            ...global.setting?.appearance,
        }),
        [global.setting]
    );

    useEffect(() => {
        form.setFieldsValue({
            primaryFont: "var(--font-poppins)",
            secondaryFont: "var(--font-poppins)",
            baseFontSize: 16,
            headingWeight: 600,
            typeDisplay: 48,
            typeH1: 36,
            typeH2: 28,
            typeH3: 20,
            typeBody: 16,
            typeBodySm: 14,
            typeCaption: 12,
            typeOverline: 11,
            buttonBorderRadius: 8,
            primaryColor: "#F7AA0E",
            primaryHoverColor: "#e59a0d",
            secondaryColor: "#000000",
            backgroundColor: "#ffffff",
            topBarBg: "#0f172a",
            topBarText: "#ffffff",
            headerBg: "#ffffff",
            headerText: "#1f2937",
            footerBg: "#0f172a",
            footerText: "#ffffff",
            textColor: "#1f2937",
            ...initialData,
        });
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
            headingWeight,
            typeDisplay,
            typeH1,
            typeH2,
            typeH3,
            typeBody,
            typeBodySm,
            typeCaption,
            typeOverline,
            buttonBorderRadius,
            primaryColor,
            primaryHoverColor,
            secondaryColor,
            backgroundColor,
            topBarBg,
            topBarText,
            headerBg,
            headerText,
            footerBg,
            footerText,
            textColor,
        } = values;

        const appearance = {
            primaryFont,
            secondaryFont,
            baseFontSize,
            headingWeight,
            typeDisplay,
            typeH1,
            typeH2,
            typeH3,
            typeBody,
            typeBodySm,
            typeCaption,
            typeOverline,
            buttonBorderRadius,
            primaryColor,
            primaryHoverColor,
            secondaryColor,
            backgroundColor,
            textColor,
            topBarBg,
            topBarText,
            headerBg,
            headerText,
            footerBg,
            footerText,
        };

        const payload = {
            id,
            headerOption: { leftText },
            footerOption: { copyRight, image },
            socialLink: { facebookUrl, instagramUrl, linkedinUrl, twitterUrl },
            appearance,
        };

        try {
            const res = id ? await updateSetting(payload) : await saveSetting(payload);

            if (!res?.success) {
                return errorNotification({ message: res?.message || "Operation failed" });
            }

            successNotification({ message: res.message });
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
                description="Brand colors, typography, and store identity"
            />

            <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl text-white shadow-sm">
                <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                        <BgColorsOutlined className="text-amber-400" /> Theme Presets
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        One-click palettes that keep colors consistent across the store.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {THEME_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className="text-left bg-white/10 hover:bg-white/15 border border-white/10 hover:border-amber-400/40 rounded-xl p-3.5 transition-colors"
                        >
                            <div className="flex items-center gap-1.5 mb-2">
                                <span
                                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                                    style={{ backgroundColor: preset.preview.primary }}
                                />
                                <span
                                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                                    style={{ backgroundColor: preset.preview.secondary }}
                                />
                                <span
                                    className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                                    style={{ backgroundColor: preset.preview.footer }}
                                />
                            </div>
                            <h4 className="font-semibold text-xs text-white">{preset.name}</h4>
                            <p className="text-[10px] text-gray-300 line-clamp-2 mt-0.5 leading-snug">
                                {preset.description}
                            </p>
                            <span className="mt-3 block w-full py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg bg-white/15 text-white text-center">
                                Apply
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <Card className="shadow-sm border border-gray-100 rounded-2xl">
                <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" scrollToFirstError>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Tabs
                        defaultActiveKey="1"
                        type="line"
                        size="large"
                        items={[
                            {
                                key: "1",
                                label: (
                                    <span className="flex items-center gap-2 px-1">
                                        <BgColorsOutlined /> Colors
                                    </span>
                                ),
                                children: (
                                    <div className="space-y-8 pt-4">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader
                                                title="Brand Colors"
                                                description="Primary drives buttons, links, and accents automatically"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="primaryColor" label="Primary Color" extra="Main brand / CTA color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="primaryHoverColor" label="Primary Hover">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="secondaryColor" label="Secondary Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="backgroundColor" label="Page Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="textColor" label="Default Text Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item
                                                    name="buttonBorderRadius"
                                                    label="Button Corner Radius (px)"
                                                    extra="Shared storefront radius"
                                                >
                                                    <InputNumber className="w-full h-10" min={0} max={50} />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader
                                                title="Layout Colors"
                                                description="Top bar, header, and footer surfaces"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="topBarBg" label="Top Bar Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="topBarText" label="Top Bar Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="headerBg" label="Header Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="headerText" label="Header Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="footerBg" label="Footer Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="footerText" label="Footer Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: "2",
                                label: (
                                    <span className="flex items-center gap-2 px-1">
                                        <FontSizeOutlined /> Typography
                                    </span>
                                ),
                                children: (
                                    <div className="space-y-8 pt-4">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader
                                                title="Fonts"
                                                description="Primary for headings, secondary for body copy"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <Form.Item name="primaryFont" label="Primary Font (Headings)">
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>
                                                <Form.Item name="secondaryFont" label="Secondary Font (Body)">
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>
                                                <Form.Item
                                                    name="baseFontSize"
                                                    label="Root Font Size (px)"
                                                    extra="Browser default scale (html font-size)"
                                                >
                                                    <InputNumber size="large" className="w-full h-11" min={14} max={18} />
                                                </Form.Item>
                                                <Form.Item
                                                    name="headingWeight"
                                                    label="Heading Weight"
                                                    extra="Applied to display, H1–H3"
                                                >
                                                    <Select
                                                        size="large"
                                                        options={[
                                                            { label: "Medium (500)", value: 500 },
                                                            { label: "Semi Bold (600) — recommended", value: 600 },
                                                            { label: "Bold (700)", value: 700 },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                                <SettingsHeader
                                                    title="Type Scale"
                                                    description="Sizes in px. Storefront uses: type-display, type-h1, type-h2, type-h3, type-body, type-body-sm, type-caption, type-overline"
                                                />
                                                <Button type="default" onClick={handleApplyTypeScale} className="!rounded-full shrink-0">
                                                    Reset to recommended
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                                                <Form.Item name="typeDisplay" label="Display" extra="Hero titles">
                                                    <InputNumber size="large" className="w-full h-11" min={32} max={72} />
                                                </Form.Item>
                                                <Form.Item name="typeH1" label="H1" extra="Page titles">
                                                    <InputNumber size="large" className="w-full h-11" min={24} max={56} />
                                                </Form.Item>
                                                <Form.Item name="typeH2" label="H2" extra="Section titles">
                                                    <InputNumber size="large" className="w-full h-11" min={20} max={40} />
                                                </Form.Item>
                                                <Form.Item name="typeH3" label="H3" extra="Cards / subheads">
                                                    <InputNumber size="large" className="w-full h-11" min={16} max={28} />
                                                </Form.Item>
                                                <Form.Item name="typeBody" label="Body" extra="Main copy">
                                                    <InputNumber size="large" className="w-full h-11" min={14} max={20} />
                                                </Form.Item>
                                                <Form.Item name="typeBodySm" label="Body Small" extra="Secondary text">
                                                    <InputNumber size="large" className="w-full h-11" min={12} max={16} />
                                                </Form.Item>
                                                <Form.Item name="typeCaption" label="Caption" extra="Meta / labels">
                                                    <InputNumber size="large" className="w-full h-11" min={10} max={14} />
                                                </Form.Item>
                                                <Form.Item name="typeOverline" label="Overline" extra="Eyebrows / badges">
                                                    <InputNumber size="large" className="w-full h-11" min={9} max={13} />
                                                </Form.Item>
                                            </div>

                                            <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 space-y-3">
                                                <p className="type-overline text-gray-400 !m-0">Overline sample</p>
                                                <p className="type-display text-gray-900 !m-0">Display</p>
                                                <p className="type-h1 text-gray-900 !m-0">Heading 1</p>
                                                <p className="type-h2 text-gray-900 !m-0">Heading 2</p>
                                                <p className="type-h3 text-gray-900 !m-0">Heading 3</p>
                                                <p className="type-body text-gray-600 !m-0">
                                                    Body — primary reading text for product details and paragraphs.
                                                </p>
                                                <p className="type-body-sm text-gray-500 !m-0">
                                                    Body small — supporting copy and meta descriptions.
                                                </p>
                                                <p className="type-caption text-gray-400 !m-0">
                                                    Caption — prices helpers, timestamps, fine print.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                key: "3",
                                label: (
                                    <span className="flex items-center gap-2 px-1">
                                        <GlobalOutlined /> Branding & Social
                                    </span>
                                ),
                                children: (
                                    <div className="space-y-8 pt-4">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Website Identity" />
                                            <div className="grid grid-cols-1 gap-6">
                                                <Form.Item
                                                    name="leftText"
                                                    label="Header Left Text"
                                                    rules={[{ required: true, message: "Header text is required" }]}
                                                    extra="Shown in the top bar"
                                                >
                                                    <Input size="large" placeholder="Welcome to our store!" />
                                                </Form.Item>
                                                <Form.Item
                                                    name="copyRight"
                                                    label="Copyright Text"
                                                    rules={[{ required: true, message: "Copyright text is required" }]}
                                                >
                                                    <Input size="large" placeholder="© 2026 Your Store. All rights reserved." />
                                                </Form.Item>
                                                <FileUploadField
                                                    name="image"
                                                    label="Payment Methods Image"
                                                    fileList={global.setting?.footerOption?.fileList || []}
                                                    aspect={2}
                                                    onFileUpdate={(fileList, fileName) => {
                                                        const footerOption = {
                                                            ...global.setting.footerOption,
                                                            fileList,
                                                            image: fileName,
                                                        };
                                                        dispatch(setSetting({ ...global.setting, footerOption }));
                                                        form.setFieldsValue({ image: fileName, fileList });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Social Connections" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                                <Form.Item name="facebookUrl" label="Facebook URL">
                                                    <Input size="large" placeholder="https://facebook.com/yourstore" />
                                                </Form.Item>
                                                <Form.Item name="instagramUrl" label="Instagram URL">
                                                    <Input size="large" placeholder="https://instagram.com/yourstore" />
                                                </Form.Item>
                                                <Form.Item name="linkedinUrl" label="LinkedIn URL">
                                                    <Input size="large" placeholder="https://linkedin.com/company/yourstore" />
                                                </Form.Item>
                                                <Form.Item name="twitterUrl" label="Twitter/X URL">
                                                    <Input size="large" placeholder="https://twitter.com/yourstore" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                    />

                    <div className="flex justify-end mt-10 pt-8 border-t border-gray-100">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="!h-12 !px-10 !rounded-xl !font-semibold"
                        >
                            Save Settings
                        </Button>
                    </div>
                </Form>
            </Card>
            <PreviewModal />
        </div>
    );
};

export default AppearanceSettings;
