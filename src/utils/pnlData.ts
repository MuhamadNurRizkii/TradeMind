import { Trade } from "@/types/trades";

export const pnlData = (trades: any[] | null) => {
  let data: Record<string, number> = {};

  if (trades !== null) {
    trades.forEach((trade) => {
      console.log({
        date: trade.trade_date,
        result: trade.result,
        profitLoss: trade.profit_loss,
      });
      const pnl =
        trade.result === "Win" ? trade.profit_loss : -trade.profit_loss;

      data[trade.trade_date] = (data[trade.trade_date] ?? 0) + pnl;
    });
  }

  return data;
};
