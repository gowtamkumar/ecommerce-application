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

export default async function WebFooter() {
  const setting = await getSettings();
  const settingData = setting.data ? setting.data[0] : {};

  return (
    <footer className="bg-[#F6F6F6] font-mono py-10">
      <div className="w-8/12 mx-auto">
        <div className="grid grid-cols-2 gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <div>
            <Image src="/pos_software.png" width={50} height={50} alt="logo" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. amet
              consectetur adipisicing elit.{" "}
            </p>
            <p>Mobile: 0170000000</p>
            <p>E-mail:demo@gmail.com</p>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              Help center
            </h2>
            <ul className=" dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Term of SErvice
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Return
                </a>
              </li>
            </ul>
          </div>
          {/* <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Shop</h2>
            <ul className="font-medium">
              <li className="mb-4">
                <a href="#" className=" hover:underline">
                  Mens Shpping
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Womens Shopping
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Kids Shopping
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  t-shart Shopping
                </a>
              </li>
            </ul>
          </div> */}

          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Compnay</h2>
            <ul className="font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Licensing
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              Newsletter Signup{" "}
            </h2>
            <p>
              Subscribe to our newsletter and get 10% off your first purchase
            </p>
            <div className="flex py-6">
              <input
                type="email"
                placeholder="E-mail address"
                className="rounded-l-full border border-black px-2 py-2 focus:outline-none self-center w-2/3"
              />
              <button className="bg-blue-600 text-white rounded-r-full px-4 py-2 font-semibold hover:bg-gray-800 focus:outline-none">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <hr className="border-gray-700 sm:mx-auto dark:border-gray-700 lg:my-4" />
        <div className="px-4 text-center py-6 md:flex md:items-center md:justify-between">
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
