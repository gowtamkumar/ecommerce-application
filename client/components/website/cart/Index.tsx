import dynamic from "next/dynamic";

const CartTotal = dynamic(() => import("./CartTotal"));
const MobileTable = dynamic(() => import("./MobileTable"));
const LargeScreenTable = dynamic(() => import("./LargeScreenTable"));
const ApplyCoupon = dynamic(() => import("./ApplyCoupon"));

export default function Index() {
  return (
    <div className="container section-spacing-bioxin mx-auto p-4 ">
      <h1 className="section-heading font-bold mb-6 text-center">Cart</h1>
      <div className="col-span-2">
        <LargeScreenTable />
        <MobileTable />
        <ApplyCoupon />
      </div>
      <CartTotal />
    </div>
  );
}
