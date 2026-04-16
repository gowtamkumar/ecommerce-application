import { ActionType } from "@/constants/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteDiscount, getDiscounts } from "@/lib/apis/discount";
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
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TagsOutlined,
  SkinOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
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
  const [discounts, setDiscounts] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();
  const { formatPrice } = useCurrency();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getDiscounts();
      if (res.error) {
        errorNotification({ message: res.error });
        return;
      }
      setDiscounts(res?.data);
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
    dispatch(setLoading({ delete: true }));
    try {
      await deleteDiscount(id);
      successNotification({ message: "Successfully deleted" });
      fetchData();
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
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
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
      width: 180,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="View Details">
            <Button
              size="middle"
              type="text"
              icon={<EyeOutlined className="text-blue-500" />}
              className="hover:!bg-blue-50"
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
              className="hover:!bg-green-50"
              onClick={() => route.push(`/dashboard/discounts/${value.id}`)}
            />
          </Tooltip>

          <Tooltip title="Change Status">
            <Button
              size="middle"
              type="text"
              icon={<TbStatusChange className="text-purple-500" />}
              className="hover:!bg-purple-50"
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
                className="hover:!bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      rowKey="id"
      dataSource={discounts}
      pagination={{
        pageSize: 10,

        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
    />
  );
};

export default DiscountList;
