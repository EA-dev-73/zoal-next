export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  productTypeId: ProductType["id"];
  size: string;
  price: number;
  stock: number;
  shippingFees: number;
};

export type ProductType = {
  id: number;
  name: string;
  productCategory: Category;
  createdAt: Date;
  products: Product[];
};

export type ProductTypeWithImages = ProductType & {
  imagesUrls?: string[];
};

export type ProductWithTypeData = Product & {
  productType: Pick<ProductType, "id" | "name">;
};

export type ProductWithTypeAndCategory = Pick<ProductType, "id" | "name"> & {
  productCategory: Category;
} & { products: Product[] };

export type ProductWithTypeAndQuantity = ProductWithTypeData & {
  quantity: number;
};

export type ValidatedOrder = {
  id: number;
  stripeOrderId: string;
  orderContent: string;
  hasBeenSent: boolean;
  stripePaymentUrl: string;
  shippingAddress: string;
  isArchived: boolean;
  created_at: Date;
};

export type UpdateEntityNameDTO<T extends ProductType | Category> = {
  id: T["id"];
  name: T["name"];
};

export type UploadProductImagesToBucketDTO = {
  productTypeId: ProductType["id"];
  image: File;
}[];

export type DeleteProductImageFromBucketDTO = {
  productTypeId: ProductType["id"];
  imageName: string;
};

export type ProductForAdminTable = ProductTypeWithImages & {
  categoryName: string;
};
