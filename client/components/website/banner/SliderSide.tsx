"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import Slider from "./Slider";

const SLIDER_HEIGHT_CLASS =
  "h-[300px] sm:h-[360px] lg:h-[430px] xl:h-[470px]";

export default function SliderSide({ sliderBanners, sideBanners }: any) {
  if (!sliderBanners?.length && !sideBanners?.length) return null;

  const hasSlider = !!sliderBanners?.length;
  const slices = (sideBanners || []).slice(0, hasSlider ? 2 : 3);

  const sideWrapClass = hasSlider
    ? "flex flex-col gap-4 lg:gap-5 xl:gap-6 h-auto lg:h-[430px] xl:h-[470px]"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:col-span-3 gap-4 lg:gap-5";

  const sideCardClass = hasSlider
    ? "flex-1 min-h-[150px] lg:min-h-0"
    : "h-[220px]";

  return (
    <div className="w-full bg-white">
      <div className="max-w-360 mx-auto py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 xl:gap-6 items-stretch">
          {hasSlider ? (
            <div className="lg:col-span-2 min-w-0">
              <Slider
                banners={sliderBanners}
                heightClass={SLIDER_HEIGHT_CLASS}
                className="rounded-2xl shadow-md ring-1 ring-black/5"
              />
            </div>
          ) : null}

          {slices.length ? (
            <div className={sideWrapClass}>
              {slices.map((item: any, index: number) => (
                <Link
                  key={`side-${index}`}
                  href={item.url ? `/offers${item.url}` : "/products"}
                  className={`group relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md hover:shadow-xl transition-shadow duration-300 ${sideCardClass}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    style={{
                      backgroundImage: `url(${getUploadImageUrl(item.image)})`,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col items-start gap-1">
                    {/* <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                      <span className="h-1 w-4 rounded-full bg-global-primary" />
                      {item.type || "Featured"}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-xs text-white/75 line-clamp-2 leading-relaxed hidden sm:block">
                        {item.description}
                      </p>
                    ) : null} */}

                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 border-b border-white/30 pb-0.5 group-hover:text-global-primary group-hover:border-global-primary transition-colors duration-300">
                      Shop now
                      <ArrowRightOutlined className="text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}