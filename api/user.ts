import { supabase } from "../utils/supabaseClient";

type Props = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: Props) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });

  return { user, error };
};
