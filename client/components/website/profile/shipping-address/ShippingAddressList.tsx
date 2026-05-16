"use client";
import { ActionType } from "@/constants/constants";
import {
  deleteShippingAddress,
  getUserShippingAddresses,
} from "@/lib/apis/shipping-address";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction
} from "@/redux/features/global/globalSlice";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ShopOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Skeleton,
  Tag,
  Typography
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddShippingAddress from "./AddShippingAddress";

const { Text, Title } = Typography;

interface DataType {
  id: string;
  key?: string;
  type: string;
  name: string;
  phoneNo: string;
  email: string;
  division: any;
  user: any;
  district: any;
  upazila: any;
  union: any;
  address: string;
  status: boolean;
}

const ShippingAddressList = () => {
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<DataType[]>([]);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, [global.action]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const getShippingAddress = await getUserShippingAddresses();
      if (getShippingAddress.success) {
        setShippingAddress(getShippingAddress.data);
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShippingAddress(id);
      successNotification({ message: "Address deleted successfully" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Title level={4} className="!mb-0 text-gray-900 font-black">My Addresses</Title>
          <Text type="secondary" className="text-xs sm:text-sm">Manage your shipping destinations</Text>
        </div>
        <Button
          type="primary"
          size="large"
          className="w-full sm:w-auto h-12 rounded-xl font-bold flex items-center justify-center gap-2"
          icon={<PlusOutlined />}
          onClick={() =>
            dispatch(
              setAction({
                userShippingAddress: true,
                type: ActionType.CREATE,
              })
            )
          }
        >
          Add New Address
        </Button>
      </div>

      {loading && !shippingAddress.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton active avatar paragraph={{ rows: 3 }} className="bg-white p-6 rounded-2xl border border-gray-100" />
          <Skeleton active avatar paragraph={{ rows: 3 }} className="bg-white p-6 rounded-2xl border border-gray-100" />
        </div>
      ) : shippingAddress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {shippingAddress.map((item) => (
            <Card
              key={item.id || item.key}
              bordered={false}
              className="group shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-3xl overflow-hidden"
              actions={[
                <Button
                  type="text"
                  key="edit"
                  className="hover:bg-blue-50 hover:text-blue-600 font-bold text-xs"
                  icon={<EditOutlined />}
                  onClick={() =>
                    dispatch(
                      setAction({
                        userShippingAddress: true,
                        type: ActionType.UPDATE,
                        payload: item,
                      })
                    )
                  }
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete address?"
                  onConfirm={() => handleDelete(item.id || item.key as string)}
                  okText="Delete"
                  cancelText="Keep"
                  okButtonProps={{ danger: true, className: "rounded-lg" }}
                  cancelButtonProps={{ className: "rounded-lg" }}
                >
                  <Button type="text" danger className="hover:bg-red-50 font-bold text-xs" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.type === "Home" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                    {item.type === "Home" ? <HomeOutlined /> : <ShopOutlined />}
                  </div>
                  <div>
                    <Text strong className="text-base sm:text-lg block">{item.type}</Text>
                    {item.status && <Tag color="green" className="m-0 rounded-md text-[10px] uppercase font-bold">Default</Tag>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Text strong className="text-gray-900 text-sm sm:text-base">{item.name}</Text>
                </div>
                <div className="space-y-2 text-gray-500 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center text-[10px]">
                      <PhoneOutlined />
                    </div>
                    <Text className="text-gray-600 font-medium">{item.phoneNo}</Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center text-[10px]">
                      <MailOutlined />
                    </div>
                    <Text className="text-gray-600 font-medium truncate">{item.email}</Text>
                  </div>
                  <div className="flex items-start gap-3 mt-1 pt-3 border-t border-gray-50">
                    <div className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center text-[10px] mt-0.5">
                      <EnvironmentOutlined />
                    </div>
                    <Text className="flex-1 text-gray-600 leading-relaxed italic">
                      {item.address}, {item.union?.name ? `${item.union.name}, ` : ''}
                      {item.upazila?.name}, {item.district?.name}, {item.division?.name}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No addresses found"
          className="bg-white p-12 rounded-3xl border border-gray-100"
        />
      )}

      <AddShippingAddress />
    </div>
  );
};

export default ShippingAddressList;
