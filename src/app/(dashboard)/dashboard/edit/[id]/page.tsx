import FormJournal from "@/components/dashboard/FormJournal";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import React from "react";
import { Toaster } from "react-hot-toast";

async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trade, error } = await supabase
    .from("trades")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !trade) {
    notFound();
  }

  return (
    <section>
      <Toaster />
      <div className="p-4">
        <h1 className="font-bold text-lg">Edit Jurnal Trading</h1>
        <p className="text-sm text-gray-600">
          Perbarui detail transaksi trading Anda.
        </p>
      </div>
      <hr />
      <div className="p-4">
        <FormJournal
          mode="edit"
          tradeId={Number(id)}
          initialData={{
            date: trade.trade_date,
            pair: trade.pair,
            position: trade.position,
            margin: String(trade.margin),
            strategy: trade.strategy,
            result: trade.result,
            profitLoss: String(trade.profit_loss),
          }}
        />
      </div>
    </section>
  );
}

export default EditJournalPage;
