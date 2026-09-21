import { getDiscountDetails } from "@/lib/apis/discount";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    selectGlobal,
    setSearchedColumn,
    setSearchText,
} from "@/redux/features/global/globalSlice";
import { SearchOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Input,
    Space,
    Table,
    TableColumnsType,
    TableColumnType,
    Tag,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [products, setProducts] = useState<any[]>(discount?.products || []);
  const [total, setTotal] = useState<number>(
    discount?.totalProducts !== undefined
      ? Number(discount.totalProducts)
      : discount?.products?.length || 0
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (discount?.products) {
      setProducts(discount.products);
      setTotal(
        discount.totalProducts !== undefined
          ? Number(discount.totalProducts)
          : discount.products.length
      );
      setCurrentPage(1);
    }
  }, [discount?.id, discount?.products, discount?.totalProducts]);

  const fetchProducts = useCallback(
    async (page: number, limit: number, search?: string) => {
      if (!discount?.id) return;
      setLoading(true);
      try {
        const res = await getDiscountDetails(discount.id, {
          page,
          perPage: limit,
          search,
        });
        if (res?.data) {
          setProducts(res.data.products || []);
          const totalCount =
            res.data.totalProducts !== undefined
              ? Number(res.data.totalProducts)
              : res.totalProducts !== undefined
              ? Number(res.totalProducts)
              : res.data.products?.length || 0;
          setTotal(totalCount);
        }
      } catch (error) {
        console.error("Failed to load discount products:", error);
      } finally {
        setLoading(false);
      }
    },
    [discount?.id]
  );

  type DataIndex = keyof DataType;

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    const query = selectedKeys[0] || "";
    dispatch(setSearchText(query));
    dispatch(setSearchedColumn(dataIndex));
    setCurrentPage(1);
    fetchProducts(1, pageSize, query);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    dispatch(setSearchText(""));
    setSearchInput("");
    setCurrentPage(1);
    fetchProducts(1, pageSize, "");
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
    onFilter: (value, record) =>
      Boolean(
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      ),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput, 100);
        }
      },
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
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      render: (_, record: any) => {
        const imageUrl = getImageUrl(
          record.thumbnailImage || record.image || record.Image,
          "/default-placeholder.png"
        );
        return (
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              alt={record.name || "Product"}
              src={imageUrl}
              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shadow-sm"
            />
            <span className="font-medium text-gray-800">{record.name}</span>
          </div>
        );
      },
    },

    {
      title: "Variant",
      dataIndex: "variant",
      key: "variant",
      width: 120,
      align: "center",
      render: (value) =>
        value ? (
          <Tag color="processing" className="rounded-full px-2.5">
            Yes
          </Tag>
        ) : (
          <Tag color="default" className="rounded-full px-2.5">
            No
          </Tag>
        ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">
            Applicable Products
          </span>
          <Tag color="blue" className="rounded-full px-2">
            {total}
          </Tag>
        </div>
      }
      className="shadow-sm border-gray-100 rounded-xl overflow-hidden mt-4"
      styles={{ body: { padding: 0 } }}
    >
      <Table
        scroll={{ x: "auto" }}
        loading={loading || global.loading.loading}
        rowKey={(record: any, index?: number) =>
          record.id || record.productId || record.slug || String(index ?? 0)
        }
        dataSource={products}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          hideOnSinglePage: false,
          pageSizeOptions: ["5", "10", "20", "50"],
          showQuickJumper: true,
          showTotal: (totalCount, range) => (
            <span className="text-xs text-gray-500 font-medium">
              Showing <strong>{range[0]}-{range[1]}</strong> of <strong>{totalCount}</strong> products
            </span>
          ),
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            fetchProducts(page, size, searchInput);
          },
          className: "p-3",
        }}
        size="middle"
      />
    </Card>
  );
}
