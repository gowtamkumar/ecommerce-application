import Link from 'next/link'
import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

export default function SocialIcon({settingData}: any) {
  return (
    <div className="flex-row border-t-2 px-4 text-center py-6 md:flex md:items-center md:justify-between ">
    <span className="text-sm  sm:text-center">
      © {new Date().getFullYear()} {settingData?.footerOption?.copyRight}
    </span>
    <div className="flex justify-center mt-4 md:justify-center md:mt-0 space-x-5 rtl:space-x-reverse text-center">
      {settingData?.socialLink?.linkedinUrl && (
        <Link
          href={settingData?.socialLink?.facebookUrl}
          className="text-gray-400 hover:text-white dark:hover:text-white"
        >
          <FaFacebookF />
        </Link>
      )}

      {settingData?.socialLink?.linkedinUrl && (
        <Link
          href={settingData?.socialLink?.linkedinUrl}
          className="text-gray-400 hover:text-white dark:hover:text-white"
        >
          <FaLinkedinIn />
        </Link>
      )}

      {settingData?.socialLink?.twitterUrl && (
        <Link
          href={settingData?.socialLink?.instagramUrl}
          className="text-gray-400 hover:text-white dark:hover:text-white"
        >
          <FaInstagram />
        </Link>
      )}

      {settingData?.socialLink?.twitterUrl && (
        <Link
          href={settingData?.socialLink?.twitterUrl}
          className="text-gray-400 hover:text-white dark:hover:text-white"
        >
          <FaTwitter />
        </Link>
      )}
    </div>
  </div>
  )
}
