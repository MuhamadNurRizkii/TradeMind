import FormJournal from "@/components/dashboard/FormJournal";
import React from "react";
import { Toaster } from "react-hot-toast";

function page() {
  return (
    <section>
      <Toaster />
      <div className=" p-4">
        <h1 className="font-bold text-lg">Tambah Jurnal Trading</h1>
        <p className="text-sm text-gray-600">
          Catat detail setiap transaksi untuk menganalisis dan meningkatkan
          performa trading Anda.
        </p>
      </div>
      <hr />
      <div className="p-4">
        <FormJournal />
      </div>
    </section>
  );
}

export default page;
