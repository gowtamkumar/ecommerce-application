"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Switch,
  Table,
  Tabs,
  Typography,
} from "antd";
import {
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  GiftOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveSetting, updateSetting } from "@/lib/apis/setting";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { SettingsHeader } from "./CommonComponents";

const { Text, Title } = Typography;

const DEFAULT_LANDING_SECTIONS = [
  { slug: "hero", name: "Product Hero & Urgency Banner", sequence: 1, status: true },
  { slug: "features", name: "Value Propositions & Trust Badges", sequence: 2, status: true },
  { slug: "bundle_offers", name: "Bundle & Combo Deals (Quantity Tiers)", sequence: 3, status: true },
  { slug: "size_guide", name: "Clothing Size Measurement Guide", sequence: 4, status: true },
  { slug: "reviews", name: "Customer Testimonials & Social Proof", sequence: 5, status: true },
  { slug: "order_form", name: "1-Page Fast Checkout Form", sequence: 6, status: true },
];

export default function LandingPageSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const existingLanding = global.setting?.landingSetting || {};

  // Sections state for table ordering & toggles
  const [sections, setSections] = useState(() => {
    const saved = existingLanding?.sections || [];
    return DEFAULT_LANDING_SECTIONS.map((def) => {
      const match = saved.find((s: any) => s.slug === def.slug);
      return match ? { ...def, ...match } : def;
    }).sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  });

  const initialValues = React.useMemo(
    () => ({
      // Urgency & Header
      urgencyText:
        existingLanding?.urgencyText ||
        "Special Limited-Time Deal! Order now before stock runs out.",
      countdownEnabled: existingLanding?.countdownEnabled !== false,
      countdownHours: existingLanding?.countdownHours ?? 3,
      scarcityEnabled: existingLanding?.scarcityEnabled !== false,

      // CTA Buttons
      ctaButtonText:
        existingLanding?.ctaButtonText || "Order Now (Cash on Delivery)",
      ctaSubtext:
        existingLanding?.ctaSubtext ||
        "Fast Dispatch • Cash on Delivery • 100% Satisfaction Guarantee",

      // Shipping & Zones
      isFreeDeliveryActive: existingLanding?.isFreeDeliveryActive !== false,
      freeDeliveryMinQty: existingLanding?.freeDeliveryMinQty ?? 2,
      freeDeliveryMinAmount: existingLanding?.freeDeliveryMinAmount ?? null,

      zone1Name: existingLanding?.zone1Name || "Inside Dhaka (Standard Delivery)",
      zone1Time: existingLanding?.zone1Time || "24-48 Hours",
      insideDhakaCharge: existingLanding?.insideDhakaCharge ?? 60,

      zone2Name: existingLanding?.zone2Name || "Outside Dhaka (Express Delivery)",
      zone2Time: existingLanding?.zone2Time || "2-3 Business Days",
      outsideDhakaCharge: existingLanding?.outsideDhakaCharge ?? 120,

      // Bundle Deals Customization
      bundle1Title: existingLanding?.bundles?.[0]?.title || "1 Piece (Standard)",
      bundle1Badge: existingLanding?.bundles?.[0]?.badge || "Regular Offer",
      bundle1Desc: existingLanding?.bundles?.[0]?.description || "Single pack to try",

      bundle2Title: existingLanding?.bundles?.[0]?.title || "2 Pieces (Best Value Duo)",
      bundle2Badge: existingLanding?.bundles?.[1]?.badge || "Most Popular 🔥",
      bundle2Desc: existingLanding?.bundles?.[1]?.description || "Free delivery included",

      bundle3Title: existingLanding?.bundles?.[2]?.title || "3 Pieces (Family Pack)",
      bundle3Badge: existingLanding?.bundles?.[2]?.badge || "Maximum Savings 💥",
      bundle3Desc: existingLanding?.bundles?.[2]?.description || "Extra discount + free gift",
      bundle3Discount: existingLanding?.bundles?.[2]?.discountAmount ?? 100,

      // Value Features Customization
      featuresTitle: existingLanding?.featuresTitle || "Why Choose Our Products?",
      featuresSubtitle: existingLanding?.featuresSubtitle || "PREMIUM QUALITY GUARANTEED",

      // Order Form
      orderFormTitle:
        existingLanding?.orderFormTitle || "Complete Your Order Below",
      orderFormSubtitle:
        existingLanding?.orderFormSubtitle ||
        "Pay Cash on Delivery or use online checkout. Inspect before paying.",
    }),
    [existingLanding],
  );

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (existingLanding?.sections) {
      setSections(
        DEFAULT_LANDING_SECTIONS.map((def) => {
          const match = existingLanding.sections.find((s: any) => s.slug === def.slug);
          return match ? { ...def, ...match } : def;
        }).sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
      );
    }
  }, [form, initialValues, existingLanding?.sections]);

  const handleUpdateSection = (slug: string, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, [field]: value } : s)),
    );
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const id = global.setting?.id;

    const landingSettingPayload = {
      ...global.setting?.landingSetting,
      sections,
      urgencyText: values.urgencyText,
      countdownEnabled: values.countdownEnabled,
      countdownHours: values.countdownHours,
      scarcityEnabled: values.scarcityEnabled,
      ctaButtonText: values.ctaButtonText,
      ctaSubtext: values.ctaSubtext,

      isFreeDeliveryActive: values.isFreeDeliveryActive,
      freeDeliveryMinQty: values.freeDeliveryMinQty,
      freeDeliveryMinAmount: values.freeDeliveryMinAmount,

      zone1Name: values.zone1Name,
      zone1Time: values.zone1Time,
      insideDhakaCharge: values.insideDhakaCharge,

      zone2Name: values.zone2Name,
      zone2Time: values.zone2Time,
      outsideDhakaCharge: values.outsideDhakaCharge,

      featuresTitle: values.featuresTitle,
      featuresSubtitle: values.featuresSubtitle,

      bundles: [
        {
          qty: 1,
          title: values.bundle1Title,
          badge: values.bundle1Badge,
          description: values.bundle1Desc,
          discountAmount: 0,
          popular: false,
        },
        {
          qty: 2,
          title: values.bundle2Title,
          badge: values.bundle2Badge,
          description: values.bundle2Desc,
          discountAmount: 0,
          popular: true,
        },
        {
          qty: 3,
          title: values.bundle3Title,
          badge: values.bundle3Badge,
          description: values.bundle3Desc,
          discountAmount: values.bundle3Discount || 0,
          popular: false,
        },
      ],

      orderFormTitle: values.orderFormTitle,
      orderFormSubtitle: values.orderFormSubtitle,
    };

    const payload: any = {
      id,
      landingSetting: landingSettingPayload,
    };

    try {
      const res = id ? await updateSetting(payload) : await saveSetting(payload);
      if (!res?.success) {
        return errorNotification({ message: res?.message || "Operation failed" });
      }
      successNotification({ message: "Landing Page settings updated successfully!" });
      dispatch(setSetting({ ...global.setting, landingSetting: landingSettingPayload }));
      dispatch(setAction({}));
    } catch (error: any) {
      errorNotification({ message: error?.message || "Unexpected error" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Section Block Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <div className="font-semibold text-gray-800">{text}</div>,
    },
    {
      title: "Section Identifier",
      dataIndex: "slug",
      key: "slug",
      width: 180,
      render: (text: string) => (
        <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md font-mono text-xs border border-gray-200">
          {text}
        </span>
      ),
    },
    {
      title: "Display Sequence",
      dataIndex: "sequence",
      key: "sequence",
      width: 150,
      align: "center" as const,
      render: (value: number, record: any) => (
        <InputNumber
          min={1}
          max={99}
          value={value}
          onChange={(val) => handleUpdateSection(record.slug, "sequence", val)}
          className="w-20 text-center rounded-md"
        />
      ),
    },
    {
      title: "Visibility",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "right" as const,
      render: (value: boolean, record: any) => (
        <div className="flex items-center justify-end gap-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              value ? "text-global-primary" : "text-gray-400"
            }`}
          >
            {value ? "Active" : "Hidden"}
          </span>
          <Switch
            checked={value}
            onChange={(val) => handleUpdateSection(record.slug, "status", val)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Ads Landing Page Customizer"
        description="Full control over your Facebook & Instagram high-converting landing pages. Customize content, shipping zones, bundles, and layouts worldwide."
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Tabs
          type="card"
          className="modern-tabs"
          items={[
            {
              label: (
                <span className="flex items-center gap-1.5">
                  <FireOutlined /> Hero & Urgency
                </span>
              ),
              key: "hero_urgency",
              children: (
                <div className="p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Urgency & Countdown Controls
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Create scarcity to boost impulse purchases from Facebook and Instagram Ads.
                    </p>
                  </div>

                  <Form.Item
                    name="urgencyText"
                    label={<span className="font-semibold">Top Urgency Headline Banner</span>}
                    extra="Shown in the pulsing badge right above the product title."
                  >
                    <Input
                      size="large"
                      placeholder="Special Limited-Time Deal! Order now before stock runs out."
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="countdownEnabled"
                      valuePropName="checked"
                      label={<span className="font-semibold">Enable Urgency Countdown Timer</span>}
                      extra="Displays a real-time countdown clock in the hero card."
                    >
                      <Switch checkedChildren="Timer ON" unCheckedChildren="OFF" />
                    </Form.Item>

                    <Form.Item
                      name="countdownHours"
                      label={<span className="font-semibold">Countdown Duration (Hours)</span>}
                      extra="Default: 3 hours from visitor arrival."
                    >
                      <InputNumber size="large" min={1} max={72} className="w-full" />
                    </Form.Item>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Call-To-Action (CTA) Customization
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Buttons across hero, form, and floating sticky mobile bar.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="ctaButtonText"
                      label={<span className="font-semibold">Main Action Button Text</span>}
                      extra="Shown on the primary order buttons."
                    >
                      <Input size="large" placeholder="Order Now (Cash on Delivery)" />
                    </Form.Item>

                    <Form.Item
                      name="ctaSubtext"
                      label={<span className="font-semibold">Subtext under Main CTA</span>}
                      extra="Trust reassurance line shown below the hero button."
                    >
                      <Input
                        size="large"
                        placeholder="Fast Dispatch • Cash on Delivery • 100% Satisfaction Guarantee"
                      />
                    </Form.Item>
                  </div>
                </div>
              ),
            },
            {
              label: (
                <span className="flex items-center gap-1.5">
                  <CarOutlined /> Delivery & Free Shipping
                </span>
              ),
              key: "delivery_shipping",
              children: (
                <div className="p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        Promotional Free Shipping Rules
                      </h3>
                      <p className="text-xs text-gray-500">
                        Drive higher average order value by unlocking free shipping on multiple items.
                      </p>
                    </div>
                    <Form.Item
                      name="isFreeDeliveryActive"
                      valuePropName="checked"
                      className="mb-0"
                    >
                      <Switch
                        checkedChildren="Free Delivery Campaign ON"
                        unCheckedChildren="OFF"
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Form.Item
                      name="freeDeliveryMinQty"
                      label={<span className="font-semibold">Minimum Quantity for Free Delivery</span>}
                      extra="Set 2 for 'Buy 2+ Get Free Delivery'. Set 0 or empty to disable."
                    >
                      <InputNumber size="large" min={0} max={99} className="w-full" placeholder="2" />
                    </Form.Item>

                    <Form.Item
                      name="freeDeliveryMinAmount"
                      label={<span className="font-semibold">Minimum Order Subtotal for Free Delivery</span>}
                      extra="Optional: Cart amount threshold (leave empty to use quantity rule)."
                    >
                      <InputNumber size="large" min={0} className="w-full" placeholder="e.g. 2000" />
                    </Form.Item>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Delivery Zones & Charges
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Customize zone titles, estimated delivery duration, and default rates.
                    </p>
                  </div>

                  {/* Zone 1 */}
                  <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
                    <span className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                      Zone 1 (Domestic / Inside City)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Form.Item
                        name="zone1Name"
                        label={<span className="text-xs font-semibold">Zone Label</span>}
                        className="mb-0"
                      >
                        <Input placeholder="Inside Dhaka" />
                      </Form.Item>
                      <Form.Item
                        name="zone1Time"
                        label={<span className="text-xs font-semibold">Delivery Time</span>}
                        className="mb-0"
                      >
                        <Input placeholder="24-48 Hours" />
                      </Form.Item>
                      <Form.Item
                        name="insideDhakaCharge"
                        label={<span className="text-xs font-semibold">Delivery Charge</span>}
                        className="mb-0"
                      >
                        <InputNumber min={0} className="w-full" prefix="৳" />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Zone 2 */}
                  <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-3">
                    <span className="text-xs font-black uppercase text-blue-800 tracking-wider">
                      Zone 2 (Nationwide / Outside / Express)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Form.Item
                        name="zone2Name"
                        label={<span className="text-xs font-semibold">Zone Label</span>}
                        className="mb-0"
                      >
                        <Input placeholder="Outside Dhaka" />
                      </Form.Item>
                      <Form.Item
                        name="zone2Time"
                        label={<span className="text-xs font-semibold">Delivery Time</span>}
                        className="mb-0"
                      >
                        <Input placeholder="2-3 Business Days" />
                      </Form.Item>
                      <Form.Item
                        name="outsideDhakaCharge"
                        label={<span className="text-xs font-semibold">Delivery Charge</span>}
                        className="mb-0"
                      >
                        <InputNumber min={0} className="w-full" prefix="৳" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: (
                <span className="flex items-center gap-1.5">
                  <GiftOutlined /> Combo & Bundles
                </span>
              ),
              key: "bundles_offers",
              children: (
                <div className="p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Bundle & Package Tiers
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Customize titles, badges, and discounts for 1-piece, 2-piece, and 3-piece bundle packages.
                    </p>
                  </div>

                  {/* Tier 1 */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
                    <div className="font-bold text-gray-900 text-sm">Package 1: 1 Item Tier</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Form.Item name="bundle1Title" label="Title" className="mb-0">
                        <Input placeholder="1 Piece (Standard)" />
                      </Form.Item>
                      <Form.Item name="bundle1Badge" label="Badge" className="mb-0">
                        <Input placeholder="Regular Deal" />
                      </Form.Item>
                      <Form.Item name="bundle1Desc" label="Description" className="mb-0">
                        <Input placeholder="Single pack" />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className="p-4 rounded-xl border-2 border-global-primary/30 bg-global-primary/5 space-y-3">
                    <div className="font-bold text-global-primary text-sm">
                      Package 2: 2 Items Tier (Best Value)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Form.Item name="bundle2Title" label="Title" className="mb-0">
                        <Input placeholder="2 Pieces (Best Value Duo)" />
                      </Form.Item>
                      <Form.Item name="bundle2Badge" label="Badge" className="mb-0">
                        <Input placeholder="Most Popular 🔥" />
                      </Form.Item>
                      <Form.Item name="bundle2Desc" label="Description" className="mb-0">
                        <Input placeholder="Free Delivery included" />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                    <div className="font-bold text-amber-900 text-sm">
                      Package 3: 3 Items Tier (Family Pack)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Form.Item name="bundle3Title" label="Title" className="mb-0">
                        <Input placeholder="3 Pieces (Family Pack)" />
                      </Form.Item>
                      <Form.Item name="bundle3Badge" label="Badge" className="mb-0">
                        <Input placeholder="Maximum Savings 💥" />
                      </Form.Item>
                      <Form.Item name="bundle3Desc" label="Description" className="mb-0">
                        <Input placeholder="Extra discount + free gift" />
                      </Form.Item>
                      <Form.Item name="bundle3Discount" label="Extra Discount (৳)" className="mb-0">
                        <InputNumber min={0} className="w-full" prefix="৳" />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              label: (
                <span className="flex items-center gap-1.5">
                  <SafetyCertificateOutlined /> Features & Checkout Form
                </span>
              ),
              key: "features_form",
              children: (
                <div className="p-4 sm:p-6 space-y-6 bg-white rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Value Proposition Headings
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Headings for the trust badges and features section.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="featuresSubtitle"
                      label={<span className="font-semibold">Section Tagline / Eyebrow</span>}
                    >
                      <Input placeholder="PREMIUM QUALITY GUARANTEED" />
                    </Form.Item>
                    <Form.Item
                      name="featuresTitle"
                      label={<span className="font-semibold">Main Section Title</span>}
                    >
                      <Input placeholder="Why Choose Our Products?" />
                    </Form.Item>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Checkout Order Form Copy
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      The embedded 1-page checkout header texts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      name="orderFormTitle"
                      label={<span className="font-semibold">Order Form Heading</span>}
                    >
                      <Input placeholder="Complete Your Order Below" />
                    </Form.Item>
                    <Form.Item
                      name="orderFormSubtitle"
                      label={<span className="font-semibold">Order Form Subtitle</span>}
                    >
                      <Input placeholder="Fill in your delivery address to place your order instantly." />
                    </Form.Item>
                  </div>
                </div>
              ),
            },
            {
              label: (
                <span className="flex items-center gap-1.5">
                  <ThunderboltOutlined /> Section Layout & Ordering
                </span>
              ),
              key: "sections_layout",
              children: (
                <div className="p-4 sm:p-6 space-y-4 bg-white rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      Section Sequence & Visibility Controls
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Drag or set display numbers to reorder sections. Toggle switches to hide or show any section.
                    </p>
                  </div>

                  <Table
                    dataSource={sections}
                    columns={columns}
                    pagination={false}
                    rowKey="slug"
                    bordered
                    size="middle"
                    className="border-x border-t border-gray-100 rounded-xl overflow-hidden shadow-sm"
                  />
                </div>
              ),
            },
          ]}
        />

        <div className="mt-6 flex justify-start">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            className="h-12 px-8 font-bold text-base shadow-md"
            style={{
              backgroundColor: "var(--global-primary)",
              borderColor: "var(--global-primary)",
            }}
          >
            Save All Landing Page Settings
          </Button>
        </div>
      </Form>
    </div>
  );
}
