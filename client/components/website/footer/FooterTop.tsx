import React from 'react'
import { CiGift } from 'react-icons/ci'
import { FaTruckPickup } from 'react-icons/fa'
import { IoIosCall } from 'react-icons/io'
import { MdOutlinePayment } from 'react-icons/md'

export default function FooterTop() {
  return (
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
            <span>Latest Offer</span>
          </div>
        </div>

      </div>
  )
}
