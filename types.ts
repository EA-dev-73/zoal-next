export type Product = {
  id: number;
  name: string;
  productCategory: Category;
  createdAt: Date;
  productItems: ProductItem[];
};

export type Category = {
  id: number;
  name: string;
};

export type ProductItem = {
  id: number;
  productId: Product["id"];
  size: string;
  price: number;
  inStock: boolean;
};

export type CartItem = ProductItem &
  Pick<Product, "name" | "productCategory"> & {
    quantity: number;
  };
