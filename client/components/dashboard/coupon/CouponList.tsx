"use client";
import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteCoupon, getCoupons } from "@/lib/apis/admin/coupon";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import {
    selectGlobal,
    setAction,
    setLoading,
    setSearchedColumn,
    setSearchText,
} from "@/redux/features/global/globalSlice";
import {
    BarcodeOutlined,
    CalendarOutlined,
    CheckOutlined,
    CopyOutlined,
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    EyeOutlined,
    PercentageOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    TeamOutlined
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, message, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: string;
  type: string;
  code: string;
  discountType: string;
  value: string;
  startDate: string;
  expiryDate: string;
  minOrderAmount: string;
  maxUser: string;
  mincartValue: string;
  maxDiscountValue: string;
  usageLimit: string;
  usagePerUser: string;
  active: boolean;
}

type DataIndex = keyof DataType;

const CouponList: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const searchInput = React.useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const { formatPrice } = useCurrency();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    message.success(`Copied coupon code: ${code}`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const fetchData = useCallback(
    async (page: number, limit: number) => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getCoupons({ page, limit });
        if (res?.error) {
          errorNotification({ message: res.error });
          setCoupons([]);
          setTotal(0);
          return;
        }
        setCoupons(res?.data || []);
        const totalCount =
          res?.total !== undefined
            ? res.total
            : res?.totalItem !== undefined
            ? res.totalItem
            : res?.data?.length || 0;
        setTotal(totalCount);
      } catch (err: any) {
        errorNotification({ message: err?.message || "Failed to load coupons" });
        setCoupons([]);
        setTotal(0);
      } finally {
        dispatch(setLoading({ loading: false }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [fetchData, currentPage, pageSize, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ save: true }));
    try {
      await deleteCoupon(id);
      successNotification({ message: "Successfully deleted" });
      fetchData(currentPage, pageSize);
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ save: false }));
      dispatch(setAction({}));
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    dispatch(setSearchText(selectedKeys[0]));
    dispatch(setSearchedColumn(dataIndex));
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    dispatch(setSearchText(""));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
          onChange={(e) => {
            if (searchInput.current) {
              searchInput.current.input?.focus();
            }
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      Boolean(
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      ),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput, 100);
        }
      },
    },
    render: (text) =>
      global.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[global.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      width: 220,
      sorter: (a, b) => (a.code || "").localeCompare(b.code || ""),
      ...getColumnSearchProps("code"),
      render: (text, record: any) => {
        const couponCode =
          text ||
          record?.code ||
          record?.couponCode ||
          record?.coupon_code ||
          record?.coupon;

        if (!couponCode) {
          return <span className="text-gray-400 text-xs italic">—</span>;
        }

        return (
          <div className="flex items-center gap-2 max-w-[210px]">
            <span className="inline-flex items-center gap-1.5 font-mono px-2.5 py-1 bg-purple-50 rounded-lg border border-purple-200 text-purple-700 font-bold uppercase tracking-wider text-xs shadow-xs truncate">
              <BarcodeOutlined className="text-purple-500 text-sm shrink-0" />
              <span className="truncate">{couponCode}</span>
            </span>
            <Tooltip title={copiedCode === couponCode ? "Copied!" : "Copy code"}>
              <Button
                type="text"
                size="small"
                icon={
                  copiedCode === couponCode ? (
                    <CheckOutlined className="text-xs text-green-600" />
                  ) : (
                    <CopyOutlined className="text-xs text-gray-500 hover:text-purple-600" />
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyCode(couponCode);
                }}
                className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md hover:bg-purple-50 transition-colors"
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
      render: (value) => (
        <Tag color={value === "Order" ? "blue" : "cyan"} className="rounded-full px-3 font-medium border-none py-0.5">
          {value}
        </Tag>
      ),
    },
    {
      title: "Disc. Type",
      dataIndex: "discountType",
      key: "discountType",
      sorter: (a, b) => a.discountType.length - b.discountType.length,
      ...getColumnSearchProps("discountType"),
      render: (value) => (
        <Tag
          icon={value === "Percentage" ? <PercentageOutlined /> : <DollarOutlined />}
          color={value === "Percentage" ? "orange" : "green"}
          className="rounded-full px-3 font-medium border-none py-0.5"
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Discount Value",
      key: "value_display",
      render: (_, record: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg">
            {record.discountType === "Percentage" ? `${record.value}%` : formatPrice(record.value)}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-medium">Off total</span>
        </div>
      ),
    },
    {
      title: "Validity Period",
      key: "validity",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-gray-400" />
            <span className="font-medium">From:</span>
            <span>{record.startDate && dayjs(record.startDate).format("MMM DD, YYYY")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-red-400" />
            <span className="font-medium">To:</span>
            <span className="text-red-600 font-medium">{record.expiryDate && dayjs(record.expiryDate).format("MMM DD, YYYY")}</span>
          </div>
        </div>
      ),
    },
    {
      ...getColumnSearchProps("usageLimit"),
      title: "Usage",
      key: "usage",
      render: (value) => (
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-gray-400" />
          <span className="text-gray-700 font-medium">{value.usageLimit}</span>
          <span className="text-xs text-gray-400">Limit</span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "active",
      ...getColumnSearchProps("active"),
      sortDirections: ["descend", "ascend"],
      render: (record) => {
        return (
          <Tag
            color={record.active ? "success" : "error"}
            className="rounded-full px-3 font-medium border-none py-0.5"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${record.active ? 'bg-green-500' : 'bg-red-500'}`} />
            {record.active ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="View Details">
            <Button
              size="middle"
              type="text"
              icon={<EyeOutlined className="text-blue-500" />}
              className="hover:bg-blue-50"
              onClick={() =>
                dispatch(
                  setAction({
                    coupon: true,
                    type: ActionType.VIEW,
                    payload: value,
                  })
                )
              }
            />
          </Tooltip>

          <Tooltip title="Edit Coupon">
            <Button
              size="middle"
              type="text"
              icon={<EditOutlined className="text-green-500" />}
              className="hover:bg-green-50"
              onClick={() => route.push(`/dashboard/coupons/${value.id}`)}
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Coupon?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="bottomRight"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Delete Coupon">
              <Button
                size="middle"
                type="text"
                danger
                loading={global.loading?.delete}
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        scroll={{ x: "auto" }}
        loading={global.loading.loading}
        columns={columns}
        rowKey="id"
        dataSource={coupons}
        pagination={false}
        size="middle"
        className="modern-table"
        rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
      />

      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white">
        <span className="text-xs text-gray-500 font-medium">
          Showing{" "}
          <strong>
            {total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            -
            {Math.min(currentPage * pageSize, total)}
          </strong>{" "}
          of <strong>{total}</strong> coupons
        </span>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          hideOnSinglePage={false}
          pageSizeOptions={["5", "10", "20", "50", "100"]}
          showQuickJumper
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          size="middle"
        />
      </div>
    </div>
  );
};

export default CouponList;
