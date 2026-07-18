import React from "react";
import { MoveDown, MoveUp, SquarePen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AlertDelete from "./AlertDelete";

type TradeProps = {
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

function TradeTable({
  trades,
  refresh,
  setRefresh,
}: {
  trades: TradeProps[];
  refresh: boolean | null;
  setRefresh: (boolean: boolean | null) => void;
}) {
  if (trades.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Belum ada data trade yang sesuai filter.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              {["Tanggal", "Pair", "Position", "Margin", "Strategi", "Result", "P/L", "Aksi"].map((h) => (
                <th key={h} className="py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 text-slate-600 text-xs">{item.trade_date}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">{item.pair}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    {item.position === "Long" ? (
                      <MoveUp className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <MoveDown className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className={item.position === "Long" ? "text-green-700" : "text-red-600"}>
                      {item.position}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">${item.margin}</td>
                <td className="py-3 px-3 text-slate-600">{item.strategy}</td>
                <td className="py-3 px-3">
                  <Badge className={`text-xs ${item.result === "Win" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-600 hover:bg-red-100"}`}>
                    {item.result}
                  </Badge>
                </td>
                <td className={`py-3 px-3 font-bold ${item.result === "Win" ? "text-green-600" : "text-red-500"}`}>
                  {item.result === "Win" ? "+" : "-"}${item.profit_loss}
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/edit/${item.id}`}
                      className="p-1.5 block rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <SquarePen className="w-3.5 h-3.5" />
                    </Link>
                    <AlertDelete id={item.id} refresh={refresh} setRefresh={setRefresh} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-2 md:hidden">
        {trades.map((item, index) => (
          <div key={index} className="border border-slate-100 rounded-xl p-3 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.position === "Long" ? "bg-green-100" : "bg-red-100"}`}>
                  {item.position === "Long" ? (
                    <MoveUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <MoveDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.pair}</p>
                  <p className="text-xs text-slate-400">{item.trade_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className={`text-xs ${item.result === "Win" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-600 hover:bg-red-100"}`}>
                  {item.result}
                </Badge>
                <span className={`text-sm font-bold ${item.result === "Win" ? "text-green-600" : "text-red-500"}`}>
                  {item.result === "Win" ? "+" : "-"}${item.profit_loss}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex gap-3">
                <span>Margin: <strong className="text-slate-700">${item.margin}</strong></span>
                <span>Strategi: <strong className="text-slate-700">{item.strategy}</strong></span>
              </div>
              <div className="flex gap-1.5">
                <Link
                  href={`/dashboard/edit/${item.id}`}
                  className="p-1.5 rounded-lg bg-blue-100 text-blue-600"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </Link>
                <AlertDelete id={item.id} refresh={refresh} setRefresh={setRefresh} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TradeTable;
