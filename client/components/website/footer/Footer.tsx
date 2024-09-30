import { getSettings } from "@/lib/apis/setting";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import FourWeight from "../weight/FourWeight";
import ThirdWeight from "../weight/ThirdWeight";
import SecondWeight from "../weight/SecondWeight";
import FirstWeight from "../weight/FirstWeight";

export default async function WebFooter() {
  const setting = await getSettings();
  const settingData = setting.data ? setting.data[0] : {};

  return (
    <footer className="bg-gray-800 border-t-2 px-5 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 text-center md:text-start gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <FirstWeight data={settingData} />
          <SecondWeight />
          <ThirdWeight />
          <FourWeight />
        </div>
        <div className="flex-row border-t-2 px-4 text-center py-6 md:flex md:items-center md:justify-between ">
          <span className="text-sm  sm:text-center">
            © {new Date().getFullYear()} {settingData.footerOption?.copyRight}
          </span>
          <div className="flex justify-center mt-4 md:justify-center md:mt-0 space-x-5 rtl:space-x-reverse text-center">
            {settingData.socialLink?.linkedinUrl && (
              <Link
                href={settingData.socialLink?.facebookUrl}
                className="text-gray-400 hover:text-white dark:hover:text-white"
              >
                <FaFacebookF />
              </Link>
            )}

            {settingData.socialLink?.linkedinUrl && (
              <Link
                href={settingData.socialLink?.linkedinUrl}
                className="text-gray-400 hover:text-white dark:hover:text-white"
              >
                <FaLinkedinIn />
              </Link>
            )}

            {settingData.socialLink?.twitterUrl && (
              <Link
                href={settingData.socialLink?.instagramUrl}
                className="text-gray-400 hover:text-white dark:hover:text-white"
              >
                <FaInstagram />
              </Link>
            )}

            {settingData.socialLink?.twitterUrl && (
              <Link
                href={settingData.socialLink?.twitterUrl}
                className="text-gray-400 hover:text-white dark:hover:text-white"
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
