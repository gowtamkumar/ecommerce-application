import dynamic from "next/dynamic";
import { getSettings } from "@/lib/apis/setting";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import SocialIcon from "./SocialIcon";
const FourWeight = dynamic(() => import("../weight/FourWeight"));
const ThirdWeight = dynamic(() => import("../weight/ThirdWeight"));
const SecondWeight = dynamic(() => import("../weight/SecondWeight"));
const FirstWeight = dynamic(() => import("../weight/FirstWeight"));

export default async function WebFooter() {
  const setting = await getSettings();
  const settingData = setting?.data ? setting?.data[0] : {};

  return (
    <footer className="bg-gray-800 border-t-2 px-5 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 text-center md:text-start gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <FirstWeight data={settingData} />
          <SecondWeight />
          <ThirdWeight />
          <FourWeight />
        </div>
        <SocialIcon settingData={settingData} />
      </div>
    </footer>
  );
}
