"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Link from "next/link";
import Slider from "./Slider";

const SLIDER_HEIGHT_CLASS =
  "h-[180px] sm:h-[240px] md:h-[290px] lg:h-[310px] xl:h-[330px]";

export default function SliderSide({ sliderBanners, sideBanners }: any) {
  if (!sliderBanners?.length && !sideBanners?.length) return null;

  const hasSlider = !!sliderBanners?.length;
  const slices = (sideBanners || []).slice(0, hasSlider ? 2 : 3);

  const sideWrapClass = hasSlider
    ? "grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4 lg:gap-3.5 xl:gap-4 lg:h-[310px] xl:h-[330px]"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:col-span-3 gap-3 sm:gap-4 lg:gap-4";

  const sideCardClass = hasSlider
    ? "h-[140px] sm:h-[150px] md:h-[160px] lg:h-auto lg:flex-1 min-h-0"
    : "h-[150px] sm:h-[170px] md:h-[190px]";

  return (
    <div className="w-full bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-3.5 xl:gap-4 items-stretch">
          {hasSlider ? (
            <div className="lg:col-span-2 min-w-0">
              <Slider
                banners={sliderBanners}
                heightClass={SLIDER_HEIGHT_CLASS}
                className="rounded-2xl shadow-sm ring-1 ring-black/5"
              />
            </div>
          ) : null}

          {slices.length ? (
            <div className={sideWrapClass}>
              {slices.map((item: any, index: number) => (
                <Link
                  key={`side-${index}`}
                  href={item.url ? `/offers${item.url}` : "/products"}
                  className={`group relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-lg transition-all duration-300 block ${sideCardClass}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    style={{
                      backgroundImage: `url(${getUploadImageUrl(item.image)})`,
                    }}
                  />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}