"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Divider, InputNumber, Radio, Space, Switch, Table, Tabs, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader } from "./CommonComponents";

const { Text } = Typography;

const BANNER_LAYOUT_OPTIONS = [
  {
    value: "slider",
    title: "Full-width Slider",
    description:
      "A single full-width hero slider runs across the top of the page.",
  },
  {
    value: "slider_side",
    title: "Slider + Side Banner",
    description:
      "The slider sits on the left with stacked side banners on the right. Uses \"Slider Right\" banners, falling back to promotional banners if none exist.",
  },
];

const DEFAULT_SECTIONS = {
    home: [
        { slug: "slider", name: "Main Hero Slider", sequence: 1, status: true },
        { slug: "categories", name: "Featured Categories", sequence: 2, status: true },
        { slug: "featured_products", name: "Featured Collections", sequence: 3, status: true },
        { slug: "promo_banners", name: "Promotional Banner", sequence: 4, status: true },
        { slug: "top_selling", name: "Best Sellers", sequence: 5, status: true },
        { slug: "new_arrivals", name: "New Arrivals", sequence: 6, status: true },
        { slug: "category_tabs", name: "Category Tabs", sequence: 7, status: true },
        { slug: "blog", name: "Recent Blogs", sequence: 8, status: true },
    ],
    about: [
        { slug: "hero", name: "Hero / Intro", sequence: 1, status: true },
        { slug: "stats", name: "Stats Section", sequence: 2, status: true },
        { slug: "origin_story", name: "Origin Story", sequence: 3, status: true },
        { slug: "mission_vision", name: "Mission & Vision", sequence: 4, status: true },
        { slug: "team", name: "Team Section", sequence: 5, status: true },
        { slug: "cta", name: "Call to Action", sequence: 6, status: true },
    ],
    contact: [
        { slug: "header", name: "Hero / Header", sequence: 1, status: true },
        { slug: "form_map", name: "Form & Map Section", sequence: 2, status: true },
    ],
    support: [
        { slug: "hero", name: "Hero Section", sequence: 1, status: true },
        { slug: "support_options", name: "Support Options", sequence: 2, status: true },
        { slug: "faqs", name: "FAQ Section", sequence: 3, status: true },
        { slug: "contact_form", name: "Contact Form", sequence: 4, status: true },
    ]
};

