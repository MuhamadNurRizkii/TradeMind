import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";
import { EquityCurveChart } from "@/components/dashboard/EquityCurveChart";
import { PLBarChart } from "@/components/dashboard/PLBarChart";
import { WinLosePieChart } from "@/components/dashboard/WinLosePieChart";

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

// --- Helper: hitung expectancy = (winRate * avgWin) - (loseRate * avgLose)
function calcExpectancy(trades: Trade[]) {
  const wins = trades.filter((t) => t.result === "Win");
  const loses = trades.filter((t) => t.result === "Lose");
  if (trades.length === 0) return 0;
  const winRate = wins.length / trades.length;
  const loseRate = loses.length / trades.length;
  const avgWin =
    wins.length > 0
      ? wins.reduce((s, t) => s + t.profit_loss, 0) / wins.length
      : 0;
  const avgLose =
    loses.length > 0
      ? loses.reduce((s, t) => s + t.profit_loss, 0) / loses.length
      : 0;
  return winRate * avgWin - loseRate * avgLose;
}

// --- Helper: hitung max drawdown dari equity curve
function calcMaxDrawdown(equityCurve: number[]) {
  let peak = equityCurve[0] ?? 0;
  let maxDD = 0;
  for (const val of equityCurve) {
    if (val > peak) peak = val;
    const dd = peak > 0 ? ((peak - val) / peak) * 100 : 0;
    if (dd > maxDD) maxDD = dd;
  }
  return maxDD;
}

