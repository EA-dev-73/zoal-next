import { useEffect, useState } from "react";
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

export const fetchCategories = async (): Promise<Category[] | null> => {
  const { data: categories, error } = await supabase
    .from(TableConstants.productCategory)
    .select(`*`);
  error && handlePostgresError(error);
  return categories;
};

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    try {
      fetchCategories().then((res) => {
        setCategories(res);
        setIsLoading(false);
        setError(null);
      });
    } catch (error: any) {
      setError(error);
    }
  }, []);

  return {
    isLoading,
    categories,
    error,
  };
};
