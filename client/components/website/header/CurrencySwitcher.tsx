"use client";
import { useCurrency } from '@/context/CurrencyContext';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';

const CurrencySwitcher = () => {
  const { currencies, selectedCurrency, changeCurrency } = useCurrency();

  if (!currencies || currencies.length === 0) return null;

  const items: MenuProps['items'] = currencies.map((currency) => ({
    key: currency.id,
    label: (
      <span className="flex items-center gap-2 font-medium">
        {currency.symbol} {currency.name}
      </span>
    ),
    onClick: () => changeCurrency(currency),
  }));

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Button
        type="text"
        className="flex items-center gap-2 hover:bg-gray-100/50 !rounded-full !px-3 !h-9 text-gray-700 font-medium"
      >
        <GlobalOutlined className="text-gray-500" />
        <span className="hidden sm:inline-block">
          {selectedCurrency?.symbol || '$'} {selectedCurrency?.name || 'USD'}
        </span>
        <DownOutlined className="text-[10px] text-gray-400" />
      </Button>
    </Dropdown>
  );
};

export default CurrencySwitcher;
