"use client";
import { useCurrency } from "@/context/CurrencyContext";
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
  const { formatPrice } = useCurrency();

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
          {/* Basic Information */}
          <Card title="Basic Information" variant="borderless" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Product Type" span={2}>{product.type || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Brand ID">{product.brandId || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Unit ID">{product.unitId || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Tax ID">{product.taxId || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Discount ID">{product.discountId || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={product.status === "Active" ? "green" : "red"}>
                  {product.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Enable Reviews" span={2}>
                <Tag color={product.enableReview ? "blue" : "default"}>
                  {product.enableReview ? "Enabled" : "Disabled"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Description */}
          <Card title="Description" variant="borderless" className="shadow-sm">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Description">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </Descriptions.Item>
              <Descriptions.Item label="Short Description">
                {product.shortDescription || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Inventory Settings */}
          <Card title="Inventory Settings" variant="borderless" className="shadow-sm">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Alert Quantity">
                <Tag color="orange">{product.alertQty || 0}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Purchase Limit">
                <Tag color="purple">{product.limitPurchaseQty || "Unlimited"}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Categories */}
          {product.productCategories && product.productCategories.length > 0 && (
            <Card title="Categories" variant="borderless" className="shadow-sm">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Category IDs">
                  {product.productCategories.map((cat) => (
                    <Tag key={cat.categoryId} color="cyan">{cat.categoryId}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card title="Tags" variant="borderless" className="shadow-sm">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </div>
            </Card>
          )}

          {/* Product Variants */}
          {product.productVariants && product.productVariants.length > 0 && (
            <Card title="Product Variants" variant="borderless" className="shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">ID</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Size ID</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Unit Price</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Purchase Price</th>
                      <th className="text-left p-3 border-b font-semibold text-gray-700">Stock Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.productVariants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-b">
                          <Tag color="geekblue">{variant.id}</Tag>
                        </td>
                        <td className="p-3 border-b">
                          <Tag>{variant.sizeId || "N/A"}</Tag>
                        </td>
                        <td className="p-3 border-b">
                          <span className="font-semibold text-green-600">
                            {formatPrice(variant.price)}
                          </span>
                        </td>
                        <td className="p-3 border-b">
                          <span className="text-gray-600">
                            {formatPrice(variant.purchasePrice)}
                          </span>
                        </td>
                        <td className="p-3 border-b">
                          <Tag color={variant.stockQty > product.alertQty ? "green" : "red"}>
                            {variant.stockQty || 0} units
                          </Tag>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
