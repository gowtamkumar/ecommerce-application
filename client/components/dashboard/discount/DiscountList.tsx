import { ActionType } from "@/constants/constants";
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
          value={selectedKeys[0]}
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput, 100);
      }
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
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
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
        return <Tag color={colorMap[value] || "default"}>{value}</Tag>;
      },
    },
    {
      ...getColumnSearchProps("discountStrategy"),
      title: "Type",
      dataIndex: "discountStrategy",
      key: "discountStrategy",
      sorter: (a, b) => a.discountStrategy.length - b.discountStrategy.length,
      render: (value) => (
        <Tag color={value === "Percentage" ? "blue" : "green"}>
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
      render: (value, record) => (
        <span className="font-medium text-gray-700">
          {record.discountStrategy === "Percentage" ? `${value}%` : `৳${value}`}
        </span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => a.startDate.length - b.startDate.length,
      render: (value) => (
        <span className="text-gray-600">
          {value ? dayjs(value).format("MMM DD, YYYY") : "N/A"}
        </span>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => a.endDate.length - b.endDate.length,
      render: (value) => (
        <span className="text-gray-600">
          {value ? dayjs(value).format("MMM DD, YYYY") : "N/A"}
        </span>
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
            className="font-medium"
          >
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
          color={value.status === "Active" ? "green" : "red"}
          className="font-medium"
        >
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
              size="small"
              icon={<EyeOutlined />}
              className="hover:!bg-blue-50 hover:!text-blue-600"
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
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() => route.push(`/dashboard/discounts/${value.id}`)}
            />
          </Tooltip>

          <Tooltip title="Change Status">
            <Button
              size="small"
              icon={<TbStatusChange />}
              className="hover:!bg-purple-50 hover:!text-purple-600"
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
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Discount">
              <Button
                size="small"
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
      dataSource={discounts}
      pagination={{
        pageSize: 10,
        position: ["bottomRight"],
        showSizeChanger: true,
      }}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
    />
  );
};

export default DiscountList;
