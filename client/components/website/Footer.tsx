import { getSettings } from "@/lib/apis/setting";
import Link from "next/link";
import {
  FaFacebook,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa";

async function WebFooter() {
  const setting = await getSettings();
  const socialLink = setting.data ? setting.data[0]?.socialLink : {};
  console.log("🚀 ~ socialLink:", socialLink);

  return (
    <footer className="bg-slate-500">
      <div className="md:w-8/12 mx-auto w-full">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4 ">
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Company</h2>
            <ul className="font-medium">
              <li className="mb-4">
                <a href="#" className=" hover:underline">
                  About
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Brand Center
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">
              Help center
            </h2>
            <ul className=" dark:text-gray-400 font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Discord Server
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Legal</h2>
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
            <h2 className="mb-6 text-sm font-semibold uppercas">Download</h2>
            <ul className=" font-medium">
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  iOS
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Android
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  Windows
                </a>
              </li>
              <li className="mb-4">
                <a href="#" className="hover:underline">
                  MacOS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className=" border-gray-700 sm:mx-auto dark:border-gray-700 lg:my-4" />

        <div className="px-4 text-center py-6 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-700  sm:text-center">
            © {new Date().getFullYear()} <a href="/">Web site</a>. All Rights
            Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            <Link
              href={socialLink?.facebookUrl}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FaFacebookF />
            </Link>

            <Link
              href={socialLink?.linkedinUrl}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FaLinkedinIn />
            </Link>

            <Link
              href={socialLink?.instagramUrl}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default WebFooter;
