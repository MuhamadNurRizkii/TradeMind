import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full px-10 max-sm:px-6 bg-linear-to-b from-brand via-brand-second to-brand"
    >
      <div className="w-full py-10">
        <h1 className="text-center font-light text-3xl max-sm:text-2xl text-[#004395] mb-4">
          PILIH PAKETMU
        </h1>
        <p className="text-center font-bold text-4xl max-sm:text-3xl">
          Pilih Paket yang Sesuai dengan Kebutuhan Anda
        </p>
      </div>
      <div className="w-full flex flex-col md:flex-row flex-1 items-center md:items-stretch justify-center gap-8 py-10">
        <Card className="w-full max-w-sm p-4 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Gratis</CardTitle>
            <CardDescription className="mb-4">
              Cocok untuk trader yang baru memulai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">
              <span className="font-bold">Rp0</span>/Bulan
            </p>
            <ul className="mb-4">
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Hingga 100 jurnal trading</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Statistik performa dasar</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Upload hingga 5 screenshot</span>
              </li>
            </ul>

            <Button
              variant={"outline"}
              className={
                "w-full py-6 border border-gray-700 font-bold hover:bg-brand-second"
              }
            >
              Mulai secara gratis
            </Button>
          </CardContent>
        </Card>
        {/* premium */}
        <Card className="w-full max-w-sm relative p-4 hover:shadow-lg bg-black md:scale-105 text-white">
          <CardHeader>
            <CardTitle className="font-bold mb-2">Pro</CardTitle>
            <CardDescription className="mb-4">
              Untuk trader yang ingin berkembang lebih cepat.
            </CardDescription>
            <Badge className="absolute top-4 right-4 bg-blue-500">
              Paling Populer
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">
              <span className="font-bold">Rp49.000</span>/Bulan
            </p>
            <ul className="mb-4">
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Jurnal trading tanpa batas</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Statistik & analisis lengkap</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Upload screenshot tanpa batas</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Ekspor PDF & CSV</span>
              </li>
              <li className="py-2 flex items-center gap-1">
                <Check className="w-4 h-4 text-blue-500" />
                <span>Prioritas dukungan</span>
              </li>
            </ul>

            <Button
              className={
                "w-full py-6 font-bold bg-white text-black hover:bg-white hover:scale-95 transition-all"
              }
            >
              Memulai Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Pricing;
