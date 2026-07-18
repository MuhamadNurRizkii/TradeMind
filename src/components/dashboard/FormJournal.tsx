"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { createTrade, updateTrade } from "@/actions/trade";
import { Position, Result } from "@/types/trades";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

type InitialData = {
  date: string;
  pair: string;
  position: Position | null;
  margin: string;
  strategy: string;
  result: Result | null;
  profitLoss: string;
};

type FormJournalProps =
  | { mode?: "add"; tradeId?: never; initialData?: never }
  | { mode: "edit"; tradeId: number; initialData: InitialData };

function FormJournal({ mode = "add", tradeId, initialData }: FormJournalProps) {
  const router = useRouter();

  const [date, setDate] = useState<string>(initialData?.date ?? "");
  const [pair, setPair] = useState<string>(initialData?.pair ?? "");
  const [position, setPosision] = useState<Position | null>(
    initialData?.position ?? null
  );
  const [margin, setMargin] = useState<string>(initialData?.margin ?? "");
  const [strategy, setStrategy] = useState<string>(
    initialData?.strategy ?? ""
  );
  const [result, setResult] = useState<Result | null>(
    initialData?.result ?? null
  );
  const [profitLoss, setProfitLoss] = useState<string>(
    initialData?.profitLoss ?? ""
  );

  const [loading, setLoading] = useState<boolean>(false);

  const data = {
    date,
    pair,
    position,
    margin: Number(margin),
    strategy,
    result,
    profitLoss: Number(profitLoss),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (mode === "edit" && tradeId) {
        await updateTrade(tradeId, data);
        toast.success("Berhasil memperbarui data");
        router.push("/dashboard/trades");
      } else {
        await createTrade(data);
        toast.success("Berhasil menambahkan data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <form action="" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* basic informastion */}
              <h2 className="text-lg">Informasi Trading</h2>
              <div className="grid p-2 max-sm:grid-cols-1 grid-cols-3 gap-4 border rounded-sm">
                {/* date */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Tanggal</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-sm"
                  />
                </div>
                {/* pair */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Pair</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="BTCUSDT"
                    className="rounded-sm"
                    value={pair}
                    onChange={(e) => setPair(e.target.value)}
                  />
                </div>
                {/* position */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Position</Label>
                  <Select
                    value={position ?? undefined}
                    onValueChange={(value) => setPosision(value as Position)}
                  >
                    <SelectTrigger className="h-11 w-full rounded-sm">
                      <SelectValue placeholder="Pilih Posisi" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Long">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                            <span>Long</span>
                          </div>
                        </SelectItem>

                        <SelectItem value="Short">
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                            <span>Short</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* detail eksekusi */}
              <h2 className="text-lg">Detail Eksekusi</h2>
              <div className="grid p-2 max-sm:grid-cols-1 grid-cols-4 gap-4 border rounded-sm">
                {/* margin */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Margin ($)</Label>
                  <Input
                    type="number"
                    autoComplete="off"
                    placeholder="100 atau 90.5"
                    className="rounded-sm"
                    step={"0.01"}
                    value={margin}
                    onChange={(e) => setMargin(e.target.value)}
                  />
                </div>
                {/* strategy */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Strategi</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    placeholder="SNR"
                    className="rounded-sm"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                  />
                </div>
                {/* result */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">Hasil</Label>
                  <Select
                    value={result ?? undefined}
                    onValueChange={(value) => setResult(value as Result)}
                  >
                    <SelectTrigger className="h-11 w-full rounded-sm">
                      <SelectValue placeholder="Pilih Hasil" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Win">
                          <div className="flex items-center gap-2">
                            <span>Win</span>
                          </div>
                        </SelectItem>

                        <SelectItem value="Lose">
                          <div className="flex items-center gap-2">
                            <span>Lose</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {/* profit/loss */}
                <div className=" p-2">
                  <Label className="mb-2 text-base">P/L ($)</Label>
                  <Input
                    type="number"
                    autoComplete="off"
                    placeholder="10 atau 10.5"
                    className="rounded-sm"
                    step={"0.01"}
                    value={profitLoss}
                    onChange={(e) => setProfitLoss(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-5 rounded-sm"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  className={
                    "flex-1 py-5 rounded-sm bg-blue-600 hover:bg-blue-400"
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner className="size-6" />
                      <span>loading...</span>
                    </>
                  ) : mode === "edit" ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default FormJournal;
