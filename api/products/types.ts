import { Category, Product, ProductType } from "../../types";

export type CreateProductTypeDTO = {
  name: ProductType["name"];
  categoryId: Category["id"];
};
export type UpdateCategoryAndProductTypeDTO = Partial<{
  id: ProductType["id"];
  categoryId: Category["id"];
  categoryName: ProductType["productCategory"]["name"];
  name: ProductType["name"];
  imagesUrl: string;
}>;

export type CreateProductTypeImagesDTO = {};

export type DeleteProductDTO = {
  productId: Product["id"];
};

export type UpsertProductDTO = {
  productId?: Product["id"];
  size?: Product["size"];
  price?: Product["price"];
  stock?: Product["stock"];
  shippingFees?: Product["shippingFees"];
  productTypeId?: ProductType["id"];
};
