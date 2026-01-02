import dynamic from "next/dynamic";
import FooterTop from "./FooterTop";
const FourWeight = dynamic(() => import("../weight/FourWeight"));
const ThirdWeight = dynamic(() => import("../weight/ThirdWeight"));
const SecondWeight = dynamic(() => import("../weight/SecondWeight"));
const FirstWeight = dynamic(() => import("../weight/FirstWeight"));
const SocialIcon = dynamic(() => import("./SocialIcon"));

export default function WebFooter() {
  return (
    <footer className="relative bg-global-footer-bg text-global-footer-text font-sans overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-global-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-global-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top Features */}
      <div className="relative border-b border-global-footer-text/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <FooterTop />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="flex flex-col gap-4">
            <FirstWeight />
          </div>
          <div>
            <SecondWeight />
          </div>
          <div>
            <ThirdWeight />
          </div>
          <div>
            <FourWeight />
          </div>
        </div>
      </div>

      {/* Divider with gradient */}
      <div className="relative w-full h-px bg-gradient-to-r from-transparent via-global-footer-text/20 to-transparent"></div>

      {/* Social Icons Section */}
      <div className="relative bg-black/10 backdrop-blur-sm py-10 border-t border-global-footer-text/5">
        <div className="container mx-auto px-4">
          <SocialIcon />
        </div>
      </div>
    </footer>
  );
}
