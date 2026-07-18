import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";

function CTASection() {
  return (
    <section className="w-full px-10 max-sm:px-6 bg-linear-to-b from-brand via-brand-second to-brand">
      <div className="w-full py-10">
        <Card className="w-full text-center p-10 bg-blue-500 text-white">
          <CardHeader>
            <h1 className="text-2xl font-bold mb-4">
              Siap Membangun Kebiasaan Trading yang Lebih Baik?
            </h1>
            <p className="text-base mb-4">
              Mulai catat setiap trading, evaluasi performa, dan tingkatkan
              disiplin Anda dengan TradeMind. Tombol
            </p>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={""}
              className="p-4 bg-white font-bold text-blue-500 rounded-lg hover:scale-102 transition-all "
            >
              Mulai Gratis
            </Link>
            <a
              href="#pricing"
              className="p-4 font-bold border border-white rounded-lg hover:bg-blue-400 transition-all"
            >
              Lihat Paket Pro
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default CTASection;
