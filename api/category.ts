import { useQuery } from "react-query";
import { Category } from "../types";
import { handlePostgresError } from "../utils/handleError";
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

const fetchCategories = async (): Promise<Category[] | null> => {
  const { data: categories, error } = await supabase
    .from(TableConstants.productCategory)
    .select(`*`);
  error && handlePostgresError(error);
  return categories;
};

export const useCategories = () => useQuery("categories", fetchCategories);
