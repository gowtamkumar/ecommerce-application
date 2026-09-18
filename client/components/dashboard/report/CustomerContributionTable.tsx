"use client";
import EnterpriseTable from "@/components/dashboard/shared/EnterpriseTable";
import { useCurrency } from "@/context/CurrencyContext";
import { Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";

interface CustomerItem {
  customer_id?: string;
  customer_name: string;
  total_sale_amount: number;
  total_qty: number;
}

interface CustomerContributionTableProps {
  topCustomers: CustomerItem[];
}

export default function CustomerContributionTable({
  topCustomers = [],
}: CustomerContributionTableProps) {
  const { formatPrice } = useCurrency();

  const totalAllCustomersRevenue = (topCustomers || []).reduce(
    (acc, curr) => acc + (Number(curr.total_sale_amount) || 0),
    0
  );

  const columns: ColumnsType<CustomerItem> = [
    {
      title: "Rank",
      key: "rank",
      width: 70,
      render: (_: any, __: any, index: number) => {
        let badgeClass = "bg-gray-100 text-gray-700";
        if (index === 0)
          badgeClass =
            "bg-global-primary/20 text-global-primary border border-global-primary/40 font-black";
        if (index === 1)
          badgeClass =
            "bg-slate-200 text-slate-800 border border-slate-300 font-bold";
        if (index === 2)
          badgeClass =
            "bg-orange-100 text-orange-800 border border-orange-300 font-bold";

        return (
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${badgeClass}`}
          >
            {index + 1}
          </span>
        );
      },
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (name: string) => {
        const displayName = name || "Valued Shopper";
        const initial = displayName.charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              size="small"
              className="bg-global-primary/15 text-global-primary font-bold text-xs"
            >
              {initial}
            </Avatar>
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400">VIP Account</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Units Purchased",
      dataIndex: "total_qty",
      key: "total_qty",
      align: "center",
      sorter: (a, b) => (a.total_qty || 0) - (b.total_qty || 0),
      render: (qty: number) => (
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
          {qty || 0} pcs
        </span>
      ),
    },
    {
      title: "Cumulative Spend",
      dataIndex: "total_sale_amount",
      key: "total_sale_amount",
      align: "right",
      sorter: (a, b) => (a.total_sale_amount || 0) - (b.total_sale_amount || 0),
      render: (val: number) => (
        <span className="text-xs font-black text-gray-900">
          {formatPrice(val || 0)}
        </span>
      ),
    },
    {
      title: "Revenue Share",
      key: "share",
      align: "center",
      render: (_: any, record: CustomerItem) => {
        const share =
          totalAllCustomersRevenue > 0
            ? Math.round(
                ((Number(record.total_sale_amount) || 0) /
                  totalAllCustomersRevenue) *
                  100
              )
            : 0;
        return (
          <span className="text-xs font-bold text-gray-600">
            {share}%
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <EnterpriseTable
        title="Customer Revenue Contribution & VIP Accounts"
        subtitle="Individual customer lifetime spending, item volume, and revenue share"
        columns={columns}
        dataSource={topCustomers}
        rowKey={(record, idx) =>
          record.customer_id || record.customer_name || (idx ?? 0).toString()
        }
        exportFileName="customer-contribution-report"
        searchPlaceholder="Filter customers..."
        pagination={{ pageSize: 8, showSizeChanger: true }}
      />
    </div>
  );
}

