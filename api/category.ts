import { Category } from "../types";
import { supabase } from "../utils/supabaseClient";

export type CreateCategoryDTO = {
  categoryName: Category["name"];
};

/**
 * Creates the category or updates it if it already exists
 */
export const upsertCategory = async (createCategoryData: CreateCategoryDTO) => {
  const { data, error } = await supabase.from("productCategory").upsert(
    { name: createCategoryData.categoryName },
    {
      onConflict: "name",
    }
  );
  return {
    data,
    error,
  };
};
