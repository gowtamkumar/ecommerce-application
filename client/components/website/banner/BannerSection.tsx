"use client";
import Slider from "./Slider";
import SliderSide from "./SliderSide";
import { BANNER_LAYOUTS, resolveBannerGroups } from "./bannerGroups";

export { BANNER_LAYOUTS, resolveBannerGroups };

export default function BannerSection({ banners, layout }: any) {
  const { sliderBanners, sideBanners } = resolveBannerGroups(banners, layout);

  if (!sliderBanners?.length && !sideBanners?.length) return null;

  const resolvedLayout =
    layout === BANNER_LAYOUTS.sliderSide && sideBanners?.length
      ? BANNER_LAYOUTS.sliderSide
      : BANNER_LAYOUTS.slider;

  if (resolvedLayout === BANNER_LAYOUTS.sliderSide) {
    return (
      <SliderSide sliderBanners={sliderBanners} sideBanners={sideBanners} />
    );
  }

  return <Slider banners={sliderBanners} />;
}