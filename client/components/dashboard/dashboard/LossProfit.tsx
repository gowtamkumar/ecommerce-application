import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import { useCurrency } from "@/context/CurrencyContext";

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

  const { formatPrice } = useCurrency();

  return (
    <Card title="Ernings" variant='borderless' size="small">
      <div>
        <h4> Profit & Loss</h4>
        <Statistic
          value={formatPrice(
            +saleAmount -
            (+purchaseAmount + +(total_sale_return_shipping_amount || 0))
          )}
          prefix={
            saleAmount >= purchaseAmount ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )
          }
          styles={{
            content: {
              color:
                saleAmount >=
                purchaseAmount + (+total_sale_return_shipping_amount || 0)
                  ? "green"
                  : "red",
            },
          }}
        />
      </div>
    </Card>
  );
}
