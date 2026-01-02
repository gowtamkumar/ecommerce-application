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
      <span className="flex items-center gap-2.5 font-medium px-2 py-1.5 hover:text-global-hover hover:!bg-global-hover transition-colors">
        <span className="text-base">{currency.symbol}</span>
        <span>{currency.name}</span>
      </span>
    ),
    onClick: () => changeCurrency(currency),
  }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      placement="bottomRight"
      // overlayClassName="currency-dropdown"
    >
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 !rounded-full !px-4 !h-10 hover:!bg-global-hover !transparent_95%]
                 text-gray-700 font-medium border border-gray-200 hover:!border-global-hover
                 transition-all duration-300 group"
      >
        <GlobalOutlined className="text-gray-500 group-hover:text-global-hover transition-colors" />
        <span className="hidden sm:inline-block font-semibold group-hover:text-global-hover transition-colors">
          {selectedCurrency?.symbol || '$'} {selectedCurrency?.name || 'USD'}
        </span>
        <DownOutlined className="text-[10px] text-gray-400 group-hover:text-global-hover 
                               transition-all duration-300 group-hover:translate-y-0.5" />
      </button>
    </Dropdown>
  );
};

export default CurrencySwitcher;
