import { ProductType } from "../../types";

export type FormattedProduct = ProductType & {
  categoryName: string;
};

export type OnRowInsertingEvent = {
  data: {
    categoryName: ProductType["productCategory"]["name"];
    name: ProductType["name"];
  };
};
export type OnRowDeletingEvent = {
  data: {
    id: ProductType["id"];
  };
};
