import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableColumnType } from "antd";
import { Button, Image, Input, Popconfirm, Space, Table, Tag } from "antd";
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
  FormOutlined,
  RestOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { deleteBanner, getBanners } from "@/lib/apis/banner";
import appConfig from "@/appConfig";
import { errorNotification, successNotification } from "@/lib/utils/notification";

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

  useEffect(() => {
    fetchData();
  }, [global.action]);

  const fetchData = async () => {
    dispatch(setLoading({ loading: true }));
    try {
      const res = await getBanners();
      setBanners(res.data);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };


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
          value={selectedKeys[0]}
          onChange={(e) => {
            setSearchInput(e.target.value)
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          }
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.length - b.title.length,
      ...getColumnSearchProps("title"),
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => (
        <Image
          width={60}
          alt={value}
          src={`${appConfig.baseApiUrl}/uploads/${value || "no-data.png"}`}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
      ...getColumnSearchProps("active"),
      title: "Active",
      key: "active",
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Tag color={value.active ? "green" : "red"}>
          {value.active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      sortDirections: ["descend", "ascend"],
      className: "text-end",
      width: "12%",
      render: (value) => (
        <div className="gap-2">
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            className="me-1"
            onClick={() => {
              const newData = { ...value };
              if (newData.image) {
                const file = {
                  uid: Math.random() * 1000 + "",
                  name: `image`,
                  status: "done",
                  fileName: newData.image,
                  url: `${appConfig.baseApiUrl}/uploads/${newData.image || "no-data.png"
                    }`,
                };
                newData.fileList = [file];
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
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
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
      dataSource={Banners}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default BannerList;
