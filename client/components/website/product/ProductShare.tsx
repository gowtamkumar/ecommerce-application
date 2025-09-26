"use client";
import appConfig from "@/appConfig";
import { selectProduct } from "@/redux/features/products/productSlice";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  EmailIcon,
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
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
    <div className="flex items-center space-x-4">
      {/* Facebook Share */}
      <FacebookShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
        hashtag="#Ecommerce"
      >
        <FaFacebook size={30} />
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
      >
        <FaXTwitter size={30} />
      </TwitterShareButton>

      {/* WhatsApp Share */}
      <WhatsappShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
      >
        <WhatsappIcon size={30} round />
      </WhatsappShareButton>

      {/* Email Share */}
      <EmailShareButton
        url={productUrl}
        subject={`Amazing Product: ${name}`}
        body={`Check out this product: ${productUrl}`}
      >
        <EmailIcon size={30} round />
      </EmailShareButton>
    </div>
  );
};

export default ProductShare;
