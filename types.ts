export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  productTypeId: ProductType["id"];
  size: string;
  price: number;
  inStock: boolean;
};

export type ProductType = {
  id: number;
  name: string;
  productCategory: Category;
  createdAt: Date;
  products: Product[];
};

export type ProductWithTypeData = Product & {
  productType: Pick<ProductType, "id" | "name">;
};

export type ProductWithTypeAndQuantity = ProductWithTypeData & {
  quantity: number;
};
