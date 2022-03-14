import { supabase } from "./supabaseClient";
import faker from "@faker-js/faker";

const cleanDatabase = async () => {
  await supabase.from("product").delete().neq("id", 9999);
  await supabase.from("productCategory").delete().neq("id", 9999);
  await supabase.from("productItems").delete().neq("id", 9999);
};

export const insertFixtures = async () => {
  await cleanDatabase();
  console.log("Database vidée ✅");
  const productsToCreate = 1000;
  let createdCategoryIds = [];
  let createdProductIds = [];
  for (let i = 0; i < productsToCreate; i++) {
    //création d'une catégorie
    const { data: category } = await supabase
      .from("productCategory")
      .insert([{ name: faker.commerce.department() }]);
    createdCategoryIds.push(category?.[0]?.id);
    //création d'un produit
    const { data: product } = await supabase.from("product").insert([
      {
        name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
        categoryId:
          createdCategoryIds[
            Math.floor(Math.random() * createdCategoryIds.length)
          ],
      },
    ]);
    createdProductIds.push(product?.[0]?.id);
    //création d'un produitItem
    await supabase.from("productItems").insert([
      {
        productId:
          createdProductIds[
            Math.floor(Math.random() * createdProductIds.length)
          ],
        size: faker.random.arrayElement(["XS", "S", "M", "L", "XL", "XXL"]),
        inStock: faker.datatype.boolean(),
        price: faker.commerce.price(1, 1000),
      },
    ]);
  }

  console.log("Fixtures appliquées ✅");
};
