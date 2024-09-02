import { getSettings } from "@/lib/apis/setting";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Subscribe from "./footer/Subscribe";
import FourWeight from "./weight/FourWeight";
import ThirdWeight from "./weight/ThirdWeight";
import SecondWeight from "./weight/SecondWeight";
import FirstWeight from "./weight/FirstWeight";

export default async function WebFooter() {
  const setting = await getSettings();
  const settingData = setting.data ? setting.data[0] : {};

  return (
    <footer className="bg-[#F6F6F6] border-t-2 py-10">
      <div className="w-8/12 mx-auto">
        <div className="grid grid-cols-2 gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <FirstWeight />
          <SecondWeight />
          <ThirdWeight />
          <FourWeight />
        </div>
        <div className="border-t-2 px-4 text-center py-6 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-700  sm:text-center">
            © {new Date().getFullYear()}
            {settingData.footerOption?.copyRight}
          </span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            {settingData.socialLink?.linkedinUrl && (
              <Link
                href={settingData.socialLink?.facebookUrl}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <FaFacebookF />
              </Link>
            )}

            {settingData.socialLink?.linkedinUrl && (
              <Link
                href={settingData.socialLink?.linkedinUrl}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <FaLinkedinIn />
              </Link>
            )}

            {settingData.socialLink?.twitterUrl && (
              <Link
                href={settingData.socialLink?.instagramUrl}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <FaInstagram />
              </Link>
            )}

            {settingData.socialLink?.twitterUrl && (
              <Link
                href={settingData.socialLink?.twitterUrl}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <FaTwitter />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
