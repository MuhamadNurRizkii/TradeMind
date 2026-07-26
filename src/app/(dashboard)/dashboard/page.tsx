import React from "react";
import { createClient } from "@/utils/supabase/server";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BookOpen,
  Plus,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import PnlCalendar from "@/components/PnlCalendar";

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

async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trades } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const { data: profileData } = await supabase
    .from("profiles")
    .select("initial_balance")
    .eq("id", user?.id)
    .single();

  console.log(trades);

  const initialBalance: number = profileData?.initial_balance ?? 0;

  const allTrades: Trade[] = trades ?? [];

  // --- Kalkulasi statistik ---
  const totalTrades = allTrades.length;
  const totalWin = allTrades.filter((t) => t.result === "Win").length;
  const totalLose = allTrades.filter((t) => t.result === "Lose").length;
  const winRate =
    totalTrades === 0 ? 0 : ((totalWin / totalTrades) * 100).toFixed(1);

  const netPL = allTrades.reduce(
    (sum, t) =>
      t.result === "Win" ? sum + t.profit_loss : sum - t.profit_loss,
    0,
  );

  const totalBalance = initialBalance + netPL;

  const totalMargin = allTrades.reduce((sum, t) => sum + t.margin, 0);
  const roi = totalMargin === 0 ? 0 : ((netPL / totalMargin) * 100).toFixed(1);

  // Streak saat ini (Win/Lose berturut-turut dari trade terbaru)
  let streak = 0;
  let streakType: "Win" | "Lose" | null = null;
  for (const t of allTrades) {
    if (streakType === null) {
      streakType = t.result;
      streak = 1;
    } else if (t.result === streakType) {
      streak++;
    } else {
      break;
    }
  }

  // 5 aktivitas terbaru
  const recentTrades = allTrades.slice(0, 5);

  // Pair terbanyak diperdagangkan
  const pairCount: Record<string, number> = {};
  allTrades.forEach((t) => {
    pairCount[t.pair] = (pairCount[t.pair] ?? 0) + 1;
  });
  const topPairs = Object.entries(pairCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Bulan ini
  const now = new Date();
  const thisMonth = allTrades.filter((t) => {
    const d = new Date(t.trade_date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const monthlyPL = thisMonth.reduce(
    (sum, t) =>
      t.result === "Win" ? sum + t.profit_loss : sum - t.profit_loss,
    0,
  );

  const statCards = [
    {
      label: "Total Balance",
      value: `$${totalBalance.toFixed(2)}`,
      sub:
        initialBalance > 0
          ? `Modal awal $${initialBalance.toFixed(2)}`
          : "Atur modal awal di profil",
      icon: <Wallet className="w-5 h-5" />,
      color:
        totalBalance >= initialBalance
          ? "bg-blue-600 text-white"
          : "bg-red-600 text-white",
      iconBg: totalBalance >= initialBalance ? "bg-blue-500" : "bg-red-500",
    },
    {
      label: "Total Trades",
      value: totalTrades,
      sub: null,
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      sub: null,
      icon: <Target className="w-5 h-5" />,
      color: "bg-green-50 text-green-700",
      iconBg: "bg-green-100",
    },
    {
      label: "Net P/L",
      value: `${netPL >= 0 ? "+" : ""}$${netPL.toFixed(2)}`,
      sub: null,
      icon:
        netPL >= 0 ? (
          <TrendingUp className="w-5 h-5" />
        ) : (
          <TrendingDown className="w-5 h-5" />
        ),
      color:
        netPL >= 0
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700",
      iconBg: netPL >= 0 ? "bg-emerald-100" : "bg-red-100",
    },
    {
      label: "P/L Bulan Ini",
      value: `${monthlyPL >= 0 ? "+" : ""}$${monthlyPL.toFixed(2)}`,
      sub: null,
      icon: <Activity className="w-5 h-5" />,
      color:
        monthlyPL >= 0
          ? "bg-violet-50 text-violet-700"
          : "bg-orange-50 text-orange-700",
      iconBg: monthlyPL >= 0 ? "bg-violet-100" : "bg-orange-100",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Ringkasan performa dan aktivitas trading Anda
          </p>
        </div>
        <Link
          href="/dashboard/add"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Trade
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, i) => (
          <Card
            key={i}
            className={`border-0 shadow-sm ${
              i === 0 ? "col-span-2 md:col-span-3 lg:col-span-1" : ""
            } ${card.color}`}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                  {card.label}
                </span>
                <span className={`p-1.5 md:p-2 rounded-lg ${card.iconBg}`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-xl md:text-2xl font-bold">{card.value}</p>
              {card.sub && (
                <p className="text-xs opacity-60 mt-1">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Baris tengah: Ringkasan & Pair Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Ringkasan Statistik */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="font-semibold text-slate-700 mb-4">
              Ringkasan Statistik
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">
                  Total Menang
                </span>
                <span className="text-xl font-bold text-green-600">
                  {totalWin}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">
                  Total Kalah
                </span>
                <span className="text-xl font-bold text-red-500">
                  {totalLose}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">
                  Total Margin
                </span>
                <span className="text-xl font-bold text-slate-700">
                  ${totalMargin.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">ROI</span>
                <span
                  className={`text-xl font-bold ${Number(roi) >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {Number(roi) >= 0 ? "+" : ""}
                  {roi}%
                </span>
              </div>
              {/* Streak */}
              <div className="col-span-2 flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-500 font-medium">
                  Streak Saat Ini
                </span>
                {totalTrades === 0 ? (
                  <span className="text-slate-400 text-sm">Belum ada data</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-bold ${streakType === "Win" ? "text-green-600" : "text-red-500"}`}
                    >
                      {streak}x {streakType}
                    </span>
                    {streakType === "Win" ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pair Terpopuler */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="font-semibold text-slate-700 mb-4">
              Pair Terpopuler
            </h2>
            {topPairs.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada data</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topPairs.map(([pair, count], i) => (
                  <div key={pair} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {pair}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {count}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <PnlCalendar trades={trades} />
      </div>

      {/* Aktivitas Terbaru */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">Aktivitas Terbaru</h2>
            <Link
              href="/dashboard/trades"
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Lihat semua →
            </Link>
          </div>

          {recentTrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
              <BookOpen className="w-8 h-8 opacity-40" />
              <p className="text-sm">Belum ada jurnal trading</p>
              <Link
                href="/dashboard/add"
                className="mt-1 text-xs text-blue-600 hover:underline"
              >
                Tambah sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    {/* Position Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        trade.position === "Long"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {trade.position === "Long" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {trade.pair}
                      </p>
                      <p className="text-xs text-slate-400">
                        {trade.trade_date} · {trade.strategy} ·{" "}
                        <span
                          className={
                            trade.position === "Long"
                              ? "text-green-600"
                              : "text-red-500"
                          }
                        >
                          {trade.position}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-xs ${
                        trade.result === "Win"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {trade.result}
                    </Badge>
                    <span
                      className={`text-sm font-bold ${
                        trade.result === "Win"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {trade.result === "Win" ? "+" : "-"}$
                      {trade.profit_loss.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default DashboardPage;
