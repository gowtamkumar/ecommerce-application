"use client";
import EnterpriseTable from "@/components/dashboard/shared/EnterpriseTable";
import { useCurrency } from "@/context/CurrencyContext";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiPackage } from "react-icons/fi";

interface ProductProfitabilityTableProps {
  lossProfit: any[];
  topSellingProducts: any[];
}

interface ProductReportRow {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export default function ProductProfitabilityTable({
  lossProfit = [],
  topSellingProducts = [],
}: ProductProfitabilityTableProps) {
  const { formatPrice } = useCurrency();

  // Merge loss_profit with top_selling_product
  const dataSource: ProductReportRow[] = useMemo(() => {
    const map: Record<string, ProductReportRow> = {};

    // 1. Process loss_profit
    (lossProfit || []).forEach((item, idx) => {
      const key = item.product_id || item.name || String(idx);
      const revenue = Number(item.total_sale_amount) || 0;
      const cost = Number(item.total_purchase_amount) || 0;
      const profit = revenue - cost;
      const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

      map[key] = {
        id: key,
        name: item.name || "Unnamed Product",
        unitsSold: 0,
        revenue,
        cost,
        profit,
        margin,
      };
    });

    // 2. Merge units sold from top_selling_product
    (topSellingProducts || []).forEach((p) => {
      const key = p.product_id || p.name;
      if (key && map[key]) {
        map[key].unitsSold = Number(p.sale_qty) || 0;
      } else if (key) {
        const revenue = Number(p.total_sale_amount) || 0;
        map[key] = {
          id: key,
          name: p.name || "Unnamed Product",
          unitsSold: Number(p.sale_qty) || 0,
          revenue,
          cost: 0,
          profit: revenue,
          margin: 100,
        };
      }
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [lossProfit, topSellingProducts]);

  const columns: ColumnsType<ProductReportRow> = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center text-xs shrink-0">
            <FiPackage />
          </div>
          <span className="text-xs font-bold text-gray-900 line-clamp-1">
            {name}
          </span>
        </div>
      ),
    },
    {
      title: "Units Sold",
      dataIndex: "unitsSold",
      key: "unitsSold",
      align: "center",
      sorter: (a, b) => a.unitsSold - b.unitsSold,
      render: (qty: number) => (
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
          {qty} pcs
        </span>
      ),
    },
    {
      title: "Gross Sales",
      dataIndex: "revenue",
      key: "revenue",
      align: "right",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (val: number) => (
        <span className="text-xs font-bold text-gray-900">
          {formatPrice(val)}
        </span>
      ),
    },
    {
      title: "Merchandise Cost",
      dataIndex: "cost",
      key: "cost",
      align: "right",
      sorter: (a, b) => a.cost - b.cost,
      render: (val: number) => (
        <span className="text-xs font-semibold text-gray-600">
          {formatPrice(val)}
        </span>
      ),
    },
    {
      title: "Net Profit",
      dataIndex: "profit",
      key: "profit",
      align: "right",
      sorter: (a, b) => a.profit - b.profit,
      render: (val: number) => (
        <span
          className={`text-xs font-black ${
            val >= 0 ? "text-global-primary" : "text-rose-600"
          }`}
        >
          {formatPrice(val)}
        </span>
      ),
    },
    {
      title: "Profit Margin",
      dataIndex: "margin",
      key: "margin",
      align: "center",
      sorter: (a, b) => a.margin - b.margin,
      render: (margin: number) => {
        const isPos = margin >= 0;
        return (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
              isPos
                ? "bg-global-primary/10 text-global-primary border-global-primary/30"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {isPos ? <FiArrowUpRight /> : <FiArrowDownRight />}
            <span>{margin}%</span>
          </span>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <EnterpriseTable
        title="Product Profitability & Unit Economics"
        subtitle="Individual product revenue, inventory purchase cost, and net margins"
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        exportFileName="product-profitability-report"
        searchPlaceholder="Filter products..."
        pagination={{ pageSize: 8, showSizeChanger: true }}
      />
    </div>
  );
}
