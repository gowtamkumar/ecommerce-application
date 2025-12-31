"use client";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";

interface ProductShareProps {
  productUrl: string;
  name: string;
}

const Share = ({ value }: { value: any }) => {
  const { name, url } = value;


  return (
    <div className="flex items-center space-x-4">
      {/* Facebook Share */}
      <FacebookShareButton
        url={url}
        title={`Check out this amazing product: ${name}`}
        hashtag="#Ecommerce"
      >
        <FaFacebook size={30} />
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton
        url={url}
        title={`Check out this amazing product: ${name}`}
      >
        <FaXTwitter size={30} />
      </TwitterShareButton>

      {/* WhatsApp Share */}
      <WhatsappShareButton
        url={url}
        title={`Check out this amazing product: ${name}`}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>

      {/* Email Share */}
      {/* <EmailShareButton
        url={url}
        subject={`Amazing Product: ${name}`}
        body={`Check out this product: ${url}`}
      >
        <EmailIcon size={30} round />
      </EmailShareButton> */}
    </div>
  );
};

export default Share;
