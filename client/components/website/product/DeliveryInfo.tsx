import { Divider, Button } from "antd";
import { useCurrency } from "@/context/CurrencyContext";
import { HiOutlineRefresh, HiOutlineShieldCheck } from "react-icons/hi";

const DeliveryInfo = ({ delivery }: any) => {
  const {formatPrice} = useCurrency();
  return (
    <div className="bg-global-header-bg/40 backdrop-blur-sm p-5 rounded-2xl border border-global-header-text/5">
      <h2 className="text-xs text-global-header-text/60 font-bold uppercase tracking-wider mb-4">Delivery</h2>
      <div className="text-global-header-text flex justify-between items-start gap-4 mb-4">
        <span className="text-sm font-medium leading-relaxed"> Khulna, Jashore, Jashore - Noapara</span>
        <button className="text-global-primary hover:text-global-hover font-bold text-xs uppercase transition-colors shrink-0">Change</button>
      </div>
      <div className="h-px bg-global-header-text/10 mb-4" />
      <div className="flex justify-between items-center mb-6">
        <span className="text-global-header-text/60 text-sm">Shipping Cost</span>
        <span className="text-global-header-text font-bold uppercase">{formatPrice(delivery.unitPrice)}</span>
      </div>
      <Divider />
      <h2 className="text-xs text-global-header-text/60 font-bold uppercase tracking-wider mb-4">Service</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 group">
          <div className="p-2 rounded-lg bg-global-primary/10 text-global-primary group-hover:scale-110 transition-transform">
            <HiOutlineRefresh className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-global-header-text">7 Days Returns</span>
            <span className="text-[11px] text-global-header-text/60">Change of mind is not applicable</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3 group">
          <div className="p-2 rounded-lg bg-global-primary/10 text-global-primary group-hover:scale-110 transition-transform">
            <HiOutlineShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-global-header-text">Warranty Not Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
