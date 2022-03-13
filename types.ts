export type Product = {
  id: number;
  name: string;
  productCategory: Category;
  price: number;
  inStock: boolean;
};

export type Category = {
  id: number;
  name: string;
};
