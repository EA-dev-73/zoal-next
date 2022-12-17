export const TableConstants = {
  products: "products",
  productType: "productType",
  productCategory: "productCategory",
  validatedOrder: "validatedOrder",
};

export const BucketsConstants = {
  products:
    process.env.NODE_ENV === "production" ? "products-prod" : "products",
};
