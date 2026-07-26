"use client";
import { Trade } from "@/types/trades";
import { getCalendarDays } from "@/utils/calendar";
import { pnlData } from "@/utils/pnlData";
import React, { useState } from "react";

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function PnlCalendar({ trades }: { trades: any[] | null }) {
  const [current, setCurrent] = useState(new Date());
  const days = getCalendarDays(current.getFullYear(), current.getMonth());
  const pnlTrade = pnlData(trades);

  const monthTotal = days
    .filter(Boolean)
    .reduce((sum, d) => sum + (pnlTrade[formatDate(d!)] ?? 0), 0);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() - 1))
          }
        >
          ←
        </button>
        <h2 className="font-semibold">
          {current.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        </h2>
        <button
          onClick={() =>
            setCurrent(new Date(current.getFullYear(), current.getMonth() + 1))
          }
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-1 text-gray-500">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const pnl = pnlTrade[formatDate(date)];
          const isProfit = pnl !== undefined && pnl >= 0;
          const isLoss = pnl !== undefined && pnl < 0;

          return (
            <div
              key={i}
              className={`aspect-square rounded-md p-1 text-xs flex flex-col justify-between
                ${isProfit ? "bg-green-100 text-green-700" : ""}
                ${isLoss ? "bg-red-100 text-red-700" : ""}
                ${pnl === undefined ? "bg-gray-50 text-gray-400" : ""}`}
            >
              <span>{date.getDate()}</span>
              {pnl !== undefined && <span className="font-medium">${pnl}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PnlCalendar;
