import { Category, ProductTypeImage, ProductType } from "../../types";

export type FormattedProduct = ProductType & {
  categoryName: string;
  imagesUrl: ProductTypeImage["imageUrl"][];
};

export type OnRowInsertingEvent = {
  data: {
    categoryName: ProductType["productCategory"]["name"];
    name: ProductType["name"];
    imagesUrl: ProductTypeImage["imageUrl"][];
  };
};
export type OnRowDeletingEvent = {
  data: {
    id: ProductType["id"];
  };
};
export type OnRowEditingEvent = {
  newData?: {
    categoryName?: ProductType["productCategory"]["name"];
    name?: ProductType["name"];
    imagesUrl?: string;
  };
  oldData?: {
    id?: ProductType["id"];
    productCategory?: {
      id: Category["id"];
    };
  };
};
