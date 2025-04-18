"use client";
import appConfig from "@/appConfig";
import { selectProduct } from "@/redux/features/products/productSlice";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

interface ProductShareProps {
  productUrl: string;
  name: string;
}

const ProductShare = () => {
  const products = useSelector(selectProduct);
  const { name, slug } = products.product;

  const productUrl = `${appConfig.publicUrl}/product/${slug}`;

  return (
    <div className="flex items-center space-x-4 mt-6">
      {/* Facebook Share */}
      <FacebookShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
        hashtag="#Ecommerce"
      >
        <FaFacebook size={40} />
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
      >
        <FaXTwitter size={40} />
      </TwitterShareButton>

      {/* WhatsApp Share */}
      <WhatsappShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
      >
        <WhatsappIcon size={40} round />
      </WhatsappShareButton>

      {/* Email Share */}
      <EmailShareButton
        url={productUrl}
        subject={`Amazing Product: ${name}`}
        body={`Check out this product: ${productUrl}`}
      >
        <EmailIcon size={40} round />
      </EmailShareButton>
    </div>
  );
};

export default ProductShare;
