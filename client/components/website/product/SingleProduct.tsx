"use client";
import { getProductBySlug } from "@/lib/apis/product";
import { errorNotification } from "@/lib/utils/notification";
import { setLoading } from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProduct,
} from "@/redux/features/products/productSlice";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReviewTable = dynamic(() => import("./review-rating/ReviewTable"), {
  ssr: false,
});
const ProductCard = dynamic(() => import("./ProductCard"), { ssr: false });
const RatingProduct = dynamic(() => import("./RatingProducts"), { ssr: false });
const ProductDescription = dynamic(() => import("./ProductDescription"), {
  ssr: false,
});
const ProductDetails = dynamic(() => import("./ProductDetails"), {
  ssr: false,
});

export default function SingleProduct({ slug }: { slug: string }) {
  const [selectVariant, setSelectVariant] = useState<any>({});
  // const { slug } = useParams();
  const [checkStock, setCheckStock] = useState(0);
  const dispatch = useDispatch();
  const products = useSelector(selectProduct);
  const { product } = products;

  // #ToDo here need to optimize this code and need to check single product system

  const fetchProductData = useCallback(async () => {
    dispatch(setLoading({ loading: true }));

    try {
      const newProduct = await getProductBySlug({
        slug: slug?.toString(),
        productVariantId: selectVariant.productVariantId,
      });
      const { productVariants, variant } = newProduct.data;

      if (newProduct?.success) {
        const findVariantProduct = productVariants.find(
          (item: { default: boolean }) => item.default
        );

        const defaultProduct = variant
          ? findVariantProduct
          : productVariants[0];

        dispatch(
          setProduct({
            ...newProduct.data,
            qty: 1,
            defaultProduct,
          })
        );

        setCheckStock(defaultProduct?.stockQty || 0);
      }
    } catch (error: any) {
      errorNotification({ message: error.message });
    } finally {
      dispatch(setLoading({ loading: false }));
    }
  }, [dispatch, slug, selectVariant]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const productRating = product?.reviews?.reduce(
    (
      pre: {
        totalReview: number;
        rating1: number;
        rating2: number;
        rating3: number;
        rating4: number;
        rating5: number;
      },
      curr: { rating: string }
    ) => {
      return {
        totalReview: +pre.totalReview + +curr.rating,
        rating1: +curr.rating === 1 ? +pre.rating1 + 1 : pre.rating1,
        rating2: +curr.rating === 2 ? +pre.rating2 + 1 : pre.rating2,
        rating3: +curr.rating === 3 ? +pre.rating3 + 1 : pre.rating3,
        rating4: +curr.rating === 4 ? +pre.rating4 + 1 : pre.rating4,
        rating5: +curr.rating === 5 ? +pre.rating5 + 1 : pre.rating5,
      };
    },
    {
      totalReview: 0,
      rating1: 0,
      rating2: 0,
      rating3: 0,
      rating4: 0,
      rating5: 0,
    }
  );

  // if (global.loading.loading) {
  //   return (
  //     <div className="text-center">
  //       <Spin />
  //     </div>
  //   );
  // }

  // const productSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "Product",
  //   name: name || "Default Product Name",
  //   image: imageUrls?.length ? imageUrls : ["/logo.png"],
  //   description: meta_description || "Default product description",
  //   category: category?.name || "Default Category",
  //   color: colors || "Black",
  //   brand: {
  //     "@type": "Brand",
  //     name: brand?.name || "Default Brand",
  //     url: `${appConfig.url}/brand/${brand?.slug}` || "",
  //   },
  //   offers: {
  //     "@type": "Offer",
  //     priceCurrency: "USD",
  //     price: unit_price || "0.00",
  //     url: `${appConfig.url}/product/${slug}`,
  //     availability: "https://schema.org/InStock",
  //   },
  //   aggregateRating: {
  //     "@type": "AggregateRating",
  //     ratingValue: rating || "0",
  //     reviewCount: reviews?.length || "0",
  //   },
  //   review: reviewsSchema,
  // };

  const newPath = [
    { title: "Home", url: "/" },
    // {
    //   title: category?.name,
    //   url: `/category/${category?.slug}`,
    // },
    // {
    //   title: name,
    //   url: `/product/${slug}`,
    // },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-white min-h-screen">
      {/* Main Product Hero Section */}
      <div className="mb-16 lg:mb-24">
        <ProductDetails
          setSelectVariant={setSelectVariant}
          productRating={productRating}
          checkStock={checkStock}
          setCheckStock={setCheckStock}
        />
      </div>

      {/* Product Description & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 lg:mb-24">
        <div className="lg:col-span-8 space-y-12">
          <ProductDescription />
          <div id="reviews" className="scroll-mt-24">
            {product.reviews && <RatingProduct productRating={productRating} />}
            <ReviewTable />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="border-t border-gray-100 pt-16">
        <h3 className="text-2xl lg:text-3xl font-bold mb-8 font-global-primary-fontfamily text-gray-900">
          You Might Also Like
        </h3>
        <ProductCard />
      </section>
    </div>
  );
}
