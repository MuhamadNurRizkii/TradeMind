"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoveDown, MoveUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import FilterBar from "./FilterBar";
import TradeTable from "./TradeTable";

type Trade = {
  id: number;
  trade_date: string;
  pair: string;
  position: "Long" | "Short";
  margin: number;
  strategy: string;
  result: "Win" | "Lose";
  profit_loss: number;
  created_at: string;
};

function TradeJournal({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<string | null>("All");
  const [status, setStatus] = useState<string | null>("All");
  const [period, setPeriod] = useState<string | null>("All");
  const [refresh, setRefresh] = useState<boolean | null>(false);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  const totalTrades = trades.length;

  const totalWin = trades.filter((trade) => trade.result === "Win").length;

  const winRate = totalWin === 0 ? 0 : (totalWin / totalTrades) * 100;

  const netPL = trades.reduce(
    (sum, trade) =>
      trade.result === "Win"
        ? sum + trade.profit_loss
        : sum - trade.profit_loss,
    0,
  );

  const fetchTrades = async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: true })
      .eq("user_id", userId);

    if (search) {
      query = query.ilike("pair", `%${search}%`);
    }

    if (position !== "All") {
      query = query.eq("position", position);
    }

    if (status !== "All") {
      query = query.eq("result", status);
    }

    if (period !== "All") {
      const fromDate = new Date();

      fromDate.setDate(fromDate.getDate() - Number(period));

      query = query.gte("trade_date", fromDate.toISOString());
    }

    const { data } = await query;

    setTrades(data ?? []);

    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, [search, position, status, period, refresh]);

  console.log(trades);

  //   const trades = [
  //     {
  //       id: 1,
  //       date: "2026-07-15",
  //       pair: "BTCUSDT",
  //       position: "Long",
  //       margin: 1000,
  //       strategy: "SNR",
  //       result: "Win",
  //       profit_loss: 100,
  //     },
  //     {
  //       id: 2,
  //       date: "2026-07-15",
  //       pair: "XRPUSDT",
  //       position: "Short",
  //       margin: 1000,
  //       strategy: "SNR",
  //       result: "Lose",
  //       profit_loss: 50,
  //     },
  //     {
  //       id: 3,
  //       date: "2026-07-15",
  //       pair: "BTCUSDT",
  //       position: "Long",
  //       margin: 1000,
  //       strategy: "SNR",
  //       result: "Win",
  //       profit_loss: 100,
  //     },
  //   ];
  return (
    <section>
      {/* deskripsi */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 md:p-4">
        <div>
          <h1 className="font-bold text-lg">Jurnal Trading</h1>
          <p className="text-sm text-gray-600">
            Catat, pantau, dan evaluasi setiap trading Anda.
          </p>
        </div>
        <div className="grid grid-cols-3 p-3 gap-2 border rounded-sm text-center">
          <div>
            <h2 className="text-xs font-bold text-gray-500">Total</h2>
            <p className="font-bold text-sm">{totalTrades}</p>
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-500">Win Rate</h2>
            <p className="font-bold text-sm text-green-600">{winRate.toFixed(1)}%</p>
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-500">Net P/L</h2>
            <p className={`font-bold text-sm ${netPL >= 0 ? "text-green-600" : "text-red-500"}`}>
              {netPL >= 0 ? "+" : ""}${netPL.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      {/* search & filter */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        position={position}
        setPosition={setPosition}
        status={status}
        setStatus={setStatus}
        period={period}
        setPeriod={setPeriod}
      />
      {/* table data */}
      <TradeTable trades={trades} refresh={refresh} setRefresh={setRefresh} />
    </section>
  );
}

export default TradeJournal;
