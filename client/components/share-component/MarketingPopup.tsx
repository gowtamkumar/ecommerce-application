"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Typography } from "antd";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils/imageUrl";

const { Title, Text } = Typography;

interface MarketingPopupProps {
  marketing: any;
}

const MarketingPopup: React.FC<MarketingPopupProps> = ({ marketing }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if enabled (handle both boolean and string "true")
    const isEnabled = marketing?.popupEnabled === true || marketing?.popupEnabled === "true";
    if (!isEnabled) return;

    // For testing/development, you might want to bypass this
    const hasSeenPopup = localStorage.getItem("hasSeenMarketingPopup");
    // If you want to see it every time while testing, comment out the line below
    // if (hasSeenPopup) return;
    if (hasSeenPopup) return;

    const delay = parseInt(marketing?.popupDelay?.toString() || "3000");

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [marketing]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("hasSeenMarketingPopup", "true");
  };

  const isEnabled = marketing?.popupEnabled === true || marketing?.popupEnabled === "true";
  if (!isEnabled) return null;
  

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={450}
      styles={{ body: { padding: 0, overflow: 'hidden', borderRadius: '16px' } }}
      closeIcon={<div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm hover:bg-white transition-colors">✕</div>}
    >
      <div className="flex flex-col">
        {marketing.popupImage && (
          <div className="w-full aspect-square overflow-hidden relative">
            <img 
              src={getImageUrl(marketing.popupImage)} 
              alt={marketing.popupTitle || "Special Offer"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 text-center bg-white">
          {marketing.popupTitle && (
            <Title level={3} className="!mb-2 !font-bold">
              {marketing.popupTitle}
            </Title>
          )}
          {marketing.popupDescription && (
            <Text className="text-gray-500 text-lg block mb-6">
              {marketing.popupDescription}
            </Text>
          )}
          {marketing.popupLink && (
            <Link href={marketing.popupLink} onClick={handleClose}>
              <Button 
                type="primary" 
                size="large" 
                block 
                className="!bg-black hover:!bg-gray-800 !h-12 !text-lg !font-semibold !rounded-xl border-none"
              >
                Learn More
              </Button>
            </Link>
          )}
          <button 
            onClick={handleClose}
            className="mt-4 text-gray-400 hover:text-gray-600 transition-colors text-sm underline underline-offset-4"
          >
            No thanks, I&apos;m not interested
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MarketingPopup;
