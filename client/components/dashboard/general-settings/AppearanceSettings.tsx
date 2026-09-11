import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import {
    AppstoreOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    GlobalOutlined
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
      linkColor: "#F7AA0E",
      accentColor: "#F7AA0E",
      buttonPrimaryColor: "#F7AA0E",
      buttonHoverColor: "#e59a0d",
      buttonTextColor: "#ffffff",
      headerBg: "#ffffff",
      headerText: "#1f2937",
      footerBg: "#0f172a",
      footerText: "#ffffff",
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
      linkColor: "#18181b",
      accentColor: "#27272a",
      buttonPrimaryColor: "#18181b",
      buttonHoverColor: "#27272a",
      buttonTextColor: "#ffffff",
      headerBg: "#ffffff",
      headerText: "#18181b",
      footerBg: "#18181b",
      footerText: "#ffffff",
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
      linkColor: "#059669",
      accentColor: "#10b981",
      buttonPrimaryColor: "#059669",
      buttonHoverColor: "#047857",
      buttonTextColor: "#ffffff",
      headerBg: "#ffffff",
      headerText: "#064e3b",
      footerBg: "#064e3b",
      footerText: "#ffffff",
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
      linkColor: "#2563eb",
      accentColor: "#3b82f6",
      buttonPrimaryColor: "#2563eb",
      buttonHoverColor: "#1d4ed8",
      buttonTextColor: "#ffffff",
      headerBg: "#ffffff",
      headerText: "#1e293b",
      footerBg: "#0f172a",
      footerText: "#ffffff",
    },
  },
  {
    name: "Cyber Purple",
    description: "Creative violet & indigo for modern brands",
    preview: { primary: "#7c3aed", secondary: "#4c1d95", header: "#ffffff", footer: "#1e1b4b" },
    values: {
      primaryColor: "#7c3aed",
      primaryHoverColor: "#6d28d9",
      secondaryColor: "#4c1d95",
      linkColor: "#7c3aed",
      accentColor: "#8b5cf6",
      buttonPrimaryColor: "#7c3aed",
      buttonHoverColor: "#6d28d9",
      buttonTextColor: "#ffffff",
      headerBg: "#ffffff",
      headerText: "#1e1b4b",
      footerBg: "#1e1b4b",
      footerText: "#ffffff",
    },
  },
];

const AppearanceSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
        form.setFieldsValue(preset.values);
        successNotification({ message: `Applied "${preset.name}" preset colors into form!` });
    };

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
            buttonTextColor: "#ffffff",
            primaryColor: "#F7AA0E",
            primaryHoverColor: "#e59a0d",
            secondaryColor: "#000000",
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
            socialIconSize: 20,
            socialIconPadding: 8,
            socialIconBorderRadius: 50,
            socialIconColor: "#ffffff",
            socialIconHoverColor: "#ffffff",
            socialIconBg: "rgba(255,255,255,0.1)",
            socialIconHoverBg: "#F7AA0E",
            socialIconBorderWidth: 1,
            socialIconBorderColor: "rgba(255,255,255,0.2)",
            socialIconHoverBorderColor: "transparent",
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
            buttonTextColor,
            primaryColor,
            primaryHoverColor,
            secondaryColor,
            backgroundColor,
            cardBackgroundColor,
            inputPaddingVertical,
            inputPaddingHorizontal,
            inputBorderRadius,
            inputBorderColor,
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
            socialIconSize,
            socialIconPadding,
            socialIconBorderRadius,
            socialIconColor,
            socialIconHoverColor,
            socialIconBg,
            socialIconHoverBg,
            socialIconBorderWidth,
            socialIconBorderColor,
            socialIconHoverBorderColor,
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
                buttonTextColor,
                primaryColor,
                primaryHoverColor,
                secondaryColor,
                backgroundColor,
                cardBackgroundColor,
                inputPaddingVertical,
                inputPaddingHorizontal,
                inputBorderRadius,
                inputBorderColor,
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
                socialIconSize,
                socialIconPadding,
                socialIconBorderRadius,
                socialIconColor,
                socialIconHoverColor,
                socialIconBg,
                socialIconHoverBg,
                socialIconBorderWidth,
                socialIconBorderColor,
                socialIconHoverBorderColor,
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

            {/* Theme Studio Presets Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                    <BgColorsOutlined className="text-amber-400" /> Theme Studio Presets
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    1-click curated design palettes that instantly populate storefront design tokens.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10">
                {THEME_PRESETS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-amber-400/40 rounded-2xl p-3.5 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: preset.preview.primary }} />
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: preset.preview.secondary }} />
                        <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: preset.preview.footer }} />
                      </div>
                      <h4 className="font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-gray-300 line-clamp-2 mt-0.5 leading-snug">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/15 group-hover:bg-amber-400 group-hover:text-gray-900 text-white transition-all text-center"
                    >
                      Apply Preset
                    </button>
                  </div>
                ))}
              </div>
            </div>

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

                    <Tabs
                        defaultActiveKey="1"
                        type="line"
                        size="large"
                        animated={{ inkBar: true, tabPane: true }}
                        className="custom-appearance-tabs"
                        items={[
                            {
                                key: "1",
                                label: (
                                    <span className="flex items-center gap-2 px-1">
                                        <BgColorsOutlined /> Themes & Colors
                                    </span>
                                ),
                                children: (
                                    <div className="space-y-8 pt-4">
                                        {/* Color Palette Section */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Brand Color Palette" description="Configure your primary and secondary brand colors" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="primaryColor" label="Primary Color" extra="Main theme color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="secondaryColor" label="Secondary Color" extra="Secondary brand color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="primaryHoverColor" label="Hover Color" extra="Interaction color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="backgroundColor" label="Page Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="cardBackgroundColor" label="Card Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="textColor" label="Default Text Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        {/* Layout Colors */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Layout Colors" description="Surface colors for major UI sections" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="topBarBg" label="Top Bar Bg">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="topBarText" label="Top Bar Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="headerBg" label="Header Bg">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="headerText" label="Header Nav Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="footerBg" label="Footer Bg">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="footerText" label="Footer Text">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        {/* Icons Section */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Iconography" description="Default styles for system icons" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="iconSize" label="Base Icon Size (px)">
                                                    <InputNumber className="w-full h-10" min={12} max={48} />
                                                </Form.Item>
                                                <Form.Item name="iconColor" label="Global Icon Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="iconHoverColor" label="Icon Hover Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="iconBackgroundColor" label="Icon Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="iconHoverBackgroundColor" label="Icon Hover Bg">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )
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
                                            <SettingsHeader title="Fonts & Global Scaling" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <Form.Item name="primaryFont" label="Primary Font (Headings)">
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>
                                                <Form.Item name="secondaryFont" label="Secondary Font (Body)">
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>
                                                <Form.Item name="baseFontSize" label="Global Scale (Base px)" extra="Scales everything site-wide">
                                                    <InputNumber size="large" className="w-full h-11" min={10} max={24} />
                                                </Form.Item>
                                                <Form.Item name="pSize" label="Paragraph Size (px)" extra="Standard body text size">
                                                    <InputNumber size="large" className="w-full h-11" min={10} max={30} />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Heading Sizes" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <Form.Item name="h1Size" label="H1 size (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={24} max={100} />
                                                </Form.Item>
                                                <Form.Item name="h2Size" label="H2 size (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={20} max={80} />
                                                </Form.Item>
                                                <Form.Item name="h3Size" label="H3 size (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={16} max={60} />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: "3",
                                label: (
                                    <span className="flex items-center gap-2 px-1">
                                        <AppstoreOutlined /> Components
                                    </span>
                                ),
                                children: (
                                    <div className="space-y-8 pt-4">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Buttons & Interactivity" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="buttonFontSize" label="Text Size (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={10} max={20} />
                                                </Form.Item>
                                                <Form.Item name="buttonBorderRadius" label="Border Radius (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={50} />
                                                </Form.Item>
                                                <Form.Item name="buttonFontWeight" label="Font Weight">
                                                    <Select size="large" options={[
                                                        { label: "Regular (400)", value: 400 },
                                                        { label: "Medium (500)", value: 500 },
                                                        { label: "Semi Bold (600)", value: 600 },
                                                        { label: "Bold (700)", value: 700 },
                                                    ]} />
                                                </Form.Item>
                                                <Form.Item name="buttonTextColor" label="Text Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="buttonPaddingVertical" label="Vertical P (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={30} />
                                                </Form.Item>
                                                <Form.Item name="buttonPaddingHorizontal" label="Horizontal P (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={60} />
                                                </Form.Item>
                                                <Form.Item name="buttonPrimaryColor" label="Primary Color" extra="Overrides brand primary">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="buttonHoverColor" label="Hover Color" extra="Overrides brand hover">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Form Inputs" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <Form.Item name="inputPaddingVertical" label="Vertical Padding (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={30} />
                                                </Form.Item>
                                                <Form.Item name="inputPaddingHorizontal" label="Horizontal Padding (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={60} />
                                                </Form.Item>
                                                <Form.Item name="inputBorderRadius" label="Border Radius (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={50} />
                                                </Form.Item>
                                                <Form.Item name="inputBorderColor" label="Default Border Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: "4",
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
                                                <Form.Item name="leftText" label="Header Left Text" rules={[{ required: true, message: "Header text is required" }]} extra="Displayed at top-left">
                                                    <Input size="large" placeholder="Welcome text" />
                                                </Form.Item>
                                                <Form.Item name="copyRight" label="Copyright Text" rules={[{ required: true, message: "Copyright text is required" }]}>
                                                    <Input size="large" placeholder="Copyright info" />
                                                </Form.Item>
                                                <FileUploadField 
                                                    name="image" 
                                                    label="Payment Methods Image" 
                                                    fileList={global.setting?.footerOption?.fileList || []}
                                                    aspect={2}
                                                    onFileUpdate={(fileList, fileName) => {
                                                        const footerOption = { ...global.setting.footerOption, fileList, image: fileName };
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

                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader title="Social Icon Appearance" />
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                                <Form.Item name="socialIconSize" label="Size (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={12} max={48} />
                                                </Form.Item>
                                                <Form.Item name="socialIconPadding" label="Padding (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={40} />
                                                </Form.Item>
                                                <Form.Item name="socialIconBorderRadius" label="Border Radius (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={100} />
                                                </Form.Item>
                                                <Form.Item name="socialIconBorderWidth" label="Border Width (px)">
                                                    <InputNumber size="large" className="w-full h-11" min={0} max={10} />
                                                </Form.Item>
                                                <Form.Item name="socialIconColor" label="Icon Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="socialIconHoverColor" label="Hover Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="socialIconBg" label="Background">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="socialIconHoverBg" label="Hover Bg">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="socialIconBorderColor" label="Border Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                                <Form.Item name="socialIconHoverBorderColor" label="Hover Border Color">
                                                    <Input type="color" className="h-10 w-full p-1 cursor-pointer" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        ]}
                    />

                    <div className="flex justify-end mt-10 pt-8 border-t border-gray-100">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            className="!h-14 !px-12 !rounded-2xl !font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Save All Settings
                        </Button>
                    </div>
                </Form>
            </Card>
            <PreviewModal />
        </div>
    );
};

export default AppearanceSettings;
