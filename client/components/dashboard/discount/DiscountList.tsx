import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteDiscount, getDiscounts } from "@/lib/apis/discount";
import { getImageUrl } from "@/lib/utils/imageUrl";
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
    AppstoreOutlined,
    CalendarOutlined,
    CopyOutlined,
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    ExportOutlined,
    EyeOutlined,
    GlobalOutlined,
    LinkOutlined,
    PercentageOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    ShoppingOutlined,
    SkinOutlined,
    TagsOutlined
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Image, Input, message, Pagination, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { TbStatusChange } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

interface DataType {
  key: string;
  name: string;
  image?: string;
  discountStrategy: string;
  value: number;
  slug: string;
  status: string;
  startDate: string;
  endDate: string;
  scope: string;
  promotionType: string;
}

type DataIndex = keyof DataType;

const DiscountList: React.FC = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(
    async (page: number, limit: number) => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getDiscounts({ page, perPage: limit });
        if (res?.error) {
          errorNotification({ message: res.error });
          setDiscounts([]);
          setTotal(0);
          return;
        }
        setDiscounts(res?.data || []);
        const totalCount =
          res?.totalItem !== undefined
            ? res.totalItem
            : res?.total !== undefined
            ? res.total
            : res?.data?.length || 0;
        setTotal(totalCount);
      } catch (err: any) {
        errorNotification({ message: err?.message || "Failed to load discounts" });
        setDiscounts([]);
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
    dispatch(setLoading({ delete: true }));
    try {
      await deleteDiscount(id);
      successNotification({ message: "Successfully deleted" });
      fetchData(currentPage, pageSize);
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ delete: false }));
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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
          onChange={(e) => {
            setSearchInput(e.target.value);
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
      title: "Banner",
      dataIndex: "image",
      key: "image",
      width: 90,
      render: (image: string) =>
        image ? (
          <Image
            width={64}
            height={38}
            alt="Discount Banner"
            src={getImageUrl(image)}
            fallback="/default-placeholder.png"
            className="rounded-lg object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-16 h-9 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        ),
    },
    {
      ...getColumnSearchProps("name"),
      title: "Discount Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      render: (text) => (
        <span className="font-semibold text-gray-900 block min-w-[120px]">{text}</span>
      ),
    },
    {
      title: "Offer URL",
      key: "offerUrl",
      width: 200,
      render: (_, record: any) => {
        const slug = record.slug;
        if (!slug) return <span className="text-gray-400 text-xs">—</span>;
        const offerSlugPath = slug.startsWith("/") ? slug : `/${slug}`;
        const offerFullPath = `/offers${offerSlugPath}`;
        return (
          <div className="flex items-center gap-1.5 max-w-[210px]">
            <a
              href={offerFullPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/80 text-xs font-mono font-medium transition-colors max-w-[160px] truncate"
              title={`Visit ${offerFullPath}`}
            >
              <LinkOutlined className="text-blue-500 shrink-0 text-xs" />
              <span className="truncate">{offerSlugPath}</span>
              <ExportOutlined className="text-[10px] text-blue-400 shrink-0" />
            </a>
            <Tooltip title="Copy offer URL">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined className="text-xs text-gray-500 hover:text-gray-800" />}
                onClick={() => {
                  navigator.clipboard.writeText(offerSlugPath);
                  message.success(`Copied: ${offerSlugPath}`);
                }}
                className="shrink-0 h-7 w-7 flex items-center justify-center rounded-md hover:bg-gray-100"
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Scope",
      dataIndex: "scope",
      key: "scope",
      sorter: (a, b) => a.scope.length - b.scope.length,
      render: (value) => {
        const colorMap: Record<string, string> = {
          Global: "purple",
          Product: "green",
          Products: "blue",
          Category: "orange",
          Brand: "cyan",
        };
        const iconMap: Record<string, any> = {
          Global: <GlobalOutlined />,
          Product: <SkinOutlined />,
          Products: <ShoppingOutlined />,
          Category: <AppstoreOutlined />,
          Brand: <TagsOutlined />,
        };
        return (
          <Tag color={colorMap[value] || "default"} className="rounded-full px-3 py-0.5 border-none font-medium">
            <span className="mr-1">{iconMap[value]}</span>
            {value}
          </Tag>
        );
      },
    },
    {
      ...getColumnSearchProps("discountStrategy"),
      title: "Type",
      dataIndex: "discountStrategy",
      key: "discountStrategy",
      sorter: (a, b) => a.discountStrategy.length - b.discountStrategy.length,
      render: (value) => (
        <Tag 
          icon={value === "Percentage" ? <PercentageOutlined /> : <DollarOutlined />}
          color={value === "Percentage" ? "orange" : "cyan"} 
          className="rounded-full px-3 py-0.5 border-none font-medium"
        >
          {value === "Percentage" ? "Percentage" : "Fixed Amount"}
        </Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value - b.value,
      ...getColumnSearchProps("value"),
      render: (value, record: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg">
            {record.discountStrategy === "Percentage" ? `${value}%` : formatPrice(value)}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-medium">Discount</span>
        </div>
      ),
    },
    {
      title: "Campaign Duration",
      key: "duration",
      render: (_, record: any) => (
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-gray-400" />
            <span className="font-medium">Starts:</span>
            <span>{record.startDate ? dayjs(record.startDate).format("MMM DD, YYYY") : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CalendarOutlined className="text-gray-400" />
            <span className="font-medium">Ends:</span>
            <span>{record.endDate ? dayjs(record.endDate).format("MMM DD, YYYY") : "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Expiry",
      key: "Expiry",
      render: (value) => {
        const isExpired = dayjs(value.endDate).isBefore(dayjs());
        return (
          <Tag
            color={isExpired ? "red" : "green"}
            className="rounded-full px-3 py-0.5 border-none font-medium"
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${isExpired ? 'bg-red-500' : 'bg-green-500'}`} />
            {isExpired ? "Expired" : "Active"}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Tag
          color={value.status === "Active" ? "success" : "error"}
          className="rounded-full px-3 py-0.5 border-none font-medium"
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${value.status === "Active" ? 'bg-green-500' : 'bg-red-500'}`} />
          {value.status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 210,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          {value.slug && (
            <Tooltip title="Open Public Offer Page">
              <Button
                size="middle"
                type="text"
                icon={<ExportOutlined className="text-indigo-500" />}
                className="hover:bg-indigo-50"
                onClick={() => window.open(`/offers/${value.slug}`, "_blank")}
              />
            </Tooltip>
          )}

          <Tooltip title="View Details">
            <Button
              size="middle"
              type="text"
              icon={<EyeOutlined className="text-blue-500" />}
              className="hover:bg-blue-50"
              onClick={() =>
                dispatch(
                  setAction({
                    discount: true,
                    type: ActionType.VIEW,
                    payload: value,
                  })
                )
              }
            />
          </Tooltip>

          <Tooltip title="Edit Discount">
            <Button
              size="middle"
              type="text"
              icon={<EditOutlined className="text-green-500" />}
              className="hover:bg-green-50"
              onClick={() => route.push(`/dashboard/discounts/${value.id}`)}
            />
          </Tooltip>

          <Tooltip title="Change Status">
            <Button
              size="middle"
              type="text"
              icon={<TbStatusChange className="text-purple-500" />}
              className="hover:bg-purple-50"
              onClick={() =>
                dispatch(
                  setAction({
                    type: ActionType.UPDATE,
                    payload: value,
                  })
                )
              }
            />
          </Tooltip>

          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Discount?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="bottomRight"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined className="text-red-500" />}
          >
            <Tooltip title="Delete Discount">
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
        dataSource={discounts}
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
          of <strong>{total}</strong> discounts
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

export default DiscountList;
