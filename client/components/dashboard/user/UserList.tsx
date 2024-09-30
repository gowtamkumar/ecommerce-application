import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
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
import { toast } from "react-toastify";
import { deleteUser, getUsers } from "@/lib/apis/user";
import dayjs from "dayjs";

interface DataType {
  key: string;
  name: string;
  username: string;
  type: any;
  email: string;
  dob: string;
  phone: string;
  point: number;
  image: string;
  lastLogin: string;
  lastLogout: string;
  ipAddress: string;
  diviceId: string;
  status: any;
}

type DataIndex = keyof DataType;

const UserList: React.FC = () => {
  const [user, setUsers] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getUsers();      
      setUsers(res?.data);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteUser(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("User deleted successfully");
        dispatch(setAction({}));
      }, 500);
    } catch (error: any) {
      toast.error(error);
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
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
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
        setTimeout(() => searchInput.current?.select(), 100);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.length - b.username.length,
      ...getColumnSearchProps("username"),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      ...getColumnSearchProps("type"),
    },

    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },

    {
      ...getColumnSearchProps("dob"),
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (value) => (
        <p>{value && dayjs(value).format("DD-MM-YYYY h:mm A")}</p>
      ),
      sorter: (a, b) => a.dob?.length - b.dob?.length,
    },
    {
      title: "Point",
      dataIndex: "point",
      key: "point",
      // sorter: (a, b) => a.point.length - b.point.length,
      ...getColumnSearchProps("point"),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (value) => (
        <Image
          width={60}
          alt={value}
          src={`http://localhost:3900/uploads/${value || "no-data.png"}`}
        />
      ),
    },
    {
      ...getColumnSearchProps("lastLogin"),
      title: "last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      sorter: (a, b) => a.lastLogin?.length - b.lastLogin?.length,
      render: (value) => (
        <p>{value && dayjs(value).format("DD-MM-YYYY h:mm A")}</p>
      ),
    },
    {
      title: "last Logout",
      dataIndex: "lastLogout",
      key: "lastLogout",
      sorter: (a, b) => a.lastLogout?.length - b.lastLogout?.length,
      ...getColumnSearchProps("lastLogout"),
      render: (value) => (
        <p>{value && dayjs(value).format("DD-MM-YYYY h:mm A")}</p>
      ),
    },

    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      sorter: (a, b) => a.ipAddress?.length - b.ipAddress?.length,
      ...getColumnSearchProps("ipAddress"),
    },
    {
      title: "Divice IP",
      dataIndex: "diviceId",
      key: "diviceId",
      sorter: (a, b) => a.diviceId?.length - b.diviceId?.length,
      ...getColumnSearchProps("diviceId"),
    },
    {
      ...getColumnSearchProps("status"),
      title: "Status",
      key: "status",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.status.length - b.status.length,
      render: (value) => (
        <Tag color={value.status === "Active" ? "green" : "red"}>
          {value.status}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      sortDirections: ["descend", "ascend"],
      className: "text-end",
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
                  url: `http://localhost:3900/uploads/${newData.image || "no-data.png"
                    }`,
                };
                newData.fileList = [file];
              }
              dispatch(
                setAction({
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
                this User?
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
      dataSource={user}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default UserList;
