"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Form, Input, InputNumber, Switch, Table, Tabs, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { selectGlobal, setAction, setSetting } from "@/redux/features/global/globalSlice";
import { SettingsHeader } from "./CommonComponents";

const { Title, Text } = Typography;

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

    const getSectionsForPage = (pageKey: string) => {
        const pageData = global.setting?.[pageKey === 'support' ? 'helpSupport' : `${pageKey}Page`];
        const existingSections = pageData?.sections || [];
        
        // Merge with defaults to ensure all sections are present
        const defaults = DEFAULT_SECTIONS[pageKey as keyof typeof DEFAULT_SECTIONS];
        return defaults.map(def => {
            const existing = existingSections.find((s: any) => s.slug === def.slug);
            return existing ? { ...def, ...existing } : def;
        }).sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
    };

    const [sections, setSections] = useState({
        home: getSectionsForPage("home"),
        about: getSectionsForPage("about"),
        contact: getSectionsForPage("contact"),
        support: getSectionsForPage("support"),
    });

    useEffect(() => {
        setSections({
            home: getSectionsForPage("home"),
            about: getSectionsForPage("about"),
            contact: getSectionsForPage("contact"),
            support: getSectionsForPage("support"),
        });
    }, [global.setting]);

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
        payload.homePage = { ...global.setting?.homePage, sections: sections.home };
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
            title: "Section Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <Text className="font-medium">{text}</Text>
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            render: (text: string) => <Text type="secondary" className="font-mono text-xs">{text}</Text>
        },
        {
            title: "Sequence",
            dataIndex: "sequence",
            key: "sequence",
            width: 120,
            render: (value: number, record: any) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => handleUpdateSection(pageKey, record.slug, "sequence", val)}
                    className="w-full"
                />
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (value: boolean, record: any) => (
                <Switch
                    checked={value}
                    onChange={(val) => handleUpdateSection(pageKey, record.slug, "status", val)}
                />
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
                                    <Table 
                                        dataSource={sections.home} 
                                        columns={columns("home")} 
                                        pagination={false} 
                                        rowKey="slug"
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
                                    />
                                </div>
                            )
                        }
                    ]}
                />

                <Divider className="!my-6" />

                <div className="flex justify-start">
                    <Button 
                        type="primary" 
                        onClick={handleSubmit} 
                        loading={loading}
                        size="large"
                        className="!h-11 !px-8 !font-medium"
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
