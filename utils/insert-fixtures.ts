import { supabase } from "./supabaseClient";
import faker from "@faker-js/faker";
import { uniqBy } from "lodash";
import { PostgrestError } from "@supabase/supabase-js";

const CATEGORIES_TO_GENERATE = 50;
const PRODUCTS_TO_GENERATE = 50;
const PRODUCT_ITEMS_TO_GENERATE = 500;

const cleanDatabase = async () => {
  await supabase.from("product").delete().neq("id", 9999);
  await supabase.from("productCategory").delete().neq("id", 9999);
  await supabase.from("productItems").delete().neq("id", 9999);
};

const handleError = (error: PostgrestError | null) => {
  if (error) {
    console.log(error.message);
    throw error;
  }
};

const generateCategories = async () => {
  const createdCategoryIds: string[] = [];
  const categories = [];
  for (let i = 0; i < CATEGORIES_TO_GENERATE; i++) {
    categories.push({
      name: faker.commerce.department(),
    });
  }
  const { data, error } = await supabase
    .from("productCategory")
    .insert(uniqBy(categories, "name"));

  handleError(error);

  createdCategoryIds.push(...(data || []).map((x) => x.id));
  console.log(
    `Fausses categories insérées en base : ${CATEGORIES_TO_GENERATE} ✅`
  );
  return { createdCategoryIds };
};

const generateProducts = async (createdCategoryIds: string[]) => {
  const createdProductTypeIds: string[] = [];
  const products = [];
  for (let i = 0; i < PRODUCTS_TO_GENERATE; i++) {
    products.push({
      name: faker.commerce.productName(),
      categoryId:
        createdCategoryIds[
          Math.floor(Math.random() * createdCategoryIds.length)
        ],
    });
  }
  const { data, error } = await supabase
    .from("product")
    .insert(uniqBy(products, "name"));
  handleError(error);
  createdProductTypeIds.push(...(data || []).map((x) => x.id));
  console.log(`Faux produits insérés en base : ${PRODUCTS_TO_GENERATE} ✅`);
  return { createdCategoryIds, createdProductTypeIds };
};

const generateProductItems = async (createdproductTypeIds: string[]) => {
  const productItems = [];
  for (let i = 0; i < PRODUCT_ITEMS_TO_GENERATE; i++) {
    productItems.push({
      productTypeId:
        createdproductTypeIds[
          Math.floor(Math.random() * createdproductTypeIds.length)
        ],
      size: `${faker.datatype.number({
        min: 1,
        max: 1000,
        precision: 1,
      })} x ${faker.datatype.number({ min: 1, max: 1000, precision: 1 })} `,
      inStock: faker.datatype.boolean(),
      price: faker.datatype.number({ min: 1, max: 1000, precision: 0.01 }),
    });
  }
  const { error } = await supabase.from("productItems").insert(productItems);
  handleError(error);
  console.log(`Faux items insérés en base : ${PRODUCT_ITEMS_TO_GENERATE} ✅`);
  return { createdproductTypeIds };
};

export const insertFixtures = async () => {
  await cleanDatabase();
  console.log("Database vidée ✅");
  const { createdCategoryIds } = await generateCategories();
  const { createdProductTypeIds } = await generateProducts(createdCategoryIds);
  await generateProductItems(createdProductTypeIds);
  console.log("Fixtures appliquées ✅");
};
