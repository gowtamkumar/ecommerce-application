export const BANNER_LAYOUTS = {
  slider: "slider",
  sliderSide: "slider_side",
} as const;

export type BannerLayout = (typeof BANNER_LAYOUTS)[keyof typeof BANNER_LAYOUTS];

export function resolveBannerGroups(banners: any[], layout?: string) {
  const sliderBanners =
    banners?.filter((item: { type: string }) => item.type === "Slider") || [];

  const isSideLayout = layout === BANNER_LAYOUTS.sliderSide;

  let sideBanners = isSideLayout
    ? banners?.filter(
        (item: { type: string }) => item.type === "Slider Right",
      ) || []
    : [];

  const usedPromoIds = new Set<number>();

  if (isSideLayout && !sideBanners.length) {
    const promoBanners =
      banners?.filter((item: { type: string }) => item.type === "Banner") || [];
    const footerBanners =
      banners?.filter((item: { type: string }) => item.type === "Footer") || [];
    sideBanners = [...promoBanners, ...footerBanners].slice(0, 2);
    promoBanners
      .slice(0, 2)
      .forEach((item: any) => item.id && usedPromoIds.add(item.id));
  }

  return { sliderBanners, sideBanners, usedPromoIds };
}