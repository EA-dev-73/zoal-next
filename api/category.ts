import { Category } from "../types";
import { supabase } from "../utils/supabaseClient";
import { TableConstants } from "../utils/TableConstants";

export type CreateCategoryDTO = {
  categoryName: Category["name"];
};

/**
 * Creates the category or updates it if it already exists
 */
export const upsertCategory = async (createCategoryData: CreateCategoryDTO) => {
  const { data, error } = await supabase
    .from(TableConstants.productCategory)
    .upsert(
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
