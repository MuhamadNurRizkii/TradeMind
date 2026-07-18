"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileData = {
  full_name: string;
  initial_balance: number;
};

export const getProfile = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User belum login");

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, initial_balance")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found (profil belum dibuat)
    throw new Error(error.message);
  }

  return {
    user,
    profile: data ?? {
      full_name: user.user_metadata?.full_name ?? "",
      initial_balance: 0,
    },
  };
};

export const upsertProfile = async (profile: ProfileData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User belum login");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: profile.full_name,
    initial_balance: profile.initial_balance,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/profile");
};
