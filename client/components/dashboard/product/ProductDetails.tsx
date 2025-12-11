"use client";
import { getProduct } from "@/lib/apis/admin/product";
import { ProductType } from "@/lib/types/product";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Image, Spin, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails = ({ productId }: ProductDetailsProps) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(productId);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="!mb-0">{product.name}</Title>
          <Text type="secondary">Product ID: {product.id}</Text>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/dashboard/product/${productId}/edit`)}
          className="!bg-black hover:!bg-gray-800"
        >
          Edit Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="overflow-hidden">
            <Image
              src={getUploadImageUrl(product.singleImage)}
              alt={product.name}
              className="w-full object-cover rounded-lg"
            />
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {product.images?.map((img, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <Image
                  src={getUploadImageUrl(img)}
                  alt={`${product.name} - ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Basic Information" variant="borderless" className="shadow-sm">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Description">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </Descriptions.Item>
              <Descriptions.Item label="Short Description">{product.shortDescription}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={product.status === "Active" ? "green" : "red"}>
                  {product.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Enable Reviews">
                {product.enableReview ? "Yes" : "No"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Pricing & Inventory" variant="borderless" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Unit Price">{product.productVariants?.[0]?.price}</Descriptions.Item>
              <Descriptions.Item label="Purchase Price">{product.productVariants?.[0]?.purchasePrice}</Descriptions.Item>
              <Descriptions.Item label="Stock Quantity">{product.productVariants?.[0]?.stockQty}</Descriptions.Item>
              <Descriptions.Item label="Alert Quantity">{product.alertQty}</Descriptions.Item>
              <Descriptions.Item label="Purchase Limit">{product.limitPurchaseQty}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Organization" variant="borderless" className="shadow-sm">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tags">
                {product.tags?.map((tag) => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Descriptions.Item>
              {/* Add Brand and Category if available in the response structure */}
            </Descriptions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
