import appConfig from "@/appConfig";
import { ActionType } from "@/constants/constants";
import { getDiscountDetails } from "@/lib/apis/discount";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";
import { message, Modal, Spin, Tag, Descriptions, Card, Typography } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiscountProduct from "./DiscountProduct";
import { 
  FiTag, 
  FiDollarSign, 
  FiCalendar, 
  FiPercent,
  FiPackage,
  FiClock
} from "react-icons/fi";

const { Title, Text } = Typography;

export default function DiscountDetails() {
  const [loading, setLoading] = React.useState(false);
  const [discount, setDiscount] = React.useState<any>({});
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const value = { ...global.action.payload };
  
  const featchData = useCallback(async () => {
    setLoading(true);
    const id = value.id;
    if (!id) {
      setLoading(false);
      return;
    }
    const res = await getDiscountDetails(id);
    if (res.error) {
      message.error("Error");
      return;
    }

    res.data = {
      ...res.data,
      startDate: res.data.startDate
        ? dayjs(res.data.startDate).format("YYYY-MM-DD")
        : null,
      endDate: res.data.endDate
        ? dayjs(res.data.endDate).format("YYYY-MM-DD")
        : null,
      createdAt: res.data.createdAt
        ? dayjs(res.data.createdAt).format("YYYY-MM-DD")
        : null,
      updatedAt: res.data.updatedAt
        ? dayjs(res.data.updatedAt).format("YYYY-MM-DD")
        : null,
    };
    setDiscount(res.data);
    setLoading(false);
  }, [value.id]);

  useEffect(() => {
    featchData();
  }, [featchData]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'expired': return 'orange';
      default: return 'default';
    }
  };

  return (
    <Modal
      open={global.action.type === ActionType.VIEW && global.action.discount}
      footer={null}
      width={1000}
      onCancel={() => dispatch(setAction({}))}
      closeIcon={null}
      centered
      style={{ padding: 0 }}
      bodyStyle={{ padding: 0, borderRadius: "16px" }}
    >
      {loading ? (
        <div className="flex justify-center items-center p-16">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" 
                 style={{ 
                   backgroundImage: 'radial-gradient(white 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }} 
            />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <Title level={3} className="!text-white !mb-2">
                  {discount.name || 'Discount Details'}
                </Title>
                <div className="flex items-center gap-2">
                  <FiTag className="w-4 h-4" />
                  <Text className="!text-white/90 font-mono text-sm">
                    {discount.key}
                  </Text>
                </div>
              </div>
              <Tag color={getStatusColor(discount.status)} className="!text-sm !px-3 !py-1">
                {discount.status || 'Unknown'}
              </Tag>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Top Section - Image and Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image */}
              <div className="md:col-span-1">
                <div className="relative aspect-square w-full max-w-[280px] mx-auto">
                  <Image
                    fill
                    className="rounded-xl object-cover shadow-md border border-gray-100"
                    alt={discount.name || 'Discount'}
                    src={`${appConfig.baseApiUrl}/uploads/${discount.image || "no-data.png"}`}
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div className="md:col-span-2 space-y-4">
                {/* Value Card */}
                <Card className="shadow-sm border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500 text-white rounded-lg">
                      {discount.discountStrategy === "Percentage" ? (
                        <FiPercent className="w-6 h-6" />
                      ) : (
                        <FiDollarSign className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <Text type="secondary" className="text-xs uppercase tracking-wider">
                        Discount Value
                      </Text>
                      <Title level={2} className="!mb-0 !mt-1 text-indigo-600">
                        {+discount.discountValue}
                        {discount.discountStrategy === "Percentage" ? "%" : " BDT"}
                      </Title>
                    </div>
                  </div>
                </Card>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card className="shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FiPackage className="w-4 h-4" />
                      <Text className="text-xs font-semibold">Scope</Text>
                    </div>
                    <Text className="text-sm font-medium text-gray-900">{discount.scope || 'N/A'}</Text>
                  </Card>
                  
                  <Card className="shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FiTag className="w-4 h-4" />
                      <Text className="text-xs font-semibold">Promotion Type</Text>
                    </div>
                    <Text className="text-sm font-medium text-gray-900">{discount.promotionType || 'N/A'}</Text>
                  </Card>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <Card title={<Text strong>Discount Information</Text>} className="shadow-sm">
              <Descriptions column={{ xs: 1, sm: 2, md: 2 }} size="small">
                <Descriptions.Item 
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" /> Start Date
                    </span>
                  }
                >
                  <Tag color="blue">{discount.startDate || 'Not Set'}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" /> End Date
                    </span>
                  }
                >
                  <Tag color="orange">{discount.endDate || 'Not Set'}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" /> Created At
                    </span>
                  }
                >
                  <Text type="secondary">{discount.createdAt}</Text>
                </Descriptions.Item>
                
                <Descriptions.Item 
                  label={
                    <span className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" /> Updated At
                    </span>
                  }
                >
                  <Text type="secondary">{discount.updatedAt}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Products Section */}
            <DiscountProduct discount={discount} />
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
