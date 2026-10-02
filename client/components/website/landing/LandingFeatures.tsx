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

export default function LandingFeatures() {
  const features = [
    {
      icon: <FiStar className="text-amber-500 text-2xl" />,
      title: "১০০% প্রিমিয়াম কোয়ালিটি",
      description: "সর্বোচ্চ মানের টেকসই ও আরামদায়ক ফেব্রিক দ্বারা প্রস্তুতকৃত।",
    },
    {
      icon: <FiDollarSign className="text-emerald-500 text-2xl" />,
      title: "ক্যাশ অন ডেলিভারি",
      description: "কোনো অগ্রিম পেমেন্ট ছাড়াই পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।",
    },
    {
      icon: <FiCheckCircle className="text-blue-500 text-2xl" />,
      title: "দেখে চেক করে নেওয়ার সুযোগ",
      description: "ডেলিভারি ম্যানের সামনে পণ্য দেখে সন্তুষ্ট হয়ে মূল্য দিন।",
    },
    {
      icon: <FiTruck className="text-rose-500 text-2xl" />,
      title: "সারা দেশে দ্রুত ডেলিভারি",
      description: "ঢাকার ভিতরে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৩ দিনে হোম ডেলিভারি।",
    },
    {
      icon: <FiRepeat className="text-purple-500 text-2xl" />,
      title: "সহজ রিটার্ন ও এক্সচেঞ্জ",
      description: "সাইজ বা কালার সমস্যা হলে ৩ দিনের মধ্যে পরিবর্তনের সুবিধা।",
    },
    {
      icon: <FiHeadphones className="text-cyan-500 text-2xl" />,
      title: "২৪/৭ কাস্টমার সাপোর্ট",
      description: "অর্ডার বা পণ্যের যেকোনো তথ্যের জন্য আমাদের কল বা হোয়াটসঅ্যাপ করুন।",
    },
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <span className="text-xs uppercase tracking-widest font-black text-global-primary">
          আমাদের বিশেষত্ব
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          কেন আমাদের পণ্যটি কিনবেন?
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
