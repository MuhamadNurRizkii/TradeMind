import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="w-full flex flex-col flex-1">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
