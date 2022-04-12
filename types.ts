import { CreateCategoryDTO } from "./api/category";
import {
  CreateProductTypeDTO,
  CreateProductTypeImagesDTO,
} from "./api/products/types";

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
  productTypeImage: ProductTypeImage[];
  createdAt: Date;
  products: Product[];
};

export type ProductWithTypeData = Product & {
  productType: Pick<ProductType, "id" | "name">;
};

export type ProductWithTypeAndQuantity = ProductWithTypeData & {
  quantity: number;
};

export type ProductTypeImage = {
  id: number;
  imageUrl: string;
};

export type CreateProductTypeWithCategoryAndImagesParams = {
  createCategoryData: CreateCategoryDTO;
  createProductTypeData: Omit<CreateProductTypeDTO, "categoryId">;
  createProductTypeImages: CreateProductTypeImagesDTO;
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
