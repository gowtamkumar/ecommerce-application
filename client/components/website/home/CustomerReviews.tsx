"use client";

import {
    FiCheckCircle,
    FiShoppingBag,
    FiStar,
    FiUsers,
} from "react-icons/fi";

const REVIEWS = [
  {
    name: "Alexander Wright",
    role: "Verified Buyer",
    rating: 5,
    title: "Unmatched craftsmanship & rapid delivery",
    review:
      "The build quality exceeded my expectations. From packaging to doorstep arrival in under 48 hours, the entire shopping journey felt truly executive.",
    item: "Signature Leather Weekend Duffel",
    date: "2 days ago",
  },
  {
    name: "Sophia Chen",
    role: "Verified Buyer",
    rating: 5,
    title: "Best customer service I’ve experienced",
    review:
      "I had a quick inquiry regarding sizing and the concierge team responded within 2 minutes. The fit is perfect and the material feels luxurious.",
    item: "Merino Wool Knit Overshirt",
    date: "1 week ago",
  },
  {
    name: "Marcus Vance",
    role: "Verified Buyer",
    rating: 5,
    title: "Flawless returns and genuine authenticity",
    review:
      "I was hesitant about ordering online, but everything from live GPS tracking to the unboxing was five stars. Highly recommended to anyone who values quality.",
    item: "Minimalist Chrono Timepiece",
    date: "2 weeks ago",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/70 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold uppercase tracking-widest">
            <FiUsers className="w-3.5 h-3.5 text-amber-600" />
            <span>Community & Trust</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Loved by Over 50,000+ Shoppers
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Real feedback from verified customers around the globe who trust our standards of design and durability.
          </p>
        </div>

        {/* 3-Column Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {REVIEWS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-amber-300/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-gray-400">
                    {item.date}
                  </span>
                </div>

                {/* Review Headline & Text */}
                <div>
                  <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    "{item.title}"
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.review}
                  </p>
                </div>
              </div>

              {/* Reviewer Meta */}
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">
                    {item.name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    <FiCheckCircle className="w-3 h-3" />
                    <span>{item.role}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FiShoppingBag className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">{item.item}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs text-center">
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">4.9 / 5.0</div>
            <div className="text-xs text-gray-500 mt-0.5">Average Customer Rating</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">99.4%</div>
            <div className="text-xs text-gray-500 mt-0.5">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">50,000+</div>
            <div className="text-xs text-gray-500 mt-0.5">Orders Fulfilled</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">24 Hours</div>
            <div className="text-xs text-gray-500 mt-0.5">Average Dispatch Speed</div>
          </div>
        </div>
      </div>
    </section>
  );
}

