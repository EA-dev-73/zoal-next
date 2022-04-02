import { Category, ProductType, ProductTypeImage } from "../../types";

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

export type CreateProductTypeImagesDTO = {
  imagesUrl: ProductTypeImage["imageUrl"][];
};
