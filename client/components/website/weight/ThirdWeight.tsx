import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export default function ThirdWeight() {
  const links = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-conditions", label: "Terms & Conditions" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/shipping-policy", label: "Shipping Policy" }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white uppercase tracking-wide 
                   relative inline-block after:content-[''] after:absolute after:bottom-0 
                   after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r 
                   after:from-purple-400 after:to-pink-400 pb-2">
        Company
      </h2>
      
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link 
              href={link.href}
              className="group flex items-center gap-2 text-gray-300 hover:text-white 
                       transition-all duration-300"
            >
              <HiArrowRight className="w-4 h-4 text-purple-400 -translate-x-2
                                     group-hover:opacity-100 group-hover:translate-x-0
                                     transition-all duration-300" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
