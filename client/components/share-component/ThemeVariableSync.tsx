"use client";

import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeVariableSync() {
  const global = useSelector(selectGlobal);
  const appearance = global?.setting?.appearance;

  useEffect(() => {
    if (!appearance || typeof document === "undefined") return;

    const root = document.documentElement;

    if (appearance.primaryFont) {
      root.style.setProperty("--primary-font", appearance.primaryFont);
    }
    if (appearance.secondaryFont) {
      root.style.setProperty("--secondary-font", appearance.secondaryFont);
    }
    if (appearance.baseFontSize) {
      root.style.setProperty("--base-font-size", `${appearance.baseFontSize}px`);
    }
    if (appearance.headingWeight) {
      root.style.setProperty("--heading-font-weight", `${appearance.headingWeight}`);
    }
    if (appearance.bodyWeight) {
      root.style.setProperty("--body-font-weight", `${appearance.bodyWeight}`);
    }
    if (appearance.primaryColor) {
      root.style.setProperty("--global-primary", appearance.primaryColor);
      root.style.setProperty("--button-primary-color", appearance.primaryColor);
    }
    if (appearance.primaryHoverColor) {
      root.style.setProperty("--primary-hover", appearance.primaryHoverColor);
      root.style.setProperty("--button-hover-color", appearance.primaryHoverColor);
    }
    if (appearance.secondaryColor) {
      root.style.setProperty("--global-secondary", appearance.secondaryColor);
    }
    if (appearance.backgroundColor) {
      root.style.setProperty("--background-color", appearance.backgroundColor);
    }
    if (appearance.textColor) {
      root.style.setProperty("--text-color", appearance.textColor);
    }
    if (appearance.buttonBorderRadius !== undefined) {
      root.style.setProperty("--button-border-radius", `${appearance.buttonBorderRadius}px`);
    }
    if (appearance.topBarBg) {
      root.style.setProperty("--topbar-bg", appearance.topBarBg);
    }
    if (appearance.topBarText) {
      root.style.setProperty("--topbar-text", appearance.topBarText);
    }
    if (appearance.headerBg) {
      root.style.setProperty("--header-bg", appearance.headerBg);
    }
    if (appearance.headerText) {
      root.style.setProperty("--header-text", appearance.headerText);
    }
    if (appearance.footerBg) {
      root.style.setProperty("--footer-bg", appearance.footerBg);
    }
    if (appearance.footerText) {
      root.style.setProperty("--footer-text", appearance.footerText);
    }

    // Dynamic Google Fonts loading on client when typography changes
    const fontsToLoad = [appearance.primaryFont, appearance.secondaryFont]
      .filter(Boolean)
      .filter((f) => typeof f === "string" && !f.includes("var(--font-poppins)") && !f.includes("system-ui"))
      .map((f) => f.split(",")[0].trim())
      .filter((v, i, a) => a.indexOf(v) === i);

    if (fontsToLoad.length > 0) {
      const linkId = "client-dynamic-google-fonts";
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?${fontsToLoad
        .map((f) => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800;900`)
        .join("&")}&display=swap`;
    }
  }, [appearance]);

  return null;
}

