import dynamic from "next/dynamic";
import FooterTop from "./FooterTop";
const FourWeight = dynamic(() => import("../weight/FourWeight"));
const ThirdWeight = dynamic(() => import("../weight/ThirdWeight"));
const SecondWeight = dynamic(() => import("../weight/SecondWeight"));
const FirstWeight = dynamic(() => import("../weight/FirstWeight"));
const SocialIcon = dynamic(() => import("./SocialIcon"));

export default function WebFooter() {
  return (
    <footer className="bg-gray-800 text-white">
      <FooterTop />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 text-center md:text-start gap-2 py-6 lg:py-8 md:grid-cols-4 ">
          <FirstWeight />
          <SecondWeight />
          <ThirdWeight />
          <FourWeight />
        </div>
      </div>
      <div className="bg-gray-200">
        <SocialIcon />
      </div>
      <div className="mt-10 md:hidden">top</div>
    </footer>
  );
}
