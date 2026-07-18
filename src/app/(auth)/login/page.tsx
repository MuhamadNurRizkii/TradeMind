import FormLogin from "@/components/auth/FormLogin";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TradeMind | Login",
};

function page() {
  return (
    <>
      <h1 className="text-2xl max-sm:text-xl text-center font-bold mb-2">
        Selamat Datang Kembali
      </h1>
      <p className="text-lg text-center mb-6 text-gray-600">
        Masuk untuk melanjutkan perjalanan trading Anda.
      </p>
      <FormLogin />
    </>
  );
}

export default page;
