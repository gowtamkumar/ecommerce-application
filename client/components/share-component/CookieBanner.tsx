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
      style={{ background: "#000", color: "#ffffff" }}
      buttonStyle={{
        color: "#4e503b",
        fontSize: "13px",
        backgroundColor: "#ffffff",
      }}
      declineButtonStyle={{
        color: "#ffffff",
        fontSize: "13px",
        backgroundColor: "#ff6b6b",
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
      This website uses cookies to enhance the user experience. By clicking
      &quot;Accept,&quot; you agree to our use of cookies. To learn more, read
      our{" "}
      <Link href="/privacy-policy" style={{ color: "#ffd700" }}>
        Privacy Policy
      </Link>
      .
    </CookieConsent>
  );
};

export default CookieWebsite;
