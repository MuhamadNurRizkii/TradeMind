import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import TradeJournal from "./TradeJournal";

async function page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <TradeJournal userId={user.id} />;
}

export default page;