async function StatisticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("trades")
    .select("*")
    .eq("user_id", user?.id)
    .order("trade_date", { ascending: true });

  const trades: Trade[] = data ?? [];

  // ============================================================
  // 1. METRIK DASAR
  // ============================================================
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.result === "Win");
  const loses = trades.filter((t) => t.result === "Lose");
  const winRate = totalTrades === 0 ? 0 : (wins.length / totalTrades) * 100;

  const totalProfit = wins.reduce((s, t) => s + t.profit_loss, 0);
  const totalLoss = loses.reduce((s, t) => s + t.profit_loss, 0);
  const netPL = totalProfit - totalLoss;

  const avgWin = wins.length > 0 ? totalProfit / wins.length : 0;
  const avgLose = loses.length > 0 ? totalLoss / loses.length : 0;
  const riskRewardRatio = avgLose > 0 ? avgWin / avgLose : 0;
  const expectancy = calcExpectancy(trades);

  // ============================================================
  // 2. EQUITY CURVE
  // ============================================================
  const equityCurve: number[] = [];
  let runningEquity = 0;
  const equityPoints = trades.map((t) => {
    runningEquity += t.result === "Win" ? t.profit_loss : -t.profit_loss;
    equityCurve.push(runningEquity);
    return {
      label: t.trade_date.slice(5), // MM-DD
      equity: parseFloat(runningEquity.toFixed(2)),
    };
  });

  const maxDrawdown = calcMaxDrawdown(equityCurve);

  // ============================================================
  // 3. P/L PER BULAN
  // ============================================================
  const monthlyMap: Record<string, number> = {};
  trades.forEach((t) => {
    const key = t.trade_date.slice(0, 7); // YYYY-MM
    const pl = t.result === "Win" ? t.profit_loss : -t.profit_loss;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + pl;
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      name: key.slice(5), // MM
      value: parseFloat(value.toFixed(2)),
    }));

  // ============================================================
  // 4. ANALISIS PER PAIR
  // ============================================================
  const pairMap: Record<
    string,
    { total: number; wins: number; pl: number; margin: number }
  > = {};
  trades.forEach((t) => {
    if (!pairMap[t.pair]) {
      pairMap[t.pair] = { total: 0, wins: 0, pl: 0, margin: 0 };
    }
    pairMap[t.pair].total++;
    pairMap[t.pair].margin += t.margin;
    if (t.result === "Win") {
      pairMap[t.pair].wins++;
      pairMap[t.pair].pl += t.profit_loss;
    } else {
      pairMap[t.pair].pl -= t.profit_loss;
    }
  });
  const pairStats = Object.entries(pairMap)
    .map(([pair, s]) => ({
      pair,
      total: s.total,
      winRate: ((s.wins / s.total) * 100).toFixed(1),
      netPL: parseFloat(s.pl.toFixed(2)),
      roi: s.margin > 0 ? ((s.pl / s.margin) * 100).toFixed(1) : "0.0",
    }))
    .sort((a, b) => b.netPL - a.netPL);

  // ============================================================
  // 5. ANALISIS PER STRATEGI
  // ============================================================
  const stratMap: Record<
    string,
    { total: number; wins: number; pl: number }
  > = {};
  trades.forEach((t) => {
    if (!stratMap[t.strategy]) stratMap[t.strategy] = { total: 0, wins: 0, pl: 0 };
    stratMap[t.strategy].total++;
    if (t.result === "Win") {
      stratMap[t.strategy].wins++;
      stratMap[t.strategy].pl += t.profit_loss;
    } else {
      stratMap[t.strategy].pl -= t.profit_loss;
    }
  });
  const stratStats = Object.entries(stratMap)
    .map(([strategy, s]) => ({
      strategy,
      total: s.total,
      winRate: ((s.wins / s.total) * 100).toFixed(1),
      netPL: parseFloat(s.pl.toFixed(2)),
    }))
    .sort((a, b) => b.netPL - a.netPL);

  // ============================================================
  // 6. ANALISIS POSISI (Long vs Short)
  // ============================================================
  const positionMap = { Long: { total: 0, wins: 0, pl: 0 }, Short: { total: 0, wins: 0, pl: 0 } };
  trades.forEach((t) => {
    positionMap[t.position].total++;
    if (t.result === "Win") {
      positionMap[t.position].wins++;
      positionMap[t.position].pl += t.profit_loss;
    } else {
      positionMap[t.position].pl -= t.profit_loss;
    }
  });

  // ============================================================
  // 7. WIN/LOSE PIE DATA
  // ============================================================
  const pieData = [
    { name: "Win", value: wins.length, color: "#10b981" },
    { name: "Lose", value: loses.length, color: "#ef4444" },
  ];

  // ============================================================
  // 8. INSIGHT / REKOMENDASI OTOMATIS
  // ============================================================
  const insights: { type: "good" | "warn" | "info"; text: string }[] = [];

  if (totalTrades >= 5) {
    if (winRate >= 60)
      insights.push({ type: "good", text: `Win rate Anda ${winRate.toFixed(1)}% — di atas rata-rata trader.` });
    else if (winRate < 45)
      insights.push({ type: "warn", text: `Win rate ${winRate.toFixed(1)}% cukup rendah. Evaluasi kembali entry criteria Anda.` });

    if (riskRewardRatio >= 2)
      insights.push({ type: "good", text: `Risk/Reward ratio ${riskRewardRatio.toFixed(2)} — sangat baik (≥ 2:1).` });
    else if (riskRewardRatio < 1)
      insights.push({ type: "warn", text: `Risk/Reward ${riskRewardRatio.toFixed(2)} < 1. Anda kehilangan lebih banyak dari yang dimenangkan per trade.` });

    if (maxDrawdown > 30)
      insights.push({ type: "warn", text: `Max Drawdown ${maxDrawdown.toFixed(1)}% — pertimbangkan manajemen risiko yang lebih ketat.` });
    else if (maxDrawdown <= 10)
      insights.push({ type: "good", text: `Max Drawdown hanya ${maxDrawdown.toFixed(1)}% — manajemen risiko Anda sangat baik.` });

    if (expectancy > 0)
      insights.push({ type: "good", text: `Expectancy positif $${expectancy.toFixed(2)} — sistem trading Anda profitable secara statistik.` });
    else
      insights.push({ type: "warn", text: `Expectancy negatif $${expectancy.toFixed(2)}. Strategi perlu dievaluasi ulang.` });

    // Pair terbaik & terburuk
    if (pairStats.length > 0) {
      const best = pairStats[0];
      const worst = pairStats[pairStats.length - 1];
      if (best.netPL > 0)
        insights.push({ type: "info", text: `Pair terbaik Anda: ${best.pair} dengan Net P/L $${best.netPL}.` });
      if (worst.netPL < 0)
        insights.push({ type: "warn", text: `Pair terburuk: ${worst.pair} dengan Net P/L $${worst.netPL}. Pertimbangkan untuk mengurangi frekuensi trading pair ini.` });
    }

    // Strategi terbaik
    if (stratStats.length > 0 && stratStats[0].netPL > 0)
      insights.push({ type: "info", text: `Strategi paling profit: "${stratStats[0].strategy}" (${stratStats[0].winRate}% WR, Net P/L $${stratStats[0].netPL}).` });
  } else if (totalTrades > 0) {
    insights.push({ type: "info", text: "Tambahkan lebih banyak trade (minimal 5) untuk mendapatkan analisis yang lebih akurat." });
  }

  const fmt = (n: number) =>
    `${n >= 0 ? "+" : ""}$${Math.abs(n).toFixed(2)}`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Statistik Trading</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Analisis mendalam untuk menemukan pola dan meningkatkan kualitas keputusan trading Anda
        </p>
      </div>

      {totalTrades === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <Target className="w-10 h-10 opacity-40" />
            <p className="font-medium">Belum ada data trading</p>
            <p className="text-sm">Tambahkan jurnal trading untuk melihat statistik</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ========== KPI CARDS ========== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Expectancy",
                value: `${expectancy >= 0 ? "+" : ""}$${expectancy.toFixed(2)}`,
                sub: "per trade rata-rata",
                color: expectancy >= 0 ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50",
                iconBg: expectancy >= 0 ? "bg-emerald-100" : "bg-red-100",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                label: "Risk/Reward",
                value: `${riskRewardRatio.toFixed(2)}:1`,
                sub: `W $${avgWin.toFixed(2)} / L $${avgLose.toFixed(2)}`,
                color: riskRewardRatio >= 1.5 ? "text-blue-700 bg-blue-50" : "text-orange-700 bg-orange-50",
                iconBg: riskRewardRatio >= 1.5 ? "bg-blue-100" : "bg-orange-100",
                icon: <Target className="w-5 h-5" />,
              },
              {
                label: "Max Drawdown",
                value: `${maxDrawdown.toFixed(1)}%`,
                sub: "penurunan equity terbesar",
                color: maxDrawdown <= 15 ? "text-violet-700 bg-violet-50" : "text-red-600 bg-red-50",
                iconBg: maxDrawdown <= 15 ? "bg-violet-100" : "bg-red-100",
                icon: <AlertTriangle className="w-5 h-5" />,
              },
              {
                label: "Win Rate",
                value: `${winRate.toFixed(1)}%`,
                sub: `${wins.length}W / ${loses.length}L`,
                color: winRate >= 50 ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50",
                iconBg: winRate >= 50 ? "bg-green-100" : "bg-red-100",
                icon: <TrendingUp className="w-5 h-5" />,
              },
            ].map((card, i) => (
              <Card key={i} className={`border-0 shadow-sm ${card.color}`}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
                      {card.label}
                    </span>
                    <span className={`p-1.5 md:p-2 rounded-lg ${card.iconBg}`}>{card.icon}</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold">{card.value}</p>
                  <p className="text-xs opacity-60 mt-0.5">{card.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ========== INSIGHT OTOMATIS ========== */}
          {insights.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Insight Otomatis
                </h2>
                <div className="flex flex-col gap-2">
                  {insights.map((ins, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                        ins.type === "good"
                          ? "bg-emerald-50 text-emerald-800"
                          : ins.type === "warn"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      <span className="mt-0.5 flex-shrink-0">
                        {ins.type === "good" ? "✅" : ins.type === "warn" ? "⚠️" : "ℹ️"}
                      </span>
                      {ins.text}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ========== EQUITY CURVE + WIN/LOSE PIE ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <Card className="lg:col-span-2 border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-700">Equity Curve</h2>
                  <Badge
                    className={`text-xs ${netPL >= 0 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-red-100 text-red-600 hover:bg-red-100"}`}
                  >
                    {fmt(netPL)}
                  </Badge>
                </div>
                {equityPoints.length < 2 ? (
                  <p className="text-sm text-slate-400 py-10 text-center">
                    Butuh minimal 2 trade untuk menampilkan grafik
                  </p>
                ) : (
                  <EquityCurveChart data={equityPoints} />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-slate-700 mb-2">
                  Distribusi Hasil
                </h2>
                <WinLosePieChart data={pieData} />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-center p-2 rounded-lg bg-emerald-50">
                    <p className="text-xs text-slate-500">Avg Win</p>
                    <p className="font-bold text-emerald-600">+${avgWin.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-red-50">
                    <p className="text-xs text-slate-500">Avg Loss</p>
                    <p className="font-bold text-red-500">-${avgLose.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========== P/L PER BULAN ========== */}
          {monthlyData.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-slate-700 mb-4">P/L per Bulan</h2>
                <PLBarChart data={monthlyData} />
              </CardContent>
            </Card>
          )}

          {/* ========== ANALISIS POSISI ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-slate-700 mb-4">
                  Long vs Short
                </h2>
                <div className="space-y-3">
                  {(["Long", "Short"] as const).map((pos) => {
                    const s = positionMap[pos];
                    const wr = s.total > 0 ? (s.wins / s.total) * 100 : 0;
                    const isLong = pos === "Long";
                    return (
                      <div key={pos} className={`p-4 rounded-xl border ${isLong ? "border-green-100 bg-green-50/50" : "border-red-100 bg-red-50/50"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isLong ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-semibold text-slate-700">{pos}</span>
                          </div>
                          <span className={`text-sm font-bold ${s.pl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {fmt(s.pl)}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>{s.total} trades</span>
                          <span>WR {wr.toFixed(1)}%</span>
                          <span>{s.wins}W / {s.total - s.wins}L</span>
                        </div>
                        {/* win rate bar */}
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLong ? "bg-green-500" : "bg-red-400"}`}
                            style={{ width: `${wr}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* ========== ANALISIS STRATEGI ========== */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-semibold text-slate-700 mb-4">
                  Performa per Strategi
                </h2>
                {stratStats.length === 0 ? (
                  <p className="text-sm text-slate-400">Belum ada data</p>
                ) : (
                  <div className="space-y-2">
                    {stratStats.map((s) => (
                      <div
                        key={s.strategy}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {s.strategy}
                          </p>
                          <p className="text-xs text-slate-400">
                            {s.total} trades · WR {s.winRate}%
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {s.netPL > 0 ? (
                            <ChevronUp className="w-4 h-4 text-emerald-500" />
                          ) : s.netPL < 0 ? (
                            <ChevronDown className="w-4 h-4 text-red-400" />
                          ) : (
                            <Minus className="w-4 h-4 text-slate-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${s.netPL >= 0 ? "text-emerald-600" : "text-red-500"}`}
                          >
                            {fmt(s.netPL)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ========== ANALISIS PER PAIR ========== */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <h2 className="font-semibold text-slate-700 mb-4">
                Performa per Pair
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Pair", "Trades", "Win Rate", "Net P/L", "ROI"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pairStats.map((p) => (
                      <tr
                        key={p.pair}
                        className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {p.pair}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{p.total}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${p.winRate}%` }}
                              />
                            </div>
                            <span className="text-slate-600">{p.winRate}%</span>
                          </div>
                        </td>
                        <td className={`py-3 px-3 font-bold ${p.netPL >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {fmt(p.netPL)}
                        </td>
                        <td className={`py-3 px-3 font-semibold ${Number(p.roi) >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {Number(p.roi) >= 0 ? "+" : ""}
                          {p.roi}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}

export default StatisticsPage;
