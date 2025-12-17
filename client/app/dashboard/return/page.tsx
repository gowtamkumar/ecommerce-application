"use client";
import ReturnOrderStatusUpdate from "@/components/dashboard/return/ReturnOrderStatusUpdate";
import { ActionType } from "@/constants/constants";
import { deleteReturn, getReturns } from "@/lib/apis/return";
import { getStatus } from "@/lib/utils/getStatus";
import {
  selectGlobal,
  setAction,
  setLoading,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import {
  CheckOutlined,
  QuestionCircleOutlined,
  RestOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType, TabsProps } from "antd";
import {
  Button,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface DataType {
  key: React.Key;
  id: number;
  orderId: number;
  reason: string;
  status: string;
  requestedQty: number;
  approvedQty: number;
  image?: string;
  createdAt: string;
  user?: { name: string; phone: string };
  product?: { name: string };
}

type DataIndex = keyof DataType;

const Page: React.FC = () => {
  const [tabKey, setTabKey] = useState("Requested");
  const [returns, setReturns] = useState([]);
  const [allReturns, setAllReturns] = useState([]);
  const [searchInput, setSearchInput] = useState(null) as any;
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      try {
        const res = await getReturns();
        console.log("returns res", res);
        const data = res.data || [];
        setAllReturns(data);
        const filtered = data.filter((r: any) => r.status === tabKey);
        setReturns(
          filtered.map((item: any) => ({ ...item, key: item.id.toString() }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch returns");
      }
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  useEffect(() => {
    if (allReturns.length > 0) {
      const filtered = allReturns.filter((r: any) => r.status === tabKey);
      setReturns(
        filtered.map((item: any) => ({ ...item, key: item.id.toString() }))
      );
    }
  }, [tabKey, allReturns]);

  const handleDelete = async (id: number) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteReturn(id); // Ensure deleteReturn exists in API
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Return request deleted successfully");
        dispatch(setAction({ type: ActionType.DELETE })); // Trigger refresh
      }, 500);
    } catch (error: any) {
      console.log("v", error);
      toast.error(error.message || "Failed to delete");
    }
  };

  const onChange = (key: string) => {
    setTabKey(key);
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
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            setSearchInput(e.target.value);
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
      (record[dataIndex] || "")
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      global?.searchedColumn === dataIndex ? (
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
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      ...getColumnSearchProps("orderId"),
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (value) => <span>#{value}</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Evidence",
      dataIndex: "image",
      key: "image",
      render: (img) =>
        img ? <Image src={img} width={50} height={50} alt="evidence" /> : "N/A",
    },
    {
      title: "Req. Qty",
      dataIndex: "requestedQty",
      key: "requestedQty",
    },
    {
      title: "Appr. Qty",
      dataIndex: "approvedQty",
      key: "approvedQty",
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date && dayjs(date).format("DD-MM-YYYY h:mm A"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => <Tag color={getStatus(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "operation",
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="small"
            icon={<CheckOutlined />}
            title="Update Status"
            className="me-1"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  orderReturnStatusUpdate: true,
                  payload: { id: value.id, ...value },
                })
              )
            }
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this Request?
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

  const items: TabsProps["items"] = [
    {
      key: "Requested",
      label: "Requested",
    },
    {
      key: "Approved",
      label: "Approved",
    },

    {
      key: "Completed",
      label: "Completed",
    },
    {
      key: "Rejected",
      label: "Rejected",
    },
  ];

  return (
    <div className="p-3">
      <Tabs
        defaultActiveKey="Requested"
        activeKey={tabKey}
        items={items}
        onChange={onChange}
      />
      <Table
        scroll={{ x: "auto" }}
        dataSource={returns}
        columns={columns}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="large"
      />
      {global.action.orderReturnStatusUpdate && <ReturnOrderStatusUpdate />}
    </div>
  );
};

export default Page;
