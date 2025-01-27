"use client";
import appConfig from "@/appConfig";
import { selectProduct } from "@/redux/features/products/productSlice";
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

  const productUrl = `${appConfig.url}/product/${slug}`;
  console.log("productUrl", productUrl);

  return (
    <div className="flex items-center space-x-4 mt-6">
      {/* Facebook Share */}
      <FacebookShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
        hashtag="#Ecommerce"
      >
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      {/* Twitter Share */}
      <TwitterShareButton
        url={productUrl}
        title={`Check out this amazing product: ${name}`}
      >
        <TwitterIcon size={40} round />
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
