"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { DownOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";

const CurrencySwitcher = () => {
  const { currencies, selectedCurrency, changeCurrency } = useCurrency();

  if (!currencies || currencies.length === 0) return null;

  const items: MenuProps["items"] = currencies.map((currency) => ({
    key: currency.id,
    label: (
      <span className="flex items-center gap-2.5 font-medium px-2 py-1.5 hover:text-global-primary transition-colors">
        <span className="text-base">{currency.symbol}</span>
        <span>{currency.name}</span>
      </span>
    ),
    onClick: () => changeCurrency(currency),
  }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      classNames={{ root: "pt-2 profile-dropdown-overlay" }}
    >
      <Button
        type="default"
        className="!h-10 !px-3 !rounded-full !font-medium !text-sm
                   !border-gray-200 !bg-white !text-gray-800
                   hover:!border-global-primary hover:!text-global-primary
                   !shadow-none flex items-center gap-1.5 !transition-colors duration-200"
      >
        <GlobalOutlined className="text-gray-500" />
        <span className="hidden sm:inline-block">
          {selectedCurrency?.symbol || "$"} {selectedCurrency?.name || "USD"}
        </span>
        <DownOutlined className="text-[10px] text-gray-400" />
      </Button>
    </Dropdown>
  );
};

export default CurrencySwitcher;
