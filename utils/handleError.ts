import { PostgrestError } from "@supabase/supabase-js";

export const handlePostgresError = (error: PostgrestError) => {
  console.error(error.message);
  throw error;
};
