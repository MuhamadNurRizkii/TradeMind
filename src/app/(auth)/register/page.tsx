import FormRegister from "@/components/auth/FormRegister";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TradeMind | Register",
};

function page() {
  return (
    <>
      <h1 className="text-2xl max-sm:text-xl text-center font-bold mb-2">
        Buat Akun TradeMind
      </h1>
      <p className="text-lg text-center mb-6 text-gray-600">
        Mulai bangun kebiasaan trading yang lebih disiplin.
      </p>
      <FormRegister />
    </>
  );
}

export default page;
