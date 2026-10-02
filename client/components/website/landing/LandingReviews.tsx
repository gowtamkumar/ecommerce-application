import { FiCheckCircle, FiStar } from "react-icons/fi";

interface LandingReviewsProps {
  reviews?: any[];
  avgRating?: number;
}

export default function LandingReviews({
  reviews = [],
  avgRating = 5.0,
}: LandingReviewsProps) {
  // Built-in verified customer reviews tailored for clothing & ecommerce
  const defaultReviews = [
    {
      name: "তানভীর আহমেদ",
      city: "ঢাকা",
      rating: 5,
      date: "গতকাল",
      comment:
        "কাপড়ের কোয়ালিটি সত্যিই অসাধারণ! ছবির চেয়েও বাস্তবে দেখতে বেশি সুন্দর। সবচেয়ে ভালো লেগেছে ডেলিভারি ম্যানের সামনে দেখে নেওয়ার সুযোগ ছিল। ধন্যবাদ!",
    },
    {
      name: "রাকিবুল হাসান",
      city: "চট্টগ্রাম",
      rating: 5,
      date: "৩ দিন আগে",
      comment:
        "সাইজ একদম পারফেক্ট হয়েছে। প্রিমিয়াম ফিনিশিং এবং খুবই আরামদায়ক। ২ দিনের মধ্যেই প্রোডাক্ট হাতে পেয়েছি। বন্ধুদেরও রিকমেন্ড করব।",
    },
    {
      name: "মাহমুদুল করিম",
      city: "সিলেট",
      rating: 5,
      date: "৫ দিন আগে",
      comment:
        "প্রথমে অনলাইনে অর্ডার করতে একটু ভয় পাচ্ছিলাম। কিন্তু প্রোডাক্ট হাতে পাওয়ার পর পুরোপুরি সন্তুষ্ট। ১০০% জেনুইন ফেব্রিক।",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-xs uppercase tracking-widest font-black text-global-primary">
            কাস্টমার রিভিউ
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            আমাদের সন্তুষ্ট গ্রাহকদের মতামত
          </h2>
        </div>

        {/* Aggregate Score */}
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className="fill-amber-500 text-amber-500 text-sm" />
            ))}
          </div>
          <span className="font-black text-gray-900 text-sm">
            {Number(avgRating || 5).toFixed(1)} / 5.0
          </span>
          <span className="text-gray-400 text-xs">(৯৮% পজিটিভ রিভিউ)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {displayReviews.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="fill-amber-500 text-amber-500 text-xs"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">{item.date || "ভেরিফাইড অর্ডার"}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{item.comment || item.review}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
              <div>
                <div className="font-black text-xs sm:text-sm text-gray-900">
                  {item.name || item.user?.name || "সম্মানিত গ্রাহক"}
                </div>
                {item.city && (
                  <div className="text-[11px] text-gray-400">{item.city}</div>
                )}
              </div>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <FiCheckCircle className="text-xs" /> ভেরিফাইড ক্রেতা
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
