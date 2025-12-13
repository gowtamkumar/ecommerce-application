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

const { Text, Title, Paragraph } = Typography;

interface DataType {
  id: string; // Corrected from key to id based on typical API response usage, but kept flexible
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
  }, [global.action]); // Refetch when action changes (e.g. after add/update)

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
    // Optimistic UI could be applied, but standard loading for safety
    try {
      await deleteShippingAddress(id);
      successNotification({ message: "Address deleted successfully" });
      fetchData(); // Reload list
    } catch (error: any) {
      errorNotification({ message: error.message });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} className="!mb-0">My Addresses</Title>
          <Text type="secondary">Manage your shipping destinations</Text>
        </div>
        <Button
          type="primary"
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
          <Skeleton active avatar paragraph={{ rows: 3 }} />
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        </div>
      ) : shippingAddress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shippingAddress.map((item) => (
            <Card
              key={item.id || item.key}
              className="shadow-sm hover:shadow-md transition-shadow border-gray-200"
              actions={[
                <Button
                  type="text"
                  key="edit"
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
                  title="Delete this address?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(item.id || item.key as string)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {item.type === "Home" ? <HomeOutlined /> : <ShopOutlined />}
                  <Text strong className="text-lg">{item.type}</Text>
                  {item.status && <Tag color="green">Active</Tag>}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Text strong>{item.name}</Text>
                </div>
                <div className="flex flex-col gap-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-gray-400" />
                    <Text>{item.phoneNo}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-gray-400" />
                    <Text>{item.email}</Text>
                  </div>
                  <div className="flex items-start gap-2 mt-1">
                    <EnvironmentOutlined className="text-gray-400 mt-1" />
                    <Text className="flex-1">
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
          description="No addresses found. Add one to get started!"
        />
      )}

      <AddShippingAddress />
    </div>
  );
};

export default ShippingAddressList;
