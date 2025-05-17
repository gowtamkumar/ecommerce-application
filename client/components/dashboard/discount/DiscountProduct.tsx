import appConfig from "@/appConfig";
import {
  selectGlobal,
  setSearchedColumn,
  setSearchText,
} from "@/redux/features/global/globalSlice";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  TableColumnsType,
  TableColumnType,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import Image from "next/image";
import React from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";

interface Discount {
  discountStrategy: string;
  value: number;
  type: string;
}
interface DataType {
  key: string;
  name: string;
  variant: boolean;
  enableReview: boolean;
  featured: boolean;
  limitPurchaseQty: number;
  alertQty: number;
  discount: Discount;
  status: string;
}

export default function DiscountProduct({ discount }: any) {
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const [searchInput, setSearchInput] = React.useState("");

  type DataIndex = keyof DataType;

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

  const columns: TableColumnsType<any> = [
    {
      ...getColumnSearchProps("name"),
      title: "Name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (value) => {
        return (
          <div className="flex items-center gap-2">
            <Image
              width={50}
              height={50}
              alt={discount.name}
              src={`${appConfig.baseApiUrl}/uploads/${
                value.Image || "no-data.png"
              }`}
              className="w-10 h-10 rounded-lg"
            />
            <span>{value.name}</span>
          </div>
        );
      },
    },

    {
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
      render: (value) => (value ? <span>Yes</span> : <span>No</span>),
    },
  ];

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      dataSource={discount.products}
      columns={columns}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
}
