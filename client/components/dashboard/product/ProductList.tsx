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
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import {
    Button,
    Image,
    Input,
    Popconfirm,
    Segmented,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FiBell,
    FiBox,
    FiCheckCircle,
    FiPackage,
    FiRefreshCw,
    FiStar,
} from "react-icons/fi";
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
  isNewArrival: boolean;
  isReturnable: boolean;
  limitPurchaseQty: number;
  alertQty: number;
  discount: Discount;
  status: string;
  thumbnailImage?: string;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  count,
  color,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left w-full
        ${active
          ? "border-gray-400 bg-gray-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 leading-tight">{count}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </button>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <FiPackage className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        No products found
      </h3>
      <p className="text-sm text-gray-500 mb-5 max-w-xs">
        Try adjusting your search or filters, or add a new product to your
        catalog.
      </p>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdd}
        style={{ borderRadius: "var(--button-border-radius)" }}
      >
        Add Product
      </Button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const ProductList = () => {
  const [products, setProducts] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const res = await getProducts();
      const newProducts = res.data.map((item: any) => ({
        ...item,
        key: item.id,
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

  // ── Debounced search ─────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteProduct(id);
      fetchData();
      successNotification({ message: "Product deleted successfully" });
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
      dispatch(setAction({}));
    }
  };

  // ── KPI counts ───────────────────────────────────────────────────────────
  const kpis = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "Active").length,
      featured: products.filter((p) => p.featured).length,
      newArrival: products.filter((p) => p.isNewArrival).length,
    }),
    [products]
  );

  // ── Filtered list ────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = products;

    // KPI filter
    if (kpiFilter === "active") list = list.filter((p) => p.status === "Active");
    else if (kpiFilter === "featured") list = list.filter((p) => p.featured);
    else if (kpiFilter === "newArrival") list = list.filter((p) => p.isNewArrival);

    // Status tab
    if (statusFilter !== "All") {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    return list;
  }, [products, kpiFilter, statusFilter, debouncedSearch]);

  // ── Toggle KPI filter ────────────────────────────────────────────────────
  const toggleKpi = (key: string) => {
    setKpiFilter((prev) => (prev === key ? null : key));
    setStatusFilter("All");
  };

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns: TableColumnsType<DataType> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      width: 280,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => route.push(`/dashboard/product/${record.id}`)}
        >
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
            <Image
              width={44}
              height={44}
              src={getUploadImageUrl(record.thumbnailImage)}
              alt={text}
              preview={false}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
              {text}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {record.variant ? "Has Variants" : "Simple Product"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: 120,
      render: (value) =>
        value?.value ? (
          <Tag className="border-0 bg-purple-50 text-purple-700 rounded-full px-2.5">
            {value.value}
            {value.discountStrategy === "Percentage" ? "%" : " BDT"} OFF
          </Tag>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => {
        const isActive = status === "Active";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-400"
              }`}
            />
            {status}
          </span>
        );
      },
    },
    {
      title: "Flags",
      key: "flags",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-1 flex-wrap">
          {record.featured && (
            <Tooltip title="Featured">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-500">
                <FiStar className="w-3 h-3" />
              </span>
            </Tooltip>
          )}
          {record.isNewArrival && (
            <Tooltip title="New Arrival">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-500">
                <FiBell className="w-3 h-3" />
              </span>
            </Tooltip>
          )}
          {record.isReturnable && (
            <Tooltip title="Returnable">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-500">
                <FiRefreshCw className="w-3 h-3" />
              </span>
            </Tooltip>
          )}
          {!record.featured && !record.isNewArrival && !record.isReturnable && (
            <span className="text-gray-300 text-sm">—</span>
          )}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record) => (
        <div className="flex gap-1 justify-end">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-gray-400" />}
              className="hover:text-blue-600 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                route.push(`/dashboard/product/${record.id}/edit`);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                loading={global.loading?.delete}
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Products
            </h1>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {kpis.total} items
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search products..."
            value={searchText}
            onChange={handleSearchChange}
            allowClear
            className="w-full sm:w-60"
            style={{ borderRadius: "var(--button-border-radius)" }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="h-9 px-5 font-medium shrink-0"
            style={{ borderRadius: "var(--button-border-radius)" }}
            onClick={() => route.push("/dashboard/product/new")}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          icon={FiBox}
          label="Total Products"
          count={kpis.total}
          color="bg-gray-100 text-gray-600"
          active={kpiFilter === null && statusFilter === "All"}
          onClick={() => {
            setKpiFilter(null);
            setStatusFilter("All");
          }}
        />
        <KpiCard
          icon={FiCheckCircle}
          label="Active"
          count={kpis.active}
          color="bg-green-50 text-green-600"
          active={kpiFilter === "active"}
          onClick={() => toggleKpi("active")}
        />
        <KpiCard
          icon={FiStar}
          label="Featured"
          count={kpis.featured}
          color="bg-amber-50 text-amber-500"
          active={kpiFilter === "featured"}
          onClick={() => toggleKpi("featured")}
        />
        <KpiCard
          icon={FiBell}
          label="New Arrivals"
          count={kpis.newArrival}
          color="bg-blue-50 text-blue-500"
          active={kpiFilter === "newArrival"}
          onClick={() => toggleKpi("newArrival")}
        />
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Status tab filter */}
        <div className="px-5 pt-4 pb-0 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <Segmented
            options={["All", "Active", "Inactive"]}
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as string);
              setKpiFilter(null);
            }}
            className="bg-gray-100"
          />
          {(debouncedSearch || statusFilter !== "All" || kpiFilter) && (
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors pb-3"
              onClick={() => {
                setSearchText("");
                setDebouncedSearch("");
                setStatusFilter("All");
                setKpiFilter(null);
              }}
            >
              <FiRefreshCw className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        <Table
          loading={global.loading.loading}
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}–${range[1]} of ${total} products`,
            className: "px-5 py-3",
          }}
          size="middle"
          scroll={{ x: 700 }}
          rowClassName="hover:bg-gray-50/60 transition-colors cursor-default"
          locale={{
            emptyText: (
              <EmptyState onAdd={() => route.push("/dashboard/product/new")} />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default ProductList;
