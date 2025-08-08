/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import appConfig from "@/appConfig";
import {
  getProduct,
  saveProduct,
  updateProduct,
} from "@/lib/apis/admin/product";
import { ProductType } from "@/lib/types/product";
import { handleAsyncAction } from "@/lib/utils/commonFunctions";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { Button, Divider, Form, Input } from "antd";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams<{ new: string }>();
  const route = useRouter();

  const fetchData = useCallback(async () => {
    const generateFile = (fileName: string, identifier: string | number) => ({
      uid: `${Math.random() * 1000}`,
      name: `photo ${identifier}`,
      status: "done",
      fileName,
      url: `${appConfig.baseApiUrl}/uploads/${fileName || "no-data.png"}`,
    });

    try {
      if (params.new === "new") {
        form.resetFields();
        setTags([]);
        return;
      }

      if (params.new !== "new") {
        const id = params.new.toString();
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
  }, [form, params.new]);

  useEffect(() => {
    // dispatch(setLoading({ loading: true }));
    // Call the async function
    fetchData();
    // Cleanup function
    return () => {
      if (params.new === "new") {
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
        url: `${appConfig.baseApiUrl}/uploads/${item || "no-data.png"}`,
      }));
      newData.fileList = file;
    }

    if (newData.thumbnailImage) {
      const newfileThumbnail = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.thumbnailImage,
        url: `${appConfig.baseApiUrl}/uploads/${newData.thumbnailImage || "no-data.png"
          }`,
      };
      newData.fileThumbnailList = [newfileThumbnail];
    }

    if (newData.hoverImage) {
      const newfileHover = {
        uid: Math.random() * 1000 + "",
        name: `photo ${Math.random() * 10000 + ""}`,
        status: "done",
        fileName: newData.hoverImage,
        url: `${appConfig.baseApiUrl}/uploads/${newData.hoverImage || "no-data.png"
          }`,
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

  // const customUploadRequest = async (options: any) => {
  //   const { filename, file, onSuccess, onError } = options;
  //   const formData = new FormData();
  //   formData.append(filename, file);

  //   try {
  //     const res = await uploadFile(formData);

  //     if (!res || !res.data) {
  //       errorNotification({ message: res.message });
  //     }

  //     const newfile = res.data.map((item: { filename: string }) => ({
  //       uid: Math.random() * 1000 + "",
  //       name: `photo ${Math.random() * 10000 + ""}`,
  //       status: "done",
  //       fileName: item.filename,
  //       url: `${appConfig.baseApiUrl}/uploads/${item.filename}`,
  //     }));

  //     const newFileName = res.data.length ? res.data[0].filename : null;
  //     // Assuming you're updating form data here:
  //     if (filename === "images") {
  //       form.setFieldsValue({
  //         ...form.getFieldsValue(),
  //         fileList: [...form.getFieldsValue().fileList, ...newfile],
  //         images: [...form.getFieldsValue().images, newFileName],
  //       });
  //       setFormValues({
  //         ...formValues,
  //         fileList: [...formValues.fileList, ...newfile],
  //         images: [...formValues.images, newFileName],
  //       });
  //     }

  //     if (filename === "thumbnailImage") {
  //       form.setFieldsValue({
  //         ...form.getFieldsValue(),
  //         fileThumbnailList: newfile,
  //         thumbnailImage: newFileName,
  //       });
  //       setFormValues({
  //         ...formValues,
  //         fileThumbnailList: newfile,
  //         thumbnailImage: newFileName,
  //       });
  //     }

  //     if (filename === "hoverImage") {
  //       form.setFieldsValue({
  //         ...form.getFieldsValue(),
  //         fileHoverList: newfile,
  //         hoverImage: newFileName,
  //       });
  //       setFormValues({
  //         ...formValues,
  //         fileHoverList: newfile,
  //         hoverImage: newFileName,
  //       });
  //     }

  //     onSuccess("Ok");
  //   } catch (err) {
  //     console.error("🚀 ~ Upload error:", err);
  //     onError({ err });
  //   }
  // };

  // this function for tag

  return (
    <>
      <Divider orientation="left">Create New Product</Divider>
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
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="variantId" hidden>
          <Input />
        </Form.Item>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="col-span-2">
            <ProductTopSecton form={form} />
            <TaxDiscountSectoin discounts={discounts} taxs={taxs} />
            <WithOutVariant form={form} />
          </div>

          <div className="col-span-1">
            <ProductRightTopSection
              inputValue={inputValue}
              setInputValue={setInputValue}
              brands={brands}
              categories={categories}
              units={units}
              tags={tags}
              setTags={setTags}
            />
            {/* image upload section */}
            <ImageUpload
              formValues={formValues}
              form={form}
              setFormValues={setFormValues}
            />
          </div>
        </div>

        <ProductVariant
          formValues={formValues}
          form={form}
          sizes={sizes}
          colors={colors}
        />

        <div className="flex gap-2 justify-end">
          <Button size="small" onClick={() => resetFormData(product)}>
            Reset
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={handleSubmit}
            loading={global.loading.save}
            disabled={global.loading.save}
          >
            {product?.id ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddProduct;
