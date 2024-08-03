import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Divider, Input, Popconfirm, Space, Table, Tag } from "antd";
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
import { toast } from "react-toastify";
import { deleteProduct, getProducts } from "@/lib/apis/product";
import { useRouter } from "next/navigation";

interface DataType {
  key: string;
  name: string;
  type: string;
  urlSlug: string;
  singleImage: string;
  limitPurchaseQty: number;
  alertQty: number;
  discount: any;
  description: string;
  shortDescription: string;
  status: string;
}

type DataIndex = keyof DataType;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getProducts();
      const newProducts = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));
      setProducts(newProducts);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteProduct(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Product deleted successfully");
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
      ...getColumnSearchProps("urlSlug"),
      title: "Slug",
      dataIndex: "urlSlug",
      key: "urlSlug",
      sorter: (a, b) => a.urlSlug.length - b.urlSlug.length,
    },

    {
      ...getColumnSearchProps("name"),
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      ...getColumnSearchProps("type"),
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.length - b.type.length,
      render: (value) => <Tag color="cyan">{value}</Tag>,
    },

    {
      title: "Single Image",
      dataIndex: "singleImage",
      key: "singleImage",
    },

    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value) => (
        <span>
          {value?.value &&
            `${value?.value}${
              value?.discountType === "Percentage" ? "%" : "BDT"
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
            onClick={() => {
              const productCategories = value?.productCategories?.map(
                ({ categoryId }: any) => categoryId
              );
              const productVariants = value?.productVariants?.map(
                ({
                  price,
                  salePrice,
                  productId,
                  sizeId,
                  colorId,
                  weight,
                  stockQty,
                }: any) => ({
                  price,
                  salePrice,
                  productId,
                  sizeId,
                  colorId,
                  weight,
                  stockQty,
                })
              );
              route.push(`/dashboard/products/${value.id}`);
              dispatch(
                setAction({
                  // type: ActionType.UPDATE,
                  payload: { ...value, productCategories, productVariants },
                })
              );
            }}
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
      { title: "Sale Price", dataIndex: "price", key: "price" },

      {
        title: "Size",
        key: "size",
        dataIndex: "size",
        render: (v: any) => <span>{v.name}</span>,
      },

      {
        title: "color",
        key: "Color",
        dataIndex: "color",
        render: (v: any) => <span>{v.name}</span>,
      },

      {
        title: "Weight",
        key: "weight",
        dataIndex: "weight",
      },
      { title: "Qty", dataIndex: "stockQty", key: "stockQty" },
    ];

    return (
      <>
        <div className="p-4">
          <h1 className="font-bold">Product Details: </h1>
          <h2>Type: {value.type}</h2>
          <h2>Product Name: {value.name}</h2>
          <h2>Url slug: {value.urlSlug}</h2>
          <h2>
            Discount:
            {value?.discount &&
              `${value?.discount.value}${
                value?.discount.discountType === "Percentage" ? "%" : "BDT"
              }`}
          </h2>
          <h2>Limit Purchase Qty: {value.limitPurchaseQty}</h2>
          <h2>Alert Qty: {value.alertQty}</h2>
          <h2>Enable Review: {value.enableReview ? "Yes" : "No"}</h2>
          <h2>Tags: {value.tags}</h2>
          <h2>Short Description: {value.shortDescription}</h2>
          <h2>Description: {value.description}</h2>
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
