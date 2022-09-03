import { supabase } from "./supabaseClient";
import faker from "@faker-js/faker";
import { uniqBy } from "lodash";
import { PostgrestError } from "@supabase/supabase-js";
import { BucketsConstants, TableConstants } from "./TableConstants";

const CATEGORIES_TO_GENERATE = 10;
const PRODUCT_TYPES_TO_GENERATE = 30;
const PRODUCTS_TO_GENERATE = 50;

const cleanDatabase = async () => {
  console.log("cleaning database...");
  await supabase.from(TableConstants.validatedOrder).delete().neq("id", 0);
  await supabase.from(TableConstants.products).delete().neq("id", 0);
  await supabase.from(TableConstants.productType).delete().neq("id", 0);
  await supabase.from(TableConstants.productCategory).delete().neq("id", 0);
};

const handleError = (error: PostgrestError | null) => {
  if (error) {
    console.info(error.message);
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
    .from(TableConstants.productCategory)
    .insert(uniqBy(categories, "name"));

  handleError(error);

  createdCategoryIds.push(...(data || []).map((x) => x.id));
  return { createdCategoryIds };
};

const generateProductTypes = async (createdCategoryIds: string[]) => {
  const createdProductTypeIds: string[] = [];
  const productTypes = [];
  for (let i = 0; i < PRODUCT_TYPES_TO_GENERATE; i++) {
    productTypes.push({
      name: faker.commerce.productName(),
      categoryId:
        createdCategoryIds[
          Math.floor(Math.random() * createdCategoryIds.length)
        ],
    });
  }
  const { data, error } = await supabase
    .from(TableConstants.productType)
    .insert(uniqBy(productTypes, "name"));
  handleError(error);
  createdProductTypeIds.push(...(data || []).map((x) => x.id));

  return { createdCategoryIds, createdProductTypeIds };
};

const generateProducts = async (createdProductTypeIds: string[]) => {
  const products = [];
  for (let i = 0; i < PRODUCTS_TO_GENERATE; i++) {
    products.push({
      productTypeId:
        createdProductTypeIds[
          Math.floor(Math.random() * createdProductTypeIds.length)
        ],
      size: `${faker.datatype.number({
        min: 1,
        max: 1000,
        precision: 1,
      })} x ${faker.datatype.number({ min: 1, max: 1000, precision: 1 })} `,
      stock: faker.datatype.number({ min: 0, max: 4, precision: 1 }),
      price: faker.datatype.number({ min: 1, max: 90, precision: 0.01 }),
    });
  }
  const { error } = await supabase
    .from(TableConstants.products)
    .insert(products);
  handleError(error);
  console.info(`Faux items insérés en base : ${PRODUCTS_TO_GENERATE} ✅`);
  return { createdProductTypeIds };
};

export const insertFixtures = async () => {
  try {
    await cleanDatabase();
    console.info("Database vidée ✅");
    console.info(`Création des catégories : ${CATEGORIES_TO_GENERATE}`);
    const { createdCategoryIds } = await generateCategories();
    console.info(
      `Fausses categories insérées en base : ${CATEGORIES_TO_GENERATE} ✅`
    );
    console.info(`Création des produits types : ${PRODUCT_TYPES_TO_GENERATE}`);
    const { createdProductTypeIds } = await generateProductTypes(
      createdCategoryIds
    );
    console.info(
      `Faux produits types insérés en base : ${PRODUCT_TYPES_TO_GENERATE} ✅`
    );
    console.info(`Création des produits : ${PRODUCT_TYPES_TO_GENERATE}`);

    await generateProducts(createdProductTypeIds);
    console.info(`Faux produits insérés en base : ${PRODUCTS_TO_GENERATE} ✅`);

    console.info("Fixtures appliquées ✅");
  } catch (error: any) {
    console.error("error while inserting fixtures", error?.message);
  }
};
