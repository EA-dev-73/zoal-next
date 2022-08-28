import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reactQueryKeys } from "../react-query-keys";
import { Category, UpdateEntityNameDTO } from "../types";
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

export const useCategories = () =>
  useQuery([reactQueryKeys.categories], fetchCategories);

type UpdateCategoryNameDTO = UpdateEntityNameDTO<Category>;
export const useUpdateCategoryName = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ name, id }: UpdateCategoryNameDTO) => {
      await supabase
        .from(TableConstants.productCategory)
        .update({ name })
        .match({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );
};
