"use client";
import { deleteProduct, getProducts } from "@/lib/apis/admin/product";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { Button, Image, Input, Popconfirm, Table, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Discount {
  discountStrategy: string;
  value: number;
  type: string;
}
interface DataType {
  key: string;
  id: string;
  name: string;
  variant: boolean;
  enableReview: boolean;
  featured: boolean;
  limitPurchaseQty: number;
  alertQty: number;
  discount: Discount;
  status: string;
  thumbnailImage?: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const res = await getProducts();
      const newProducts = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));
      setProducts(newProducts);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteProduct(id);
      fetchData();
      successNotification({ message: "Successfully deleted" });
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
      dispatch(setAction({}));
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      width: 300,
      render: (text, record) => (
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => route.push(`/dashboard/product/${record.id}`)}>
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
            <Image
              width={48}
              height={48}
              src={getUploadImageUrl(record.thumbnailImage)}
              alt={text}
              preview={false}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 group-hover:text-black transition-colors">{text}</span>
            <span className="text-xs text-gray-500">{record.variant ? "Has Variants" : "Simple Product"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "alertQty",
      key: "alertQty",
      render: (qty, record) => (
        <div className="flex flex-col">
          <span className={`font-medium ${qty < 5 ? 'text-red-600' : 'text-gray-700'}`}>{qty} units</span>
          <span className="text-xs text-gray-400">Limit: {record.limitPurchaseQty}</span>
        </div>
      )
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value) => (
        value?.value ? (
          <Tag color="purple" className="border-0 bg-purple-50 text-purple-700 rounded-full px-3">
            {value.value}{value.discountStrategy === "Percentage" ? "%" : " BDT"} OFF
          </Tag>
        ) : <span className="text-gray-400 text-sm">-</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const isActive = status === "Active";
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {status}
          </div>
        )
      },
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (featured) => {
        const isActive = featured === true;
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {featured ? "Featured" : "Not Featured"}
          </div>
        )
      },
    },
    {
      title: "New Arrival",
      dataIndex: "isNewArrival",
      key: "isNewArrival",
      render: (isNewArrival) => {
        const isActive = isNewArrival === true;
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isNewArrival ? "New Arrival" : "Not New Arrival"}
          </div>
        )
      },
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-gray-500" />}
            className="hover:!text-blue-600 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              route.push(`/dashboard/product/${record.id}/edit`);
            }}
          />
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              loading={global.loading?.delete}
              icon={<DeleteOutlined />}
              className="hover:bg-red-50"
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-global-primary-fontfamily">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search products..."
            className="w-full sm:w-64 rounded-xl border-gray-200 hover:border-black focus:border-black transition-colors"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
            onClick={() => route.push('/dashboard/product/new')}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          loading={global.loading.loading}
          dataSource={filteredProducts}
          columns={columns}
          pagination={{
            pageSize: 10,
            position: ["bottomRight"],
            showSizeChanger: true,
          }}
          size="middle"
          scroll={{ x: 800 }}
          rowClassName="hover:bg-gray-50 transition-colors cursor-default group"
        />
      </div>
    </div>
  );
};

export default ProductList;
