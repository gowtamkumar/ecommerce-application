const ProductDescription= ({ product }: any) => {
  return (
    <div className="text-start">
      <h3 className="text-lg font-bold mb-4">Description</h3>
      <div className="md:flex gap-16 bg-white p-4 items-center">
        <div
          className="text-gray-700 mb-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: product.description,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDescription;
