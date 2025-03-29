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
import { deleteProduct, getProducts } from "@/lib/apis/admin/product";
import { useRouter } from "next/navigation";
import appConfig from "@/appConfig";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import MDEditor from "@uiw/react-md-editor";

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

type DataIndex = keyof DataType;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([] as any);
  const [searchInput, setSearchInput] = useState<string>("");
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      dispatch(setLoading({ loading: true }));
      const res = await getProducts();
      const newProducts = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));
      console.log("newProducts", newProducts);
      
      setProducts(newProducts);
    } catch (err: any) {
      errorNotification({ message: err.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteProduct(id);
      fetchData();
      successNotification({ message: "Successfully deleted" });
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
      ...getColumnSearchProps("name"),
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },

    {
      ...getColumnSearchProps("variant"),
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
      render: (value) => (value ? <span>Yes</span> : <span>No</span>),
    },

    {
      ...getColumnSearchProps("alertQty"),
      title: "Alert Qty",
      dataIndex: "alertQty",
      key: "alertQty",
    },

    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value) => (
        <span>
          {value?.value &&
            `${value?.value}${
              value?.discountStrategy === "Percentage" ? "%" : "BDT"
            }`}
        </span>
      ),
    },
    {
      ...getColumnSearchProps("limitPurchaseQty"),
      title: "Limit Purchase Qty",
      dataIndex: "limitPurchaseQty",
      key: "limitPurchaseQty",
      sorter: (a, b) => a.limitPurchaseQty - b.limitPurchaseQty,
    },

    {
      ...getColumnSearchProps("featured"),
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (value) => (value ? <span>Yes</span> : <span>No</span>),
    },

    {
      title: "Status",
      key: "status",
      ...getColumnSearchProps("status"),
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
      className: "text-end w-20",
      render: (value) => (
        <div className="gap-2">
          <Button
            size="small"
            icon={<FormOutlined />}
            title="Edit"
            className="me-1"
            onClick={() => route.push(`/dashboard/product/${value.id}`)}
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this Product?
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

  const expandedRowRender = (value: any) => {
    const childColumns: any = [
      {
        title: "Purchse Price",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
      },
      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
      {
        title: "Size",
        key: "size",
        dataIndex: "size",
        render: (v: any) => <span>{v?.name}</span>,
      },
      {
        title: "Color",
        key: "color",
        dataIndex: "color",
        render: (v: any) => <span>{v?.name}</span>,
      },
      {
        title: "Metarial",
        key: "metarial",
        dataIndex: "metarial",
      },
      { title: "Stock Qty", dataIndex: "stockQty", key: "stockQty" },
      {
        title: "Default",
        dataIndex: "default",
        key: "default",
        render: (value: any) => <Tag>{value ? "Yes" : "No"}</Tag>,
      },
    ];

    return (
      <>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <h1 className="font-bold">Product Details: </h1>
            <h2>
              <strong>Variant:</strong> {value.variant ? "Yes" : "No"}
            </h2>
            <h2>
              <strong>Product Name: </strong> {value.name}
            </h2>
            <h2>
              <strong>Slug:</strong> {value.slug}
            </h2>
           
            <h2>
              <strong>Discount:</strong>
              {value?.discount &&
                `${value?.discount.value}${
                  value?.discount.discountStrategy === "Percentage" ? "%" : "BDT"
                }`}
            </h2>
            <h2>
              <strong>Tax:</strong> {value?.tax?.value}%
            </h2>
            <h2>
              <strong>Limit Purchase Qty: </strong> {value.limitPurchaseQty}
            </h2>
            <h2>
              <strong>Alert Qty:</strong> {value?.alertQty}
            </h2>
            <h2>
              <strong>Enable Review:</strong>{" "}
              {value.enableReview ? "Yes" : "No"}
            </h2>
            <h2>
              <strong>Tags:</strong> {value.tags}
            </h2>
            <h2>
              <strong>Short Description:</strong>
              <MDEditor.Markdown
                source={value.shortDescription}
                style={{ whiteSpace: "pre-wrap" }}
              />
              {/* {value.shortDescription} */}
            </h2>
            <h2>
              <strong>Description:</strong>
              <MDEditor.Markdown
                source={value.description}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </h2>
            <h2>
              Enable Review:{" "}
              <Tag color={value.enableReview ? "green" : "red"}>
                {value.enableReview ? "Yes" : "No"}
              </Tag>
            </h2>

            <h2>
              Status:{" "}
              <Tag color={value.status === "Active" ? "green" : "red"}>
                {value.status}
              </Tag>
            </h2>

            <div className="flex gap-2">
              Images:
              {value.images?.map((item: string) => {
                return (
                  <Image
                    key={item}
                    width={200}
                    alt={item}
                    src={`${appConfig.baseApiUrl}/uploads/${
                      item || "no-data.png"
                    }`}
                  />
                );
              })}
            </div>
          </div>
          <div className="col-span-1">
            hare need to show review product related review
          </div>
        </div>

        <div className="p-4 bg-white">
          <h1 className="font-semibold">Product Varitents</h1>
          <Table
            columns={childColumns}
            size="small"
            scroll={{ x: "auto" }}
            dataSource={value.productVariants}
            pagination={false}
            bordered
          />
        </div>
      </>
    );
  };

  return (
    <Table
      scroll={{ x: "auto" }}
      loading={global.loading.loading}
      dataSource={products}
      columns={columns}
      expandable={{ expandedRowRender }}
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default ProductList;
