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
import { Button, Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductRightTopSection = dynamic(
  () => import("./ProductRightTopSection"),
  {
    ssr: false,
    loading: () => "Product Right Top Section............",
  }
);
const ProductTopSecton = dynamic(() => import("./ProductTopSecton"), {
  ssr: false,
  loading: () => "Product Top Sectoin............",
});
const TaxDiscountSectoin = dynamic(() => import("./TaxDiscountSectoin"), {
  ssr: false,
  loading: () => "TaxDiscount Sectoin............",
});

const WithOutVariant = dynamic(() => import("./WithOutVariant"), {
  ssr: false,
  loading: () => "With Out Variant............",
});
const ImageUpload = dynamic(() => import("./ImageUpload"), {
  ssr: false,
  loading: () => "Image Upload............",
});

const ProductVariant = dynamic(() => import("./ProductVariant"), {
  ssr: false,
  loading: () => "new product ProductVariant............",
});

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

  // hook
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  // const params = useParams<{ new: string }>();
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

        // Populate variant data if no variant is selected
        if (!productData.variant && productData.productVariants?.length) {
          const [firstVariant] = productData.productVariants;
          Object.assign(productData, {
            purchasePrice: +firstVariant.purchasePrice,
            unitPrice: +firstVariant.unitPrice,
            stockQty: firstVariant.stockQty,
            variantId: firstVariant.id,
          });
        }

        // Map categories
        const productCategories = productData.productCategories?.map(
          (category: any) => category.categoryId
        );

        // Handle images, thumbnails, and hover images
        productData.fileList =
          productData.images?.map((image: string, idx: number) =>
            generateFile(image, idx)
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

        // Update form and state
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
    //  finally {
    //   dispatch(setLoading({}));
    // }
  }, [form, productId]);

  useEffect(() => {
    // dispatch(setLoading({ loading: true }));
    // Call the async function
    fetchData();
    // Cleanup function
    return () => {
      if (!productId) {
        form.resetFields();
        setTags([]);
      }
    };
  }, []);

  const handleSubmit = async () => {
    const newData = await form.validateFields();

    // console.log("newData", newData);

    // return
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

    // return console.log("ee", newData);

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


  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-global-primary-fontfamily">
              {product?.id ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-gray-500 mt-1">Manage your product details, pricing, and media.</p>
          </div>
          <div className="flex gap-3">
            <Button
              size="large"
              onClick={() => resetFormData(product)}
              className="!rounded-lg !border-gray-300 !text-gray-600 hover:!text-gray-900 hover:!border-gray-400"
            >
              Reset Changes
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={handleSubmit}
              loading={global.loading.save}
              disabled={global.loading.save}
              className="!border-none !px-8 !font-medium"
              style={{ borderRadius: "var(--button-border-radius)" }}
            >
              {product?.id ? "Update Product" : "Save Product"}
            </Button>
          </div>
        </div>

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
          className="space-y-8"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="variantId" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-8">
              {/* Basic Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Basic Information</h2>
                <ProductTopSecton form={form} />
              </div>

              {/* Pricing & Tax Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Pricing & Tax</h2>
                <TaxDiscountSectoin discounts={discounts} taxs={taxs} />
              </div>

              {/* Inventory Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Inventory</h2>
                <WithOutVariant form={form} />
              </div>

              {/* Variants Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Product Variants</h2>
                <ProductVariant
                  formValues={formValues}
                  form={form}
                  sizes={sizes}
                  colors={colors}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Organization Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Organization</h2>
                <ProductRightTopSection
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  brands={brands}
                  categories={categories}
                  units={units}
                  tags={tags}
                  setTags={setTags}
                />
              </div>

              {/* Media Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Media</h2>
                <ImageUpload
                  formValues={formValues}
                  form={form}
                  setFormValues={setFormValues}
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;
