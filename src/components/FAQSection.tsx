import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

function FAQSection() {
  const items = [
    {
      value: "item-1",
      trigger: "Apakah TradeMind gratis?",
      content:
        "Ya. Anda dapat menggunakan fitur dasar secara gratis untuk mulai mencatat dan mengevaluasi aktivitas trading. Fitur tambahan tersedia pada paket Pro.",
    },
    {
      value: "item-2",
      trigger: "Apakah data trading saya aman?",
      content:
        "Tentu. Data Anda disimpan dengan aman dan hanya dapat diakses oleh akun Anda.",
    },
    {
      value: "item-3",
      trigger: "Apakah saya bisa menambahkan screenshot chart?",
      content:
        "Bisa. Lampirkan screenshot sebelum atau sesudah entry agar lebih mudah mengevaluasi setiap keputusan trading.",
    },
    {
      value: "item-4",
      trigger: "Apakah aplikasi ini cocok untuk pemula?",
      content:
        "Ya. TradeMind dirancang agar mudah digunakan, baik oleh trader pemula maupun trader yang sudah berpengalaman.",
    },
    {
      value: "item-5",
      trigger: "Apakah saya bisa mengakses TradeMind dari ponsel?",
      content:
        "Bisa. TradeMind dapat diakses melalui browser di komputer maupun perangkat seluler.",
    },
  ];
  return (
    <section
      id="faq"
      className="w-full px-10 max-sm:px-6 bg-linear-to-b from-brand via-brand-second to-brand"
    >
      <div className="w-full py-10">
        <h1 className="text-center font-bold text-4xl max-sm:text-3xl">
          Pertanyaan yang Sering Diajukan
        </h1>
      </div>
      <div className="w-full py-10">
        <Accordion defaultValue={["item-1"]} className={"max-w-lg mx-auto"}>
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className={"p-2 rounded-lg mb-2 bg-white "}
            >
              <AccordionTrigger className={"text-gray-700 font-bold"}>
                {item.trigger}
              </AccordionTrigger>
              <AccordionContent className={"text-text-primary"}>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQSection;
