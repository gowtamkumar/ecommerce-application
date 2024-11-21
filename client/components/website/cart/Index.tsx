import CartTotal from "./CartTotal";
import MobileTable from "./MobileTable";
import DesktopTable from "./LargeScreenTable";
import ApplyCoupon from "./ApplyCoupon";

export default function Index() {
  return (
    <div className="container section-spacing-bioxin mx-auto p-4 ">
      <h1 className="section-heading font-bold mb-6 text-center">Cart</h1>
      <div className="col-span-2">
        <DesktopTable />
        <MobileTable />
        <ApplyCoupon />
      </div>
      <CartTotal />
    </div>
  );
}
