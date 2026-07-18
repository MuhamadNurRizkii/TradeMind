import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TradeMind | Autentication",
  description: "Login atau Daftar Akun TradeMind",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  if (user) {
    redirect("/dashboard");
  }
  return (
    <section className="w-full px-10   max-sm:px-6 min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-brand-second to-brand">
      <Toaster />
      {children}
    </section>
  );
}
