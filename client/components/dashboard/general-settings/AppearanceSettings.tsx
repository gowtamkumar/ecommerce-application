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
    {
        label: "Modern Sans-Serif (High Legibility)",
        options: [
            { label: "Poppins (Default Local)", value: "var(--font-poppins)" },
            { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans, sans-serif" },
            { label: "Inter", value: "Inter, sans-serif" },
            { label: "DM Sans", value: "DM Sans, sans-serif" },
            { label: "Outfit", value: "Outfit, sans-serif" },
            { label: "Montserrat", value: "Montserrat, sans-serif" },
            { label: "Manrope", value: "Manrope, sans-serif" },
            { label: "Roboto", value: "Roboto, sans-serif" },
            { label: "System Sans", value: "system-ui, -apple-system, sans-serif" },
        ],
    },
    {
        label: "Editorial & Luxury Serif",
        options: [
            { label: "Playfair Display", value: "Playfair Display, serif" },
            { label: "Lora", value: "Lora, serif" },
            { label: "Cinzel (Boutique Luxury)", value: "Cinzel, serif" },
            { label: "Merriweather", value: "Merriweather, serif" },
        ],
    },
];

const headingWeightOptions = [
    { label: "600 — SemiBold", value: 600 },
    { label: "700 — Bold (Recommended)", value: 700 },
    { label: "800 — ExtraBold", value: 800 },
    { label: "900 — Black", value: 900 },
];

const bodyWeightOptions = [
    { label: "400 — Regular (Standard)", value: 400 },
    { label: "500 — Medium (Higher Contrast)", value: 500 },
];

const TYPOGRAPHY_PRESETS = [
    {
        name: "Modern Commerce (Default)",
        description: "Bold Poppins headings with ultra-readable Inter body",
        preview: { heading: "Poppins", body: "Inter", size: "16px" },
        values: {
            primaryFont: "var(--font-poppins)",
            secondaryFont: "Inter, sans-serif",
            baseFontSize: 16,
            headingWeight: 700,
            bodyWeight: 400,
        },
    },
    {
        name: "Tech & Clean SaaS",
        description: "Plus Jakarta Sans paired with crisp, sharp Inter",
        preview: { heading: "Plus Jakarta", body: "Inter", size: "16px" },
        values: {
            primaryFont: "Plus Jakarta Sans, sans-serif",
            secondaryFont: "Inter, sans-serif",
            baseFontSize: 16,
            headingWeight: 700,
            bodyWeight: 400,
        },
    },
    {
        name: "Editorial & Luxury",
        description: "Regal Playfair Display serif with sleek Plus Jakarta",
        preview: { heading: "Playfair", body: "Plus Jakarta", size: "16px" },
        values: {
            primaryFont: "Playfair Display, serif",
            secondaryFont: "Plus Jakarta Sans, sans-serif",
            baseFontSize: 16,
            headingWeight: 700,
            bodyWeight: 400,
        },
    },
    {
        name: "Nordic Minimalist",
        description: "Geometric Outfit with friendly, modern DM Sans",
        preview: { heading: "Outfit", body: "DM Sans", size: "15px" },
        values: {
            primaryFont: "Outfit, sans-serif",
            secondaryFont: "DM Sans, sans-serif",
            baseFontSize: 15,
            headingWeight: 600,
            bodyWeight: 400,
        },
    },
    {
        name: "Heritage & Premium",
        description: "Classical Cinzel roman serif with structured Montserrat",
        preview: { heading: "Cinzel", body: "Montserrat", size: "15px" },
        values: {
            primaryFont: "Cinzel, serif",
            secondaryFont: "Montserrat, sans-serif",
            baseFontSize: 15,
            headingWeight: 600,
            bodyWeight: 400,
        },
    },
    {
        name: "Warm Editorial",
        description: "Warm literary Lora with humanistic, legible Manrope",
        preview: { heading: "Lora", body: "Manrope", size: "16px" },
        values: {
            primaryFont: "Lora, serif",
            secondaryFont: "Manrope, sans-serif",
            baseFontSize: 16,
            headingWeight: 700,
            bodyWeight: 400,
        },
    },
];

interface TypographyLivePreviewProps {
    form: any;
}

