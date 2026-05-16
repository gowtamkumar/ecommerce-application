import React, { useCallback, useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Avatar } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  RestOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  PictureOutlined
} from "@ant-design/icons";
import { ActionType } from "@/constants/constants";

import { deleteWishlist, getWishlists } from "@/lib/apis/wishlist";
import dayjs from "dayjs";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";

interface DataType {
  id: string;
  key: string;
  product: any;
  user: any;
  createdAt: string;
}

type DataIndex = keyof DataType;

const WishlistsList: React.FC = () => {
  const [wishlists, setWishLists] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async (page: number, limit: number) => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getWishlists(page, limit);
      if (res?.success) {
        setWishLists(res.data);
        setTotal(res.meta?.total || 0);
      }
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [fetchData, currentPage, pageSize, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ delete: true }));
    try {
      await deleteWishlist(id);
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
    onFilter: (value, record) => {
      // Custom filter logic based on nested objects
      const textToSearch = dataIndex === "product" 
        ? record.product?.name || ""
        : dataIndex === "user"
        ? record.user?.name || ""
        : record[dataIndex];
        
      return textToSearch
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput, 100);
        }
      },
    },
    render: (text, record) => {
      let displayText = text;
      if (dataIndex === "product") displayText = record.product?.name || "Unknown Product";
      if (dataIndex === "user") displayText = record.user?.name || "Unknown User";

      return global.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[global.searchText]}
          autoEscape
          textToHighlight={displayText ? displayText.toString() : ""}
        />
      ) : (
        displayText
      );
    }
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: 300,
      sorter: (a, b) => (a.product?.name || "").localeCompare(b.product?.name || ""),
      ...getColumnSearchProps("product"),
      render: (value, record) => {
        const displayText = record.product?.name || "Unknown Product";
        return (
          <div className="flex items-center gap-3">
             <Avatar
              shape="square"
              size={48}
              src={record.product?.thumbnailImage ? getUploadImageUrl(record.product.thumbnailImage) : undefined}
              icon={!record.product?.thumbnailImage && <PictureOutlined />}
              className="border border-gray-200"
            />
            <div className="font-semibold text-gray-800">
               {global.searchedColumn === "product" ? (
                  <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[global.searchText]}
                    autoEscape
                    textToHighlight={displayText.toString()}
                  />
                ) : (
                  displayText
                )}
            </div>
          </div>
        );
      },
    },
    {
      ...getColumnSearchProps("user"),
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 250,
      sorter: (a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""),
      render: (value, record) => {
        const displayText = record.user?.name || "Unknown User";
        return (
          <div className="flex items-center gap-3">
             <Avatar
              size={40}
              src={record.user?.image ? getUploadImageUrl(record.user.image) : undefined}
              icon={!record.user?.image && <UserOutlined />}
              className="border border-gray-200"
            />
            <div>
              <div className="font-medium text-gray-900">
                {global.searchedColumn === "user" ? (
                    <Highlighter
                      highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                      searchWords={[global.searchText]}
                      autoEscape
                      textToHighlight={displayText.toString()}
                    />
                  ) : (
                    displayText
                  )}
              </div>
              <div className="text-xs text-gray-500">{record.user?.email || ""}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value) => (
         <div className="text-sm">
            <div className="text-gray-900">{dayjs(value).format("DD MMM YYYY")}</div>
            <div className="text-gray-500">{dayjs(value).format("h:mm A")}</div>
          </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: 100,
      className: "text-end",
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-red-600 font-bold">delete</span>{" "}
                this Wishlist item?
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
              className="hover:!bg-red-50"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      columns={columns}
      rowKey="id"
      dataSource={wishlists}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
      size="middle"
      className="modern-table"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default WishlistsList;
