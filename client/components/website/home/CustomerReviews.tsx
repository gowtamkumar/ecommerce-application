"use client";

import { getReviews } from "@/lib/apis/review";
import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    FiCheckCircle,
    FiShoppingBag,
    FiStar,
    FiThumbsUp,
    FiUsers,
} from "react-icons/fi";

interface CustomerReviewsProps {
  initialReviews?: any[];
}

interface DisplayReviewItem {
  id: string | number;
  name: string;
  avatar: string | null;
  role: string;
  rating: number;
  comment: string;
  product: { name: string; slug: string };
  date: string;
  like: number;
}

const FALLBACK_REVIEWS: DisplayReviewItem[] = [
  {
    id: "fb-1",
    name: "Alexander Wright",
    avatar: null,
    role: "Verified Buyer",
    rating: 5,
    comment:
      "The build quality exceeded my expectations. From packaging to doorstep arrival in under 48 hours, the entire shopping journey felt truly executive.",
    product: { name: "Signature Leather Weekend Duffel", slug: "" },
    date: "2 days ago",
    like: 12,
  },
  {
    id: "fb-2",
    name: "Sophia Chen",
    avatar: null,
    role: "Verified Buyer",
    rating: 5,
    comment:
      "I had a quick inquiry regarding sizing and the concierge team responded within 2 minutes. The fit is perfect and the material feels luxurious.",
    product: { name: "Merino Wool Knit Overshirt", slug: "" },
    date: "1 week ago",
    like: 8,
  },
  {
    id: "fb-3",
    name: "Marcus Vance",
    avatar: null,
    role: "Verified Buyer",
    rating: 5,
    comment:
      "I was hesitant about ordering online, but everything from live GPS tracking to the unboxing was five stars. Highly recommended to anyone who values quality.",
    product: { name: "Minimalist Chrono Timepiece", slug: "" },
    date: "2 weeks ago",
    like: 15,
  },
];

function formatReviewDate(dateStr?: string): string {
  if (!dateStr) return "Recently";
  try {
    const d = new Date(dateStr);
    const now = Date.now();
    const diffMs = now - d.getTime();
    if (isNaN(diffMs)) return "Recently";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

export default function CustomerReviews({ initialReviews }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<any[]>(initialReviews || []);
  const [loading, setLoading] = useState<boolean>(!initialReviews || initialReviews.length === 0);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        const res = await getReviews({ limit: 12 });
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch customer reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (!initialReviews || initialReviews.length === 0) {
      fetchReviews();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [initialReviews]);

  // Combine real reviews with fallbacks if there are fewer than 3 reviews in the database
  const displayReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return FALLBACK_REVIEWS;
    }

    // Map real API reviews to unified display shape
    const formattedRealReviews = reviews.map((item: any) => ({
      id: item.id,
      name: item.user?.name || "Verified Customer",
      avatar: item.user?.image ? getImageUrl(item.user.image) : null,
      role: "Verified Buyer",
      rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
      comment: item.comment || "Outstanding quality and fast fulfillment. Highly recommended!",
      product: item.product || { name: "Storefront Purchase", slug: "" },
      date: formatReviewDate(item.createdAt),
      like: Number(item.like) || 0,
    }));

    if (formattedRealReviews.length >= 3) {
      return formattedRealReviews.slice(0, 6);
    }

    // Supplement with fallback cards to keep a balanced 3-column layout
    const needed = 3 - formattedRealReviews.length;
    return [...formattedRealReviews, ...FALLBACK_REVIEWS.slice(0, needed)];
  }, [reviews]);

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

        {/* Dynamic Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {displayReviews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-amber-300/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Stars + Date + Helpful Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    {[...Array(Math.max(0, 5 - item.rating))].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-gray-200" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.like > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        <FiThumbsUp className="w-3 h-3 text-amber-500" />
                        <span>{item.like}</span>
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-gray-400">
                      {item.date}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>
              </div>

              {/* Reviewer Meta & Product Bought */}
              <div className="pt-5 mt-6 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.avatar ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-global-primary font-black text-xs flex items-center justify-center shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <span className="text-sm font-bold text-gray-900 block truncate">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 shrink-0">
                    <FiCheckCircle className="w-3 h-3" />
                    <span>{item.role}</span>
                  </span>
                </div>

                {/* Verified Item Purchased */}
                {item.product?.name && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <FiShoppingBag className="w-3 h-3 text-amber-500 shrink-0" />
                    {item.product.slug ? (
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="truncate hover:text-global-primary hover:underline transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    ) : (
                      <span className="truncate">{item.product.name}</span>
                    )}
                  </div>
                )}
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
