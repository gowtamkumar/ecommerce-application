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
      <span className="flex items-center gap-2.5 font-medium px-2 py-1.5 hover:text-global-button-primary transition-colors">
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
        className="flex cursor-pointer items-center gap-2 rounded-global-button-radius px-4 h-10 
                 bg-global-button-primary text-global-button-text hover:bg-global-button-hover
                 font-medium shadow-sm
                 transition-all duration-300 group"
      >
        <GlobalOutlined className="text-global-button-text/70 group-hover:text-global-button-text transition-colors" />
        <span className="hidden sm:inline-block font-semibold">
          {selectedCurrency?.symbol || '$'} {selectedCurrency?.name || 'USD'}
        </span>
        <DownOutlined className="text-[10px] text-global-button-text/70 group-hover:text-global-button-text 
                               transition-all duration-300 group-hover:translate-y-0.5" />
      </button>
    </Dropdown>
  );
};

export default CurrencySwitcher;
