"use server";

import { Trade } from "@/types/trades";
import { createClient } from "@/utils/supabase/server";
import { refresh } from "next/cache";

export const createTrade = async (trade: Trade) => {
  const supabase = await createClient();
  // ambil user_id
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User belum login");
  }

  //   menambahkan data
  const { data, error } = await supabase
    .from("trades")
    .insert({
      user_id: user?.id,
      trade_date: trade.date,
      pair: trade.pair,
      position: trade.position,
      margin: trade.margin,
      strategy: trade.strategy,
      result: trade.result,
      profit_loss: trade.profitLoss,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateTrade = async (id: number, trade: Trade) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trades")
    .update({
      trade_date: trade.date,
      pair: trade.pair,
      position: trade.position,
      margin: trade.margin,
      strategy: trade.strategy,
      result: trade.result,
      profit_loss: trade.profitLoss,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteTrade = async (id: number) => {
  const supabase = await createClient();

  const { error } = await supabase.from("trades").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  refresh();
};
