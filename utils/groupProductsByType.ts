import { groupBy } from "lodash";

export const groupProductsByType = <T>(products: T[]) =>
  groupBy(products, "productTypeId");
