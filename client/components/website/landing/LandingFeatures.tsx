import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiHeadphones,
  FiRepeat,
  FiShield,
  FiStar,
  FiTruck,
} from "react-icons/fi";

interface LandingFeatureItem {
  icon?: any;
  title: string;
  description: string;
}

interface LandingFeaturesProps {
  features?: LandingFeatureItem[];
  title?: string;
  subtitle?: string;
}

export default function LandingFeatures({
  features: customFeatures,
  title,
  subtitle,
}: LandingFeaturesProps) {
  const defaultFeatures: LandingFeatureItem[] = [
    {
      icon: <FiStar className="text-amber-500 text-2xl" />,
      title: "100% Premium Quality / প্রিমিয়াম কোয়ালিটি",
      description: "Crafted with durable, high-grade materials and export-quality fine stitching.",
    },
    {
      icon: <FiDollarSign className="text-emerald-500 text-2xl" />,
      title: "Cash On Delivery / ক্যাশ অন ডেলিভারি",
      description: "Zero advance payment required. Inspect and pay safely at your doorstep.",
    },
    {
      icon: <FiCheckCircle className="text-blue-500 text-2xl" />,
      title: "Open Box Inspection / দেখে নেওয়ার সুযোগ",
      description: "Check product quality and fitting in front of the delivery agent before paying.",
    },
    {
      icon: <FiTruck className="text-rose-500 text-2xl" />,
      title: "Fast Worldwide Delivery / দ্রুত ডেলিভারি",
      description: "24-48 hours domestic express and nationwide door-to-door delivery.",
    },
    {
      icon: <FiRepeat className="text-purple-500 text-2xl" />,
      title: "Easy Exchange & Return / সহজ রিটার্ন",
      description: "Hassle-free replacement policy if you need a different size or color.",
    },
    {
      icon: <FiHeadphones className="text-cyan-500 text-2xl" />,
      title: "24/7 Dedicated Support / সার্বক্ষণিক সাপোর্ট",
      description: "Prompt customer assistance anytime via WhatsApp, phone, or live chat.",
    },
  ];

  const features = customFeatures && customFeatures.length > 0 ? customFeatures : defaultFeatures;

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <span className="text-xs uppercase tracking-widest font-black text-global-primary">
          {subtitle || "আমাদের বিশেষত্ব"}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          {title || "কেন আমাদের পণ্যটি কিনবেন?"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feat, index) => (
          <div
            key={index}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-xs"
          >
            <div className="p-2.5 rounded-xl bg-white shadow-2xs shrink-0">
              {feat.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
