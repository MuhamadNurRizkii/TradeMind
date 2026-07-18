import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";

function Hero() {
  return (
    <section className="w-full mt-14 px-10 max-sm:px-6 bg-linear-to-b from-brand via-brand-second to-brand">
      <div className="w-full text-center py-10">
        <Badge className="hidden md:inline-flex bg-[#D8E2FF] mb-2 py-3 px-6 text-lg text-[#005AC2]">
          <span className="font-bold">Baru Hadir</span>: Jurnal Trading Modern →
        </Badge>
        <Badge className="md:hidden py-3 bg-[#D8E2FF] text-[#005AC2] mb-2 inline-flex">
          <span className="font-bold">Baru Hadir</span>: Jurnal Trading Modern →
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-[1000] p-2">
          Ubah Data Trading Anda Menjadi
        </h1>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-[1000] p-2 bg-linear-to-r from-[#000000] via-[#002E6A] to-[#004395] bg-clip-text text-transparent">
          Profit yang Konsisten
        </h1>
        <p className="p-2 mt-2 mb-4 text-base md:text-lg text-text-primary text-center">
          Jurnal trading modern yang membantu Anda mencatat transaksi,
          mengevaluasi psikologi trading, <br className="hidden md:block" /> dan menganalisis performa dalam
          satu dashboard yang intuitif.
        </p>
        <Link
          href={""}
          className={"py-3 px-6 rounded-md bg-black text-white text-xl"}
        >
          Mulai Sekarang
        </Link>
      </div>
      <div className="w-full py-10">
        <Image
          className="mx-auto rounded-[6px] w-full h-auto max-w-[1000px]"
          src={"/mockup.png"}
          alt="mockup"
          width={1000}
          height={400}
        />
      </div>
    </section>
  );
}

export default Hero;
