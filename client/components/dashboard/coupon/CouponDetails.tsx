import { ActionType } from "@/constants/constants";
import { getCoupon } from "@/lib/apis/admin/coupon";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { Modal, Spin, Tag, Card, Descriptions, Typography } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CouponProduct from "./CouponProduct";
import {
  FiTag,
  FiPercent,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiShoppingCart,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import { useCurrency } from "@/context/CurrencyContext";

const { Title, Text } = Typography;

export default function CouponDetails() {
  const [loading, setLoading] = React.useState(false);
  const [coupon, setCoupon] = React.useState<any>({});
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const {formatPrice} = useCurrency();
  const value = { ...global.action.payload };

  const featchData = useCallback(async () => {
    setLoading(true);
    const id = value.id;
    if (!id) {
      setLoading(false);
      return;
    }
    const res = await getCoupon(id);
    setCoupon(res.data);
    setLoading(false);
  }, [value.id]);

  useEffect(() => {
    featchData();
  }, [featchData]);

  const formatDate = (date: string) => {
    return date ? dayjs(date).format("DD MMM YYYY, h:mm A") : "N/A";
  };

  return (
    <Modal
      open={global.action.type === ActionType.VIEW && global.action.coupon}
      footer={null}
      width={1000}
      onCancel={() => dispatch(setAction({}))}
      closeIcon={null}
      centered
      style={{ padding: 0 }}
      styles={{ body: { padding: 0, borderRadius: "16px" } }}
    >
      {loading ? (
        <div className="flex justify-center items-center p-16">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <Title level={3} className="!text-white !mb-2">
                  Coupon Details
                </Title>
                <div className="flex items-center gap-2">
                  <FiTag className="w-4 h-4" />
                  <Text className="!text-white/90 font-mono text-lg font-bold">
                    {coupon.code}
                  </Text>
                </div>
              </div>
              <Tag
                color={coupon.active ? "green" : "red"}
                className="!text-sm !px-3 !py-1"
              >
                {coupon.active ? "Active" : "Inactive"}
              </Tag>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Discount Value Card */}
              <Card className="shadow-sm border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500 text-white rounded-lg">
                    {coupon.discountType === "Percentage" ? (
                      <FiPercent className="w-6 h-6" />
                    ) : (
                      <FiDollarSign className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <Text
                      type="secondary"
                      className="text-xs uppercase tracking-wider"
                    >
                      Discount Value
                    </Text>
                    <Title level={2} className="!mb-0 !mt-1 text-indigo-600">
                      {coupon.value}
                      {coupon.discountType === "Percentage" ? "%" : " BDT"}
                    </Title>
                  </div>
                </div>
              </Card>

              {/* Coupon Type Card */}
              <Card className="shadow-sm border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 text-white rounded-lg">
                    <FiTag className="w-6 h-6" />
                  </div>
                  <div>
                    <Text
                      type="secondary"
                      className="text-xs uppercase tracking-wider"
                    >
                      Coupon Type
                    </Text>
                    <Title level={2} className="!mb-0 !mt-1 text-purple-600">
                      {coupon.type || "N/A"}
                    </Title>
                  </div>
                </div>
              </Card>
            </div>

            {/* Validity Period */}
            <Card
              title={<Text strong>Validity Period</Text>}
              className="shadow-sm"
            >
              <Descriptions column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" /> Start Date
                    </span>
                  }
                >
                  <Tag color="blue">{formatDate(coupon.startDate)}</Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" /> Expiry Date
                    </span>
                  }
                >
                  <Tag color="orange">{formatDate(coupon.expiryDate)}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Usage Limits */}
            <Card
              title={<Text strong>Usage Limits</Text>}
              className="shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Max Users
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.maxUser || "Unlimited"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Usage Limit
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.usageLimit || "Unlimited"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="w-5 h-5 text-purple-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Usage Per User
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.usagePerUser || "Unlimited"}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Restrictions */}
            <Card
              title={<Text strong>Order Restrictions</Text>}
              className="shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiShoppingCart className="w-5 h-5 text-orange-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Min Order Amount
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : "None"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiShoppingCart className="w-5 h-5 text-blue-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Min Cart Value
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.mincartValue ? formatPrice(coupon.mincartValue) : "None"}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-red-500" />
                  <div>
                    <Text type="secondary" className="text-xs block">
                      Max Discount
                    </Text>
                    <Text strong className="text-sm">
                      {coupon.maxDiscountValue ? formatPrice(coupon.maxDiscountValue) : "None"}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Products Section */}
            <CouponProduct products={coupon?.products || []} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={() => dispatch(setAction({}))}
              className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
