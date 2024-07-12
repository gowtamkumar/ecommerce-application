/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
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
import { deleteShippingAddress, getShippingAddress } from "@/lib/apis/address";

interface DataType {
  key: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
}

type DataIndex = keyof DataType;

const ShippingAddressList: React.FC = () => {
  const [address, setAddress] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getShippingAddress();
      setAddress(res?.data);
      dispatch(setLoading({ loading: false }));
    })();
  }, [global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteShippingAddress(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Address deleted successfully");
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
      title: "Address Line 1",
      dataIndex: "addressLine1",
      key: "addressLine1",
      // width: "15%",
      // responsive: ['sm'],
      sorter: (a, b) => a.addressLine1.length - b.addressLine1.length,
      ...getColumnSearchProps("addressLine1"),
    },
    {
      title: "Address Line 2",
      dataIndex: "addressLine2",
      key: "addressLine2",
      // width: "15%",
      // responsive: ['md'],
      sorter: (a, b) => a.addressLine2.length - b.addressLine2.length,
      ...getColumnSearchProps("addressLine2"),
    },

    {
      title: "State",
      dataIndex: "state",
      key: "state",
      // width: "15%",
      // responsive: ['md'],
      sorter: (a, b) => a.state.length - b.state.length,
      ...getColumnSearchProps("state"),
    },

    {
      title: "City",
      dataIndex: "city",
      key: "city",
      // width: "15%",
      // responsive: ['md'],
      sorter: (a, b) => a.city.length - b.city.length,
      ...getColumnSearchProps("city"),
    },

    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      // width: "15%",
      // responsive: ['md'],
      sorter: (a, b) => a.country.length - b.country.length,
      ...getColumnSearchProps("country"),
    },

    {
      title: "Zip Code",
      dataIndex: "zipCode",
      key: "zipCode",
      // width: "15%",
      // responsive: ['md'],

      sorter: (a, b) => a.zipCode.length - b.zipCode.length,
      ...getColumnSearchProps("zipCode"),
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
            onClick={() =>
              dispatch(
                setAction({
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
                this Address?
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
      dataSource={address}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default ShippingAddressList;
