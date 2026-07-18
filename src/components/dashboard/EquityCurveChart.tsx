"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EquityPoint = { label: string; equity: number };

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  const isPositive = data.length > 1 && data[data.length - 1].equity >= data[0].equity;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={isPositive ? "#10b981" : "#ef4444"}
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor={isPositive ? "#10b981" : "#ef4444"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Equity"]}
          contentStyle={{
            borderRadius: 8,
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth={2}
          fill="url(#equityGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
