import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import {
  Brain,
  ChartLine,
  CircleCheck,
  NotebookPen,
  ShieldCheck,
  Timer,
} from "lucide-react";

function Features() {
  return (
    <section
      id="features"
      className="w-full px-10 max-sm:px-6 bg-linear-to-b from-brand via-brand-second to-brand"
    >
      {/* title */}
      <div className="w-full py-10">
        <h1 className="text-center font-light text-3xl max-sm:text-2xl text-[#004395] mb-4">
          Fitur Utama
        </h1>
        <p className="text-center font-bold text-4xl max-sm:text-3xl">
          Alat Presisi untuk Trader Profesional
        </p>
      </div>
      {/* features card */}
      <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap py-10 flex-1 items-center md:items-stretch justify-center gap-8">
        <Card className="w-full max-w-sm flex flex-col p-6 hover:scale-102 transition-all hover:shadow-lg hover:shadow-brand-second">
          <CardHeader>
            <NotebookPen className="text-blue-800 w-12 h-12 p-2 bg-blue-200 rounded-lg mb-3" />
            <CardTitle className="text-xl font-bold">Jurnal Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">
              Catat setiap transaksi trading, mulai dari harga masuk, harga
              keluar, rasio risk-reward, strategi, hingga catatan pribadi.
              Bangun riwayat trading yang lengkap untuk belajar dari setiap
              keputusan.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm flex flex-col p-6 hover:scale-102 transition-all hover:shadow-lg hover:shadow-brand-second">
          <CardHeader>
            <ChartLine className="text-white w-12 h-12 p-2 bg-black rounded-lg mb-3" />
            <CardTitle className="text-xl font-bold">
              Statistik Performa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">
              Pantau win rate, rata-rata rasio risk-reward (R:R), total profit
              dan loss, serta konsistensi trading melalui statistik yang mudah
              dipahami.
            </p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm flex flex-col p-6 hover:scale-102 transition-all hover:shadow-lg hover:shadow-brand-second">
          <CardHeader>
            <Brain className="text-orange-800 w-12 h-12 p-2 bg-orange-200 rounded-lg mb-3" />
            <CardTitle className="text-xl font-bold">
              Refleksi Trading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">
              Tuliskan emosi, kesalahan, dan pelajaran setelah setiap transaksi.
              Bangun disiplin dan hindari mengulangi kesalahan yang sama.
            </p>
          </CardContent>
        </Card>
      </div>
      {/* catatan jurnal */}
      <div className="flex flex-col lg:flex-row flex-1 py-10 gap-8 items-center lg:items-start">
        {/* card */}
        <div className="w-full lg:w-1/2 p-0 md:p-6">
          <Card className="p-4 rounded-2xl shadow-xl">
            <CardHeader className="flex justify-between">
              <CardTitle>Entri Jurnal: BTCUSDT Long </CardTitle>
              <p>24 Juni 2026</p>
            </CardHeader>
            <hr />
            <CardContent>
              <p className="text-text-primary font-bold mb-4">Catatan Setup</p>
              <div className="p-2 bg-[#D3E4FE] rounded-lg mb-4">
                <p className="italic font-light">
                  "BTCUSDT breakout resistance dan retest dengan baik. Entry
                  dilakukan setelah muncul konfirmasi bullish. Stop loss di
                  bawah swing low, target profit menggunakan rasio R:R 1:2."
                </p>
              </div>
              <p className="text-text-primary font-bold mb-4">
                Kondisi Psikologi
              </p>
              <div className="flex gap-4">
                <div className="flex p-2 items-center gap-1 border border-blue-200 bg-blue-100 text-blue-400 font-bold rounded-md">
                  <ShieldCheck className="w-4 h-4" />
                  <p>Percaya Diri</p>
                </div>
                <div className="flex p-2 items-center gap-1 border border-green-200 bg-green-100 text-green-400 font-bold rounded-md">
                  <Timer className="w-4 h-4" />
                  <p>Disiplin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* content */}
        <div className="w-full lg:w-1/2 p-0 md:p-6">
          <p className=" text-lg max-sm:text-base text-[#004395] mb-4">
            CARA BARU MENGELOLA JURNAL TRADING
          </p>
          <p className="text-2xl max-sm:text-xl font-bold mb-4">
            Bangun Kebiasaan Trading yang Lebih Baik
          </p>
          <p className="text-base text-text-primary mb-4">
            Berhenti mencatat trading di spreadsheet yang berantakan. Simpan
            setup, emosi, screenshot, dan hasil trading dalam satu tempat agar
            Anda dapat mengevaluasi performa, menemukan pola terbaik, dan
            membangun konsistensi trading.
          </p>

          {/* list fitur */}
          <ul className="flex flex-col gap-2">
            <li className="flex gap-2">
              <CircleCheck className="text-blue-500" />
              <span className="text-[#002E6A]">
                Tandai setup trading dengan mudah
              </span>
            </li>
            <li className="flex gap-2">
              <CircleCheck className="text-blue-500" />
              <span className="text-[#002E6A]">
                Catat kondisi psikologi saat trading
              </span>
            </li>
            <li className="flex gap-2">
              <CircleCheck className="text-blue-500" />
              <span className="text-[#002E6A]">
                Unggah screenshot dan chart trading
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Features;
