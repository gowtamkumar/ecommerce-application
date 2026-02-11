import { CustomizerSection } from '@/types/customizer';
import SectionRenderer from './SectionRenderer';

interface PageRendererProps {
  sections: CustomizerSection[];
  typography?: {
    fontFamily?: string;
    headingFont?: string;
    baseFontSize?: number;
    headingFontFamily?: string;
    headingFontWeight?: string;
    headingFontSize?: string;
    headingLineHeight?: string;
    paragraphFontFamily?: string;
    paragraphFontWeight?: string;
    paragraphFontSize?: string;
    paragraphLineHeight?: string;
  };
  className?: string;
}

/**
 * PageRenderer - Renders page sections with typography support
 * Used by both public pages and the customizer preview
 */
export default function PageRenderer({ sections, typography, className = '' }: PageRendererProps) {
  const typographyStyles = {
    fontFamily: typography?.fontFamily || 'Inter, sans-serif',
    fontSize: `${typography?.baseFontSize || 16}px`,
    ...(typography?.headingFont && { '--heading-font': typography.headingFont } as React.CSSProperties),
    ...(typography?.headingFontFamily && { '--heading-font-family': typography.headingFontFamily } as React.CSSProperties),
    ...(typography?.headingFontWeight && { '--heading-font-weight': typography.headingFontWeight } as React.CSSProperties),
    ...(typography?.headingFontSize && { '--heading-font-size': typography.headingFontSize } as React.CSSProperties),
    ...(typography?.headingLineHeight && { '--heading-line-height': typography.headingLineHeight } as React.CSSProperties),
    ...(typography?.paragraphFontFamily && { '--paragraph-font-family': typography.paragraphFontFamily } as React.CSSProperties),
    ...(typography?.paragraphFontWeight && { '--paragraph-font-weight': typography.paragraphFontWeight } as React.CSSProperties),
    ...(typography?.paragraphFontSize && { '--paragraph-font-size': typography.paragraphFontSize } as React.CSSProperties),
    ...(typography?.paragraphLineHeight && { '--paragraph-line-height': typography.paragraphLineHeight } as React.CSSProperties),
  };

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className={className} style={typographyStyles}>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
}
