"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Image, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
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
import { ActionType } from "@/constants/constants";
import { deleteBanner, getBanners } from "@/lib/apis/banner";
import appConfig from "@/appConfig";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { imageSetFile } from "@/lib/utils/imageSetFile";

interface DataType {
  key: string;
  title: string;
  image: string;
  url: string;
  type: string;
  description: string;
  active: boolean;
}

type DataIndex = keyof DataType;

const BannerList: React.FC = () => {
  const [Banners, setBanners] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getBanners();
      setBanners(res.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, global.action]);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ delete: true }));
    try {
      await deleteBanner(id);
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps("title"),
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (value) => (
        <Image
          width={60}
          height={40}
          alt={value}
          src={getImageUrl(value)}
          className="rounded-lg object-cover border border-gray-200"
        />
      ),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text) => text ? (
        <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </a>
      ) : "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text ? (
        <span className="text-gray-600">{text.length > 40 ? `${text.substring(0, 40)}...` : text}</span>
      ) : "-",
    },
    {
      ...getColumnSearchProps("active"),
      title: "Status",
      key: "active",
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Tag color={value.active ? "green" : "red"} className="font-medium">
          {value.active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Tooltip title="Edit Banner">
            <Button
              size="small"
              icon={<EditOutlined />}
              className="hover:!bg-green-50 hover:!text-green-600"
              onClick={() => {
                const newData = { ...value };
                if (newData.image) {
                  newData.fileList = [imageSetFile(newData.image)];
                }
                dispatch(
                  setAction({
                    banner: true,
                    type: ActionType.UPDATE,
                    payload: newData,
                  })
                );
              }}
            />
          </Tooltip>
          <Popconfirm
            title={
              <span>
                Are you sure <span className="font-bold text-red-600">delete</span>{" "}
                this Banner?
              </span>
            }
            onConfirm={() => handleDelete(value.id)}
            placement="left"
            okText="Yes"
            okType="danger"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Tooltip title="Delete Banner">
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
      dataSource={Banners}
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

export default BannerList;
