"use client";
import { ActionType } from "@/constants/constants";
import { deleteOrder, getOrders } from "@/lib/apis/orders";
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
  ClockCircleOutlined,
  QuestionCircleOutlined,
  RestOutlined,
  SearchOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import type { TableColumnsType, TableColumnType, TabsProps } from "antd";
import {
  Button,
  Divider,
  Input,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { FaAmazonPay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const OrderStatusChange = dynamic(
  () => import("@/components/dashboard/order/OrderStatusUpdate"),
  { ssr: false }
);

const AssignDeliveryMan = dynamic(
  () => import("@/components/dashboard/order/AssignDeliveryMan"),
  { ssr: false }
);

interface DataType {
  key: React.Key;
  name: string;
  phoneNo: string;
  trackingNo: string;
}

type DataIndex = keyof DataType;

const Order = () => {
  const [tabKey, setTabKey] = useState("Pending");
  const [orders, setOrders] = useState([]);
  const [searchInput, setSearchInput] = useState(null) as any;
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const route = useRouter();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getOrders({ status: tabKey });
      const newOrders = res.data.map((items: any, idx: number) => ({
        ...items,
        key: idx.toString(),
      }));
      setOrders(newOrders);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, tabKey, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
      await deleteOrder(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        toast.success("Discount deleted successfully");
        dispatch(setAction({}));
      }, 500);
    } catch (error: any) {
      console.log("v", error);
      toast.error(error);
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
          // ref={searchInput}
          placeholder={`Search {dataIndex}`}
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

  const expandedRowRender = (value: any) => {
    const { dabitTotal, creditTotal } = value.payments.reduce(
      (acc: any, element: any) => {
        if (element.paymentType === "Credit")
          acc.creditTotal += +element.amount;
        if (element.paymentType === "Debit") acc.dabitTotal += +element.amount;
        return acc;
      },
      { dabitTotal: 0, creditTotal: 0 } // Initial accumulator values
    );

    const paidAmount = dabitTotal - creditTotal;

    const childColumns: any = [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
        render: (v: { name: string }) => <span>{v.name}</span>,
      },
      {
        title: "Color",
        dataIndex: "productVariant",
        render: (v: any) => {
          return <span>{v?.color?.name}</span>;
        },
      },
      {
        title: "Size",
        dataIndex: "productVariant",
        render: (v: any) => {
          return <span>{v?.size?.name}</span>;
        },
      },
      {
        title: "Material",
        dataIndex: "material",
        key: "material",
      },
      {
        title: "Purchase Price",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
      },
      { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice" },
      {
        title: "Tax Amount",
        key: "taxAmount",
        dataIndex: "taxAmount",
      },
      {
        title: "Discount Amount",
        dataIndex: "totalDiscountAmount",
        key: "totalDiscountAmount",
      },
      {
        title: "Sale Price",
        // dataIndex: "salePrice",
        key: "salePrice",
        render: (v: any) => {
          return (
            <span>
              {(+v.unitPrice - +v.totalDiscountAmount + +v.taxAmount).toFixed(
                2
              )}
            </span>
          );
        },
      },

      { title: "Qty", dataIndex: "qty", key: "qty" },
      {
        title: "Sub Total",
        key: "subTotal",
        dataIndex: "subTotal",
      },
    ];

    return (
      <div className="grid grid-cols-4 p-2">
        <div className="col-span-4">
          {value.status === "Canceled" && (
            <h2 className="bg-red-500">
              <span className="font-bold">Order Resson: </span>
              <code>{value.cancelResson}</code>
            </h2>
          )}
          <h1>
            <span className="font-bold">Order No: </span>
            <code>{value.trackingNo}</code>
          </h1>
          {value.tranId && (
            <h1>
              <span className="font-bold">Transaction ID: </span>
              <code>{value.tranId}</code>
            </h1>
          )}
          <h1>
            <span className="font-bold">Shipping Address: </span>
            <code> {value.shippingAddress?.address}</code>
          </h1>
          <h1>
            <span className="font-bold">Delivery Man: </span>
            <code>{value?.deliveryMan?.name}</code>
          </h1>
          <Divider dashed />
          <div className="p-4 bg-white">
            <h1 className="font-semibold">Order Items</h1>
            <Table
              columns={childColumns}
              size="small"
              scroll={{ x: "auto" }}
              dataSource={value.orderItems}
              pagination={false}
              bordered
            />
          </div>
          <div className="grid grid-cols-8 mt-5">
            <div className="col-span-5 p-2">
              <Timeline
                items={(value?.orderTrackings || []).map(
                  (timeline: any, idx: number) => ({
                    dot: <ClockCircleOutlined />,
                    color: "red",
                    children: (
                      <div key={idx}>
                        <div> {timeline.status}</div>
                        <div>
                          {" "}
                          {dayjs(timeline.createdAt).format(
                            "MMMM D, YYYY h:mm A"
                          )}
                        </div>
                        <div> {timeline.location}</div>
                      </div>
                    ),
                  })
                )}
              />
            </div>

            <div className="col-span-3">
              <div className="flex justify-between">
                <h1>Total Qty:</h1>
                <h1 className="font-semibold">{value.totalQty}</h1>
              </div>

              <div className="flex justify-between">
                <h1>Net Amount:</h1>
                <h1 className="font-semibold">
                  {(+value.subTotal).toFixed(2)}
                </h1>
              </div>

              {+value.totalItemsDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Discount Amount:</h1>
                  <h1 className="font-semibold">{value.totalItemsDiscount}</h1>
                </div>
              )}

              {+value.couponDiscount > 0 && (
                <div className="flex justify-between">
                  <h1>Coupon Discount:</h1>
                  <h1 className="font-semibold">{value.couponDiscount}</h1>
                </div>
              )}

              <div className="flex justify-between">
                <h1>Tax Amount:</h1>
                <h1 className="font-semibold">{value.totalTax}</h1>
              </div>

              {paidAmount > 0 && (
                <div className="flex justify-between">
                  <h1>Paid Amount:</h1>
                  <h1 className="font-semibold">{paidAmount}</h1>
                </div>
              )}

              {+value.shippingCharge > 0 && (
                <div className="flex justify-between">
                  <h1>Shipping:</h1>
                  <h1 className="font-semibold">+{value.shippingCharge}</h1>
                </div>
              )}

              <div className="flex justify-between border-t-2">
                <h1>Grand Total:</h1>
                <h1 className="font-semibold">
                  {(+value.grandTotal - paidAmount).toFixed(2)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      ...getColumnSearchProps("trackingNo"),
      title: "Tracking No",
      dataIndex: "trackingNo",
      key: "trackingNo",
      render: (value) => <span className="bg-green-200">{value}</span>,
    },

    {
      title: "Phone No",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (value) => <span>{value?.phoneNo}</span>,
    },

    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (customer) => <span>{customer?.name}</span>,
    },
    // {
    //   title: "Shipping Address",
    //   dataIndex: "shippingAddress",
    //   key: "shippingAddress",
    //   render: (value) => <span>{value.address}</span>,
    // },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      // render: (value) => <span>{value.address}</span>,
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => date && dayjs(date).format("DD-MM-YYYY h:mm A"),
    },
    {
      title: "P. Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Status",
      key: "status",
      render: (orderStatus) => (
        <Tag color={getStatus(orderStatus.status)}>{orderStatus.status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (value) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="small"
            icon={<FaAmazonPay />}
            title="Payment"
            onClick={() => {
              route.push("/dashboard/payments/new");
            }}
          />

          <Button
            size="small"
            icon={<UserAddOutlined />}
            title="Assign Delivery man"
            onClick={() =>
              dispatch(
                setAction({
                  assign: true,
                  payload: { id: value.id },
                })
              )
            }
          />

          <Button
            size="small"
            icon={<CheckOutlined />}
            title="Order Status Change"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.UPDATE,
                  orderStatusUpdate: true,
                  payload: { id: value.id },
                })
              )
            }
            disabled={
              value.status === "Completed" || value.status === "Returned"
            }
          />
          <Popconfirm
            title={
              <span>
                Are you sure <span className="text-danger fw-bold">delete</span>{" "}
                this Order?
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
      key: "Pending",
      label: "Pending",
    },
    {
      key: "Approved",
      label: "Approved",
    },
    {
      key: "Processing",
      label: "Processing",
    },
    {
      key: "On Shipping",
      label: "On Shipping",
    },
    {
      key: "Shipped",
      label: "Shipped",
    },
    {
      key: "Canceled",
      label: "Canceled",
    },
    {
      key: "Completed",
      label: "Completed",
    },
    // {
    //   key: "Returned",
    //   label: "Returned",
    // },
  ];

  return (
    <div className="p-3">
      <Tabs
        defaultActiveKey="1"
        activeKey={tabKey}
        items={items}
        onChange={onChange}
      />
      <Table
        scroll={{ x: "auto" }}
        dataSource={orders}
        columns={columns}
        expandable={{ expandedRowRender }}
        loading={global.loading.loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="large"
      />
      {global.action.orderStatusUpdate && <OrderStatusChange />}
      {/* {global.action.payment && <AddPayment />} */}
      {global.action.assign && <AssignDeliveryMan />}
    </div>
  );
};

export default Order;
