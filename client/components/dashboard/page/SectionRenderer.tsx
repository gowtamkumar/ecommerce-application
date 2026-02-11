import { CustomizerSection } from "@/types/customizer";
import BannerSlider from "./store/BannerSlider";
import BuilderButton from "./store/BuilderButton";
import ImageBlock from "./store/ImageBlock";
import OfferBanner from "./store/OfferBanner";
import ProductSlider from "./store/ProductSlider";
import StatsCounter from "./store/StatsCounter";
import TextBlock from "./store/TextBlock";
import VideoBlock from "./store/VideoBlock";

interface SectionRendererProps {
  section: CustomizerSection;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  if (!section) return null;

  const settings = section.settings as any;
  const styles = {
    paddingTop: `${section.styles?.paddingTop || 0}px`,
    paddingBottom: `${section.styles?.paddingBottom || 0}px`,
    backgroundColor: section.styles?.backgroundColor,
    color: section.styles?.textColor,
    height: section.styles?.height,
    overlayOpacity: section.styles?.overlayOpacity,
    textAlign: section.styles?.textAlign,
    headlineColor: section.styles?.headlineColor,
    sublineColor: section.styles?.sublineColor,
    iconColor: section.styles?.iconColor,
    iconBgColor: section.styles?.iconBgColor,
    iconBorder: section.styles?.iconBorder,
    buttonColor: section.styles?.buttonColor,
    buttonTextColor: section.styles?.buttonTextColor,
    // Section-specific typography CSS custom properties
    ...(section.styles?.headingFontFamily && { '--heading-font-family': section.styles.headingFontFamily } as React.CSSProperties),
    ...(section.styles?.headingFontWeight && { '--heading-font-weight': section.styles.headingFontWeight } as React.CSSProperties),
    ...(section.styles?.headingFontSize && { '--heading-font-size': section.styles.headingFontSize } as React.CSSProperties),
    ...(section.styles?.headingLineHeight && { '--heading-line-height': section.styles.headingLineHeight } as React.CSSProperties),
    ...(section.styles?.paragraphFontFamily && { '--paragraph-font-family': section.styles.paragraphFontFamily } as React.CSSProperties),
    ...(section.styles?.paragraphFontWeight && { '--paragraph-font-weight': section.styles.paragraphFontWeight } as React.CSSProperties),
    ...(section.styles?.paragraphFontSize && { '--paragraph-font-size': section.styles.paragraphFontSize } as React.CSSProperties),
    ...(section.styles?.paragraphLineHeight && { '--paragraph-line-height': section.styles.paragraphLineHeight } as React.CSSProperties),
  };



  // Visibility Logic
  let visibilityClasses = 'block';
  if (section.visibility) {
    const { desktop, mobile } = section.visibility;
    if (mobile && desktop) visibilityClasses = 'block';
    else if (!mobile && desktop) visibilityClasses = 'hidden md:block';
    else if (mobile && !desktop) visibilityClasses = 'block md:hidden';
    else if (!mobile && !desktop) visibilityClasses = 'hidden';
  }

  const renderContent = () => {
    switch (section.type) {
      case "banner":
        return (
          <BannerSlider settings={settings} styles={styles} />
        );



      case "offer-banner":
        return (
          <OfferBanner settings={settings} styles={styles} />
        );


      case "text-block":
        return (
          <TextBlock html={settings?.html} headline={settings?.headline} styles={styles} />
        );

      case "image-block":
        return (
          <ImageBlock
            settings={settings}
            styles={styles}
          />
        );


      case "button":
        return (
          <BuilderButton variant={settings?.variant} size={settings?.size} text={settings?.text} styles={styles} link={settings?.link} />
        );

      case "product-slider":
        return (
          <ProductSlider
            headline={settings?.headline}
            count={settings?.count}
            source={settings?.source}
            productIds={settings?.productIds}
            collectionId={settings?.collectionId}
            layout={settings?.layout}
            columns={settings?.columns}
            styles={styles}
          />
        );
    
      case "stats-counter":
        return (
          <StatsCounter
            stats={settings?.items}
            styles={styles}
          />
        );
      case "video-block":
        return (
          <VideoBlock settings={settings} styles={styles} />
        );
      default:
        return null;
    }
  };

  return (
    <div key={section.id} className={`responsive-section ${visibilityClasses}`}>
      {renderContent()}
    </div>
  );
};

export default SectionRenderer;
