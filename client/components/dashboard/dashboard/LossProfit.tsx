import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";
interface LossProfitProps {
  value: {
    saleAmount: number;
    purchaseAmount: number;
    total_sale_return_shipping_amount: number;
  };
}

export default function LossProfit({ value }: LossProfitProps) {
  const { saleAmount, purchaseAmount, total_sale_return_shipping_amount } =
    value;

  return (
    <Card title="Ernings" size="small">
      <div>
        <h4> Profit & Loss ৳</h4>
        <Statistic
          value={(
            +saleAmount -
            (+purchaseAmount + +(total_sale_return_shipping_amount || 0))
          ).toFixed(2)}
          // formatter={formatter}
          prefix={
            saleAmount >= purchaseAmount ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )
          }
          valueStyle={{
            color:
              saleAmount >=
              purchaseAmount + (+total_sale_return_shipping_amount || 0)
                ? "green"
                : "red",
          }}
        />
      </div>
    </Card>
  );
}
