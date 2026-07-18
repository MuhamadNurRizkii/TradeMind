export type Position = "Long" | "Short";

export type Result = "Win" | "Lose";

export type Trade = {
  date: string;
  pair: string;
  position: Position | null;
  margin: number;
  strategy: string;
  result: Result | null;
  profitLoss: number;
};