const PageLayoutSettings = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const global = useSelector(selectGlobal);
    const [activeTab, setActiveTab] = useState("home");

    const getSectionsForPage = useCallback((pageKey: string) => {
        const pageData = global.setting?.[pageKey === 'support' ? 'helpSupport' : `${pageKey}Page`];
        const existingSections = pageData?.sections || [];
        
        // Merge with defaults to ensure all sections are present
        const defaults = DEFAULT_SECTIONS[pageKey as keyof typeof DEFAULT_SECTIONS];
        return defaults.map(def => {
            const existing = existingSections.find((s: any) => s.slug === def.slug);
            return existing ? { ...def, ...existing } : def;
        }).sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    }, [global.setting]);

    const [sections, setSections] = useState({
        home: getSectionsForPage("home"),
        about: getSectionsForPage("about"),
        contact: getSectionsForPage("contact"),
        support: getSectionsForPage("support"),
    });

    const [bannerLayout, setBannerLayout] = useState<string>(
        global.setting?.homePage?.bannerLayout || "slider"
    );

    useEffect(() => {
        setSections({
            home: getSectionsForPage("home"),
            about: getSectionsForPage("about"),
            contact: getSectionsForPage("contact"),
            support: getSectionsForPage("support"),
        });
        setBannerLayout(global.setting?.homePage?.bannerLayout || "slider");
    }, [getSectionsForPage, global.setting]);

    const handleUpdateSection = (pageKey: string, slug: string, field: string, value: any) => {
        setSections(prev => ({
            ...prev,
            [pageKey]: prev[pageKey as keyof typeof sections].map(s => 
                s.slug === slug ? { ...s, [field]: value } : s
            )
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const id = global.setting?.id;

        const payload: any = { id };
        payload.homePage = { ...global.setting?.homePage, bannerLayout, sections: sections.home };
        payload.aboutPage = { ...global.setting?.aboutPage, sections: sections.about };
        payload.contactPage = { ...global.setting?.contactPage, sections: sections.contact };
        payload.helpSupport = { ...global.setting?.helpSupport, sections: sections.support };

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

    const columns = (pageKey: string) => [
        {
            title: "Section Block Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <div className="font-semibold text-gray-800">{text}</div>
        },
        {
            title: "Internal Identifier",
            dataIndex: "slug",
            key: "slug",
            width: 250,
            render: (text: string) => (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-md font-mono text-xs border border-gray-200">
                    {text}
                </span>
            )
        },
        {
            title: "Display Order",
            dataIndex: "sequence",
            key: "sequence",
            width: 180,
            align: 'center' as const,
            render: (value: number, record: any) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => handleUpdateSection(pageKey, record.slug, "sequence", val)}
                    className="w-24 text-center rounded-md"
                />
            )
        },
        {
            title: "Visibility",
            dataIndex: "status",
            key: "status",
            width: 150,
            align: 'right' as const,
            render: (value: boolean, record: any) => (
                <div className="flex items-center justify-end gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${value ? 'text-global-primary' : 'text-gray-400'}`}>
                        {value ? 'Visible' : 'Hidden'}
                    </span>
                    <Switch
                        checked={value}
                        onChange={(val) => handleUpdateSection(pageKey, record.slug, "status", val)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <SettingsHeader 
                title="Page Layout Management" 
                description="Control the display order and visibility of sections for various pages" 
            />

            <Card className="shadow-sm border border-gray-100 rounded-2xl">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        {
                            label: "Home Page",
                            key: "home",
                            children: (
                                <div className="py-4">
                                    <div className="mb-6 p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4">
                                        <div>
                                            <Text strong className="text-gray-800">Banner Section Layout</Text>
                                            <Text type="secondary" className="block text-sm mt-0.5">
                                                Choose how the hero banner section is displayed on the home page.
                                            </Text>
                                        </div>
                                        <Radio.Group
                                            value={bannerLayout}
                                            onChange={(e) => setBannerLayout(e.target.value)}
                                            className="w-full"
                                        >
                                            <Space direction="vertical" className="w-full">
                                                {BANNER_LAYOUT_OPTIONS.map((opt) => (
                                                    <Radio
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className="w-full p-4 rounded-xl border border-gray-200 bg-white"
                                                    >
                                                        <div className="pr-2">
                                                            <Text strong className="block">{opt.title}</Text>
                                                            <Text type="secondary" className="block text-xs mt-0.5">{opt.description}</Text>
                                                        </div>
                                                    </Radio>
                                                ))}
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                    <Table 
                                        dataSource={sections.home} 
                                        columns={columns("home")} 
                                        pagination={false} 
                                        rowKey="slug"
                                        bordered
                                        size="middle"
                                        className="border-x border-t border-gray-100 rounded-xl overflow-hidden shadow-sm"
                                    />
                                </div>
                            )
                        },
                        {
                            label: "About Us Page",
                            key: "about",
                            children: (
                                <div className="py-4">
                                    <Table 
                                        dataSource={sections.about} 
                                        columns={columns("about")} 
                                        pagination={false} 
                                        rowKey="slug"
                                        bordered
                                        size="middle"
                                        className="border-x border-t border-gray-100 rounded-xl overflow-hidden shadow-sm"
                                    />
                                </div>
                            )
                        },
                        {
                            label: "Contact Us Page",
                            key: "contact",
                            children: (
                                <div className="py-4">
                                    <Table 
                                        dataSource={sections.contact} 
                                        columns={columns("contact")} 
                                        pagination={false} 
                                        rowKey="slug"
                                        bordered
                                        size="middle"
                                        className="border-x border-t border-gray-100 rounded-xl overflow-hidden shadow-sm"
                                    />
                                </div>
                            )
                        },
                        {
                            label: "Support & Help Page",
                            key: "support",
                            children: (
                                <div className="py-4">
                                    <Table 
                                        dataSource={sections.support} 
                                        columns={columns("support")} 
                                        pagination={false} 
                                        rowKey="slug"
                                        bordered
                                        size="middle"
                                        className="border-x border-t border-gray-100 rounded-xl overflow-hidden shadow-sm"
                                    />
                                </div>
                            )
                        }
                    ]}
                />

                <Divider className="my-6" />

                <div className="flex justify-start">
                    <Button 
                        type="primary" 
                        onClick={handleSubmit} 
                        loading={loading}
                        size="large"
                        className="h-11 px-8 font-medium"
                        style={{ 
                            borderRadius: "var(--button-border-radius)",
                            backgroundColor: "var(--global-primary)"
                        }}
                    >
                        Save Layout Changes
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PageLayoutSettings;
