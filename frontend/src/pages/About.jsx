import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(216,29,30,0.16),transparent_24%),linear-gradient(180deg,#fff7f1_0%,#fff_55%,#f5efe9_100%)] text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[32px] bg-white/95 p-10 shadow-2xl ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.32em] text-[#D81E1E]">Бидний тухай</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Chicken2030 — Тахиа, Хурд, Амт
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Chicken2030 нь шалгарсан орц, хурдан үйлчилгээг нэгтгэж Монголын хамгийн амттай тахианы туршлагыг хэрэглэгчиддээ хүргэнэ. Бидний зорилго нь гэр бүл, найз нөхөд, хамт олонд зориулсан хялбар захиалга, чанартай тахиа, сайхан үйлчилгээ юм.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Шинэхэн орц",
                  detail: "Өдөр бүр шинээр ирсэн бүтээгдэхүүнээр амтална.",
                },
                {
                  title: "Хурдан хүргэлт",
                  detail: "Таны захиалгыг богино хугацаанд хүргэнэ.",
                },
                {
                  title: "Найдвартай үйлчилгээ",
                  detail: "Асуудалгүй, найрсаг харилцаатай үйлчилгээ.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-[#D81E1E]">{item.title}</p>
                  <p className="mt-4 text-base leading-7 text-slate-700">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-[32px] bg-[#fff3ed] p-8 shadow-2xl ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Манай зорилго</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950">Аливааг илүү хялбар болгох</h2>
              <p className="mt-5 text-slate-600 leading-8">
                Бид захиалга өгч байгаа хүмүүстээ илүү хялбар, түргэн, итгэлтэй үйлчилгээ үзүүлэхийг зорьдог. Манай платформ нь захиалгын бүх шатанд ил тод, найдвартай байдлыг хангана.
              </p>
            </div>
            <div className="rounded-[32px] bg-[#f8fafc] p-8 shadow-2xl ring-1 ring-slate-200">
              <p className="text-sm uppercase tracking-[0.28em] text-[#D81E1E]">Ямар давуу талтай вэ?</p>
              <ul className="mt-6 space-y-4 text-slate-700">
                <li className="rounded-3xl border border-slate-200 bg-white p-4">Амтат, өөрийн онцлогтой тайван тахианы амтыг мэдрэх</li>
                <li className="rounded-3xl border border-slate-200 bg-white p-4">Цэвэр, шинэхэн орц ашигласан ур ороём</li>
                <li className="rounded-3xl border border-slate-200 bg-white p-4">Хурдан хүргэлт, найдвартай үйлчилгээний баталгаа</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;