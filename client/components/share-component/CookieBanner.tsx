"use client";

import Link from "next/link";
import React from "react";
import CookieConsent from "react-cookie-consent";

const CookieWebsite: React.FC = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="WebsiteCookieConsent"
      style={{
        background: "#111827",
        color: "#e5e7eb",
        padding: "12px 20px",
        alignItems: "center",
        fontSize: "13px",
        lineHeight: "1.5",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
      }}
      buttonStyle={{
        color: "#111827",
        fontSize: "13px",
        fontWeight: 600,
        backgroundColor: "#ffffff",
        borderRadius: "9999px",
        padding: "8px 18px",
        margin: "4px",
      }}
      declineButtonStyle={{
        color: "#e5e7eb",
        fontSize: "13px",
        fontWeight: 500,
        backgroundColor: "transparent",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: "9999px",
        padding: "8px 18px",
        margin: "4px",
      }}
      expires={150}
      enableDeclineButton
      onAccept={() => {
        console.log("Cookies accepted");
      }}
      onDecline={() => {
        console.log("Cookies declined");
      }}
    >
      This website uses cookies to enhance your experience. By continuing, you
      agree to our use of cookies.{" "}
      <Link
        href="/privacy-policy"
        style={{ color: "var(--global-primary, #f7aa0e)", fontWeight: 600 }}
      >
        Privacy Policy
      </Link>
    </CookieConsent>
  );
};

export default CookieWebsite;
