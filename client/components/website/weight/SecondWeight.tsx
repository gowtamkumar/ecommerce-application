import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";

export default function SecondWeight() {
  const links = [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
    { href: "/support-and-help", label: "Support & Help" },
    { href: "/support-and-help", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-global-footer-text uppercase tracking-wide 
                   relative inline-block after:content-[''] after:absolute after:bottom-0 
                   after:left-0 after:w-12 after:h-0.5 after:bg-global-primary pb-2">
        Help Center
      </h2>

      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="group flex items-center gap-2 text-global-footer-text/80 hover:text-global-footer-text 
                       transition-all duration-300"
            >
              <HiArrowRight className="w-4 h-4 text-global-primary/60 -translate-x-2
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
