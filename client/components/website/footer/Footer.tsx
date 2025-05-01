import dynamic from "next/dynamic";
// import { getSettings } from "@/lib/apis/setting";

import { FaTruckPickup } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { CiGift } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
const FourWeight = dynamic(() => import("../weight/FourWeight"));
const ThirdWeight = dynamic(() => import("../weight/ThirdWeight"));
const SecondWeight = dynamic(() => import("../weight/SecondWeight"));
const FirstWeight = dynamic(() => import("../weight/FirstWeight"));
const SocialIcon = dynamic(() => import("./SocialIcon"));

export default async function WebFooter() {
  return (
    <footer className="bg-gray-800  text-white">
      <div className="border-b-[1] border-gray-300">
        <div className="grid md:grid-cols-4 text-center items-center justify-center py-6">
          <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
            <FaTruckPickup size={30} />
            <span>Free Shipping</span>
          </div>
          <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
            <IoIosCall size={30} />
            <span>Support 24/7 At Anytime</span>
          </div>
          <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
            <MdOutlinePayment size={30} />
            <span>Secure Payment Totally Safe</span>
          </div>
          <div className="md:border-r-2 flex items-center justify-center gap-1 text-gray-300">
            <CiGift size={30} />
            <span>Latest Offer Upto 20% Off</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 text-center md:text-start gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <FirstWeight />
          <SecondWeight />
          <ThirdWeight />
          <FourWeight />
        </div>
      </div>
      <div className="bg-gray-200">
        <SocialIcon />
      </div>
      <div className="mt-10 md:hidden">top</div>
    </footer>
  );
}
