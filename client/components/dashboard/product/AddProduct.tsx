/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
    getProduct,
    saveProduct,
    updateProduct,
} from "@/lib/apis/admin/product";
import { ProductType } from "@/lib/types/product";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { generateFile } from "@/lib/utils/imageSetFile";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button, Form, Input, Skeleton } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiBox, FiRefreshCw, FiSave } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const ProductRightTopSection = dynamic(
  () => import("./ProductRightTopSection"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-2">
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    ),
  },
);
const ProductTopSecton = dynamic(() => import("./ProductTopSecton"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-2">
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  ),
});
const TaxDiscountSectoin = dynamic(() => import("./TaxDiscountSectoin"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-2">
      <Skeleton active paragraph={{ rows: 2 }} />
    </div>
  ),
});

const WithOutVariant = dynamic(() => import("./WithOutVariant"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-2">
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  ),
});
const ImageUpload = dynamic(() => import("./ImageUpload"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-2">
      <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  ),
});

const ProductVariant = dynamic(() => import("./ProductVariant"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 p-2">
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  ),
});

// Section card wrapper with accent border
function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-1 h-8 rounded-full bg-gray-800 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-base font-semibold text-global-primary leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs text-global-secondary mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

const AddProduct = ({
  sizes,
  brands,
  units,
  colors,
  discounts,
  categories,
  taxs,
  productId,
}: any) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [product, setProduct] = useState<ProductType | null>(null);
  const [formValues, setFormValues] = useState({
    fileList: [],
    images: [],
    thumbnailImage: "",
    fileThumbnailList: [],
  }) as any;

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const route = useRouter();

  const fetchData = useCallback(async () => {
    try {
      if (!productId) {
        form.resetFields();
        setTags([]);
        return;
      }

      if (productId) {
        const id = productId.toString();
        const result = await getProduct(id);
        const productData = { ...result.data };

        if (!productData.variant && productData.productVariants?.length) {
          const [firstVariant] = productData.productVariants;
          Object.assign(productData, {
            purchasePrice: +firstVariant.purchasePrice,
            unitPrice: +firstVariant.unitPrice,
            stockQty: firstVariant.stockQty,
            variantId: firstVariant.id,
          });
        }

        const productCategories = productData.productCategories?.map(
          (category: any) => category.categoryId,
        );

        productData.fileList =
          productData.images?.map((image: string, idx: number) =>
            generateFile(image, idx),
          ) || [];

        if (productData.thumbnailImage) {
          productData.fileThumbnailList = [
            generateFile(productData.thumbnailImage, "thumbnail"),
          ];
        }

        if (productData.hoverImage) {
          productData.fileHoverList = [
            generateFile(productData.hoverImage, "hover"),
          ];
        }

        form.setFieldsValue({
          ...productData,
          productCategories,
        });
        setProduct({ ...productData, productCategories });
        setTags(productData.tags || []);
        setFormValues(productData);
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
    }
  }, [form, productId]);

  useEffect(() => {
    fetchData();
    return () => {
      if (!productId) {
        form.resetFields();
        setTags([]);
      }
    };
  }, []);

  const handleSubmit = async () => {
    const newData = await form.validateFields();

    delete newData.fileList;
    delete newData.fileThumbnailList;
    delete newData.fileHoverList;

    if (!newData.variant) {
      const productVariants = {
        purchasePrice: +newData.purchasePrice,
        unitPrice: +newData.unitPrice,
        stockQty: newData.stockQty,
        id: newData?.variantId,
      };
      newData.productVariants = [productVariants];
    }

    newData.tags = tags;

    const result = newData.id
      ? () => updateProduct(newData)
      : () => saveProduct(newData);

    await handleAsyncAction(result, dispatch);

    setTags([]);
    setFormValues({});
    route.push(`/dashboard/product`);
  };

  const setFormData = (value: any) => {
    const newData = { ...value };
    if (newData.images) {
      const file = (newData.images || []).map((item: string, idx: number) => ({
        uid: Math.random() * 1000 + "",
        name: `photo ${idx}`,
        status: "done",
        fileName: item,
        url: getUploadImageUrl(item),
      }));
      newData.fileList = file;
    }

    if (newData.thumbnailImage) {
      const newfileThumbnail = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.thumbnailImage,
        url: getUploadImageUrl(newData.thumbnailImage),
      };
      newData.fileThumbnailList = [newfileThumbnail];
    }

    if (newData.hoverImage) {
      const newfileHover = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.hoverImage,
        url: getUploadImageUrl(newData.hoverImage),
      };
      newData.fileHoverList = [newfileHover];
    }

    setFormValues(form.getFieldsValue());
  };

  const resetFormData = (value: any) => {
    const newData = { ...value };
    if (newData?.id) {
      setFormData(newData);
      setTags(newData.tags);
    } else {
      form.resetFields();
      setFormValues(form.getFieldsValue());
      setTags([]);
    }
    dispatch(setLoading({ save: false }));
  };

  const isEditing = !!product?.id;

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-global-secondary mb-3">
            <Link
              href="/dashboard/product"
              className="flex items-center gap-1 hover:text-global-primary transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" />
              Products
            </Link>
            <span>/</span>
            <span className="text-global-primary font-medium">
              {isEditing ? "Edit Product" : "New Product"}
            </span>
          </div>

          {/* Title + Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <FiBox className="w-5 h-5 text-global-secondary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-global-primary leading-tight break-words">
                  {isEditing ? "Edit Product" : "Create New Product"}
                </h1>
                <p className="text-sm text-global-secondary mt-0.5">
                  {isEditing
                    ? "Update product details, pricing, and media."
                    : "Fill in details below to publish a new product."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                size="large"
                icon={<FiRefreshCw className="w-4 h-4" />}
                onClick={() => resetFormData(product)}
                className="!border-gray-300 !text-global-secondary hover:!border-gray-400 hover:!text-global-primary flex items-center gap-1.5"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                Reset
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<FiSave className="w-4 h-4" />}
                onClick={handleSubmit}
                loading={global.loading.save}
                disabled={global.loading.save}
                className="!border-none !px-6 !font-medium flex items-center gap-1.5"
                style={{ borderRadius: "var(--button-border-radius)" }}
              >
                {isEditing ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <Form
          layout="vertical"
          form={form}
          onValuesChange={(_v, values) => setFormValues(values)}
          autoComplete="off"
          scrollToFirstError={true}
          initialValues={{
            productVariants: [{}],
            images: [],
            fileList: [],
            thumbnailImage: "",
            fileThumbnailList: [],
            hoverImage: "",
            fileHoverList: [],
          }}
          className="space-y-6"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="variantId" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ── Left Column ── */}
            <div className="lg:col-span-3 space-y-6">
              <SectionCard
                title="Basic Information"
                subtitle="Product name, slug, and description"
              >
                <ProductTopSecton form={form} />
              </SectionCard>

              <SectionCard
                title="Pricing & Tax"
                subtitle="Apply tax rate and optional discount"
              >
                <TaxDiscountSectoin discounts={discounts} taxs={taxs} />
              </SectionCard>

              <SectionCard
                title="Inventory"
                subtitle="Stock quantities and variant options"
              >
                <WithOutVariant form={form} />
              </SectionCard>

              <SectionCard
                title="Product Variants"
                subtitle="Size, color, material and pricing per variant"
              >
                <ProductVariant
                  formValues={formValues}
                  form={form}
                  sizes={sizes}
                  colors={colors}
                />
              </SectionCard>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="lg:col-span-1 space-y-6">
              <SectionCard
                title="Organization"
                subtitle="Status, category, brand & tags"
              >
                <ProductRightTopSection
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  brands={brands}
                  categories={categories}
                  units={units}
                  tags={tags}
                  setTags={setTags}
                />
              </SectionCard>

              <SectionCard
                title="Media"
                subtitle="Thumbnail, hover, and gallery images"
              >
                <ImageUpload
                  formValues={formValues}
                  form={form}
                  setFormValues={setFormValues}
                />
              </SectionCard>
            </div>
          </div>

          {/* ── Bottom Action Bar ── */}
          <div className="sticky bottom-4 z-10">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-global-secondary">
                All required fields must be completed before saving.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="large"
                  icon={<FiRefreshCw className="w-4 h-4" />}
                  onClick={() => resetFormData(product)}
                  className="!border-gray-300 !text-global-secondary hover:!border-gray-400 hover:!text-global-primary flex items-center gap-1.5"
                  style={{ borderRadius: "var(--button-border-radius)" }}
                >
                  Reset
                </Button>
                <Button
                  size="large"
                  type="primary"
                  icon={<FiSave className="w-4 h-4" />}
                  onClick={handleSubmit}
                  loading={global.loading.save}
                  disabled={global.loading.save}
                  className="px-8 font-semibold flex items-center gap-1.5"
                  style={{ borderRadius: "var(--button-border-radius)" }}
                >
                  {isEditing ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;
