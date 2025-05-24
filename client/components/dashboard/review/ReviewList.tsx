import React, { useCallback, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { deleteReview, getReviews } from "@/lib/apis/review";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  FormOutlined,
  RestOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";

interface DataType {
  key: string;
  product: any;
  rating: number;
  comment: string;
  status: string;
}

type DataIndex = keyof DataType;

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getReviews();
      setReviews(res?.data);
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
      await deleteReview(id);
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              dispatch(setSearchText((selectedKeys as string[])[0]));
              dispatch(setSearchedColumn(dataIndex));
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
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
      ...getColumnSearchProps("product"),
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (value) => <div>{value.name}</div>,
    },

    {
      ...getColumnSearchProps("rating"),
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },

    {
      ...getColumnSearchProps("comment"),
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      // sorter: (a, b) => a.comment.length - b.rating.length,
    },

    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.status.length - b.status.length,
      render: (value) => (
        <Tag
          color={
            value.status === "Approved"
              ? "green"
              : value.status === "Pending"
              ? "yellow"
              : "red"
          }
        >
          {value.status}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      sortDirections: ["descend", "ascend"],
      className: "text-end",
      width: "8%",
      render: (value) => (
        <div className="flex gap-2">
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            onClick={() =>
              dispatch(
                setAction({
                  review: true,
                  type: ActionType.UPDATE,
                  payload: value,
                })
              )
            }
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this Review?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              size="small"
              danger
              loading={global.loading?.delete}
              icon={<RestOutlined />}
            />
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
      dataSource={reviews}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default ReviewList;