const TypographyLivePreview: React.FC<TypographyLivePreviewProps> = ({ form }) => {
    const primaryFont = Form.useWatch("primaryFont", form) || "var(--font-poppins)";
    const secondaryFont = Form.useWatch("secondaryFont", form) || "Inter, sans-serif";
    const baseFontSize = Form.useWatch("baseFontSize", form) || 16;
    const headingWeight = Form.useWatch("headingWeight", form) || 700;
    const bodyWeight = Form.useWatch("bodyWeight", form) || 400;
    const primaryColor = Form.useWatch("primaryColor", form) || "#F7AA0E";
    const buttonBorderRadius = Form.useWatch("buttonBorderRadius", form) || 8;

    // Dynamically inject link in head to load Google Fonts preview live
    useEffect(() => {
        const fontsToLoad = [primaryFont, secondaryFont]
            .filter(Boolean)
            .filter((f) => typeof f === "string" && !f.includes("var(--font-poppins)") && !f.includes("system-ui"))
            .map((f) => f.split(",")[0].trim())
            .filter((v, i, a) => a.indexOf(v) === i);

        if (fontsToLoad.length > 0 && typeof document !== "undefined") {
            const id = "admin-typography-preview-link";
            let link = document.getElementById(id) as HTMLLinkElement;
            if (!link) {
                link = document.createElement("link");
                link.id = id;
                link.rel = "stylesheet";
                document.head.appendChild(link);
            }
            link.href = `https://fonts.googleapis.com/css2?${fontsToLoad
                .map((f) => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800;900`)
                .join("&")}&display=swap`;
        }
    }, [primaryFont, secondaryFont]);

    const primaryFontName = primaryFont.includes("var(--font-poppins)")
        ? "Poppins"
        : primaryFont.split(",")[0].trim();

    const secondaryFontName = secondaryFont.includes("var(--font-poppins)")
        ? "Poppins"
        : secondaryFont.split(",")[0].trim();

    return (
        <div className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-global-primary">
                        Live Storefront Typography Preview
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Interactive preview of headings, body copy, and UI controls using your active typography
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-global-primary/10 text-global-primary border border-global-primary/25 break-words">
                        Headings: {primaryFontName} ({headingWeight})
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 break-words">
                        Body: {secondaryFontName} ({baseFontSize}px)
                    </span>
                </div>
            </div>

            {/* Content preview */}
            <div className="space-y-4">
                <h1
                    style={{
                        fontFamily: primaryFont,
                        fontWeight: headingWeight,
                    }}
                    className="text-xl sm:text-2xl md:text-3xl text-gray-900 leading-tight tracking-tight m-0 break-words"
                >
                    The New Standard in Modern E-Commerce
                </h1>
                <h2
                    style={{
                        fontFamily: primaryFont,
                        fontWeight: Math.min(headingWeight, 600),
                    }}
                    className="text-base sm:text-lg md:text-xl text-gray-700 font-medium m-0 break-words"
                >
                    Curated collections engineered for effortless style and lasting quality
                </h2>
                <p
                    style={{
                        fontFamily: secondaryFont,
                        fontWeight: bodyWeight,
                        fontSize: `${baseFontSize}px`,
                    }}
                    className="text-gray-600 leading-relaxed max-w-3xl m-0 break-words"
                >
                    Discover our latest seasonal lookbook featuring sustainably sourced textiles, handcrafted details, and an obsession with functional elegance. Designed for high conversion and effortless customer readability across mobile and desktop displays.
                </p>

                {/* Mini Product Card & CTA preview */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div
                            style={{
                                fontFamily: primaryFont,
                                fontWeight: headingWeight,
                            }}
                            className="text-sm sm:text-base text-gray-900 font-bold"
                        >
                            Signature Linen Overshirt
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In Stock • Best Seller
                        </span>
                        <span
                            style={{
                                fontFamily: secondaryFont,
                                fontWeight: 700,
                            }}
                            className="text-xs sm:text-sm font-black text-gray-900"
                        >
                            $189.00
                        </span>
                    </div>

                    <button
                        type="button"
                        style={{
                            backgroundColor: primaryColor,
                            borderRadius: `${buttonBorderRadius}px`,
                            fontFamily: secondaryFont,
                            fontWeight: 600,
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer text-center"
                    >
                        Add to Cart — $189.00
                    </button>
                </div>
            </div>
        </div>
    );
};

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

const AppearanceSettings = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);

    const handleApplyPreset = (preset: (typeof THEME_PRESETS)[0]) => {
        form.setFieldsValue(preset.values);
        successNotification({ message: `Applied "${preset.name}" preset` });
    };

    const handleApplyTypographyPreset = (preset: (typeof TYPOGRAPHY_PRESETS)[0]) => {
        form.setFieldsValue(preset.values);
        successNotification({ message: `Applied "${preset.name}" typography preset` });
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
            secondaryFont: "Inter, sans-serif",
            baseFontSize: 16,
            headingWeight: 700,
            bodyWeight: 400,
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
            bodyWeight,
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

        // Button colors always follow brand primary
        const appearance = {
            primaryFont,
            secondaryFont,
            baseFontSize: Number(baseFontSize) || 16,
            headingWeight: Number(headingWeight) || 700,
            bodyWeight: Number(bodyWeight) || 400,
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
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
                                        {/* Curated Typography Presets */}
                                        <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl text-white shadow-sm">
                                            <div className="mb-4">
                                                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                                                    <FontSizeOutlined className="text-amber-400" /> Curated Font Pairings
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    One-click typography systems combining commanding heading presence with effortless body readability.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                                {TYPOGRAPHY_PRESETS.map((preset) => (
                                                    <div
                                                        key={preset.name}
                                                        className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between hover:border-amber-400/50 transition-all duration-200"
                                                    >
                                                        <div>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h4 className="font-semibold text-sm text-white m-0">
                                                                    {preset.name}
                                                                </h4>
                                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-amber-300 shrink-0">
                                                                    {preset.preview.size}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
                                                                {preset.description}
                                                            </p>
                                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                                                                <span className="px-2 py-0.5 rounded bg-slate-700/70 text-slate-200 border border-slate-600 font-medium">
                                                                    H: {preset.preview.heading}
                                                                </span>
                                                                <span className="text-gray-500">+</span>
                                                                <span className="px-2 py-0.5 rounded bg-slate-700/70 text-slate-300 border border-slate-600">
                                                                    Body: {preset.preview.body}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            size="small"
                                                            type="dashed"
                                                            onClick={() => handleApplyTypographyPreset(preset)}
                                                            className="mt-4 !bg-transparent !text-amber-400 !border-amber-400/40 hover:!border-amber-400 hover:!text-amber-300 text-xs w-full rounded-lg font-semibold"
                                                        >
                                                            Apply Pairing
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Font Family & Hierarchy Controls */}
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <SettingsHeader
                                                title="Font Families & Hierarchy"
                                                description="Configure primary display headings, secondary body typography, and base scaling"
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <Form.Item
                                                    name="primaryFont"
                                                    label="Primary Font (Headings & Titles)"
                                                    extra="Used for H1-H6, category titles, and banner headings"
                                                >
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="headingWeight"
                                                    label="Heading Font Weight"
                                                    extra="Visual weight of titles and headers"
                                                >
                                                    <Select size="large" options={headingWeightOptions} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="secondaryFont"
                                                    label="Secondary Font (Body & UI Copy)"
                                                    extra="Used for descriptions, navigation, buttons, and product details"
                                                >
                                                    <Select size="large" options={fontOptions} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="bodyWeight"
                                                    label="Body Text Font Weight"
                                                    extra="Standard weight for descriptions and paragraphs"
                                                >
                                                    <Select size="large" options={bodyWeightOptions} />
                                                </Form.Item>

                                                <Form.Item
                                                    name="baseFontSize"
                                                    label="Base Font Size (px)"
                                                    extra="Site-wide typography base scale (default: 16px)"
                                                    className="md:col-span-2"
                                                >
                                                    <InputNumber size="large" className="w-full h-11" min={12} max={20} />
                                                </Form.Item>
                                            </div>
                                        </div>

                                        {/* Live WYSIWYG Typography Preview */}
                                        <TypographyLivePreview form={form} />
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
                            className="h-12 px-10 rounded-xl font-semibold"
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
