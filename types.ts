export type Product = {
  id: number;
  name: string;
  productCategory: Category[];
};

export type Category = {
  id: number;
  name: string;
};
