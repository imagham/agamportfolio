import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Font (tambahkan di CSS global bila belum):
   @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;1,400;1,500&display=swap"); */
const DISPLAY_FONT = "font-['Manrope',system-ui,sans-serif]";
const SERIF_FONT = "font-['Newsreader',Georgia,serif]";

/* ============ DATA: ini contoh cerita. Ganti dengan perjalananmu sendiri ============
   kind: "edu" (pendidikan) atau "journey" (perjalanan)
   year: boleh teks, misalnya "2019" atau "Sekarang"
   quote: satu kalimat inti tiap bab, tampil miring. */
const CHAPTERS = [
  {
    year: "2019",
    kind: "journey",
    title: "Kamera Pertama",
    place: "Jakarta",
    story: "Semua dimulai dari kamera bekas dan jalanan yang saya lewati tiap hari. Saya belum paham pencahayaan, tapi saya mulai memperhatikan cara cahaya jatuh di wajah orang dan dinding kota.",
    quote: "Saya belajar melihat dulu, baru belajar memotret.",
    tags: ["Fotografi", "Street"],
  },
  {
    year: "2020",
    kind: "edu",
    title: "Bangku Sekolah",
    place: "Nama sekolahmu, Kota",
    story: "Di sini saya pertama kali menulis baris kode dan merasakan kepuasan melihat halaman web sederhana tampil di layar. Di luar kelas, saya aktif di kegiatan fotografi sekolah.",
    quote: "Layar kosong ternyata bisa jadi kanvas.",
    tags: ["Dasar komputer", "HTML & CSS", "Ekstrakurikuler foto"],
  },
  {
    year: "2021",
    kind: "journey",
    title: "Kursi Barber",
    place: "Barbershop pertama",
    story: "Saya belajar memegang clipper dan gunting dari nol. Pelajaran terbesarnya bukan teknik, tapi mendengarkan klien dan memastikan mereka pulang dengan percaya diri.",
    quote: "Detail kecil yang rapi membuat orang merasa dihargai.",
    tags: ["Barbering", "Klien pertama"],
  },
  {
    year: "2022",
    kind: "edu",
    title: "Bangku Kuliah",
    place: "Nama kampus, Jurusanmu",
    story: "Algoritma, basis data, dan rekayasa web menjadi fondasi baru. Saya mulai membangun proyek kecil di luar tugas, sebagian besar karena penasaran bagaimana sebuah situs bisa terasa hidup.",
    quote: "Teori memberi nama pada hal-hal yang sudah saya kerjakan.",
    tags: ["Algoritma", "Basis data", "Pengembangan web"],
  },
  {
    year: "2024",
    kind: "journey",
    title: "Proyek Pertama",
    place: "Freelance",
    story: "Klien pertama meminta situs untuk usahanya. Saya belajar membaca kebutuhan, menetapkan tenggat, dan menjaga hasil akhir tetap sederhana supaya benar-benar dipakai.",
    quote: "Desain yang baik terasa mudah, dan itu butuh kerja keras.",
    tags: ["React", "Tailwind CSS", "Freelance"],
  },
  {
    year: "Sekarang",
    kind: "journey",
    title: "Menyatukan Semuanya",
    place: "Jakarta",
    story: "Kode, kamera, dan clipper ternyata punya kesamaan: ketelitian dan rasa. Saya terus belajar, mengerjakan proyek baru, dan terbuka untuk kolaborasi.",
    quote: "Bab berikutnya belum ditulis.",
    tags: ["Kode", "Kamera", "Klipper"],
  },
];

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "edu", label: "Pendidikan" },
  { id: "journey", label: "Perjalanan" },
];
const KIND_LABEL = { edu: "Pendidikan", journey: "Perjalanan" };

const Chars = ({ text, cls }) =>
  text.split("").map((ch, i) => (
    <span key={i} className={`${cls} inline-block`}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

export default function JourneyEducation() {
  const root = useRef(null);
  const [filter, setFilter] = useState("all");
  const list = CHAPTERS.filter((c) => filter === "all" || c.kind === filter);

  useGSAP(
    () => {
      const q = (s) => root.current.querySelector(s);
      const items = gsap.utils.toArray(".jn-item");
      const yearEl = q(".jn-year");
      const countEl = q(".jn-count");
      const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Bab yang sedang dibaca: tahun di panel kiri berganti, bab lain meredup (tanpa re-render) */
      let current = -1;
      const setActive = (i) => {
        if (i === current) return;
        current = i;
        items.forEach((el, k) => (el.dataset.active = String(k === i)));
        yearEl.textContent = list[i].year;
        countEl.textContent = i + 1;
        if (!calm()) gsap.fromTo(yearEl, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true });
      };
      setActive(0);
      items.forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 60%", onToggle: (self) => self.isActive && setActive(i) });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".jn-title-char", { yPercent: 115, rotate: 10, transformOrigin: "0% 100%", duration: 1.1, stagger: 0.04, ease: "power4.out", scrollTrigger: { trigger: ".jn-head", start: "top 80%", once: true } });
        gsap.from(".jn-intro", { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out", scrollTrigger: { trigger: ".jn-head", start: "top 80%", once: true } });

        // Garis perjalanan terisi mengikuti scroll
        gsap.fromTo(".jn-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".jn-list", start: "top 60%", end: "bottom 60%", scrub: true } });

        // Tiap bab masuk pelan, titiknya muncul lebih dulu
        items.forEach((el) => {
          const st = { trigger: el, start: "top 85%", once: true };
          gsap.from(el.querySelector(".jn-dot"), { scale: 0, duration: 0.5, ease: "back.out(2.5)", scrollTrigger: st });
          gsap.from(el.querySelector(".jn-card"), { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: st });
        });
      });
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <section id="journey" ref={root} className="relative overflow-clip bg-[#37353E] px-6 py-20 text-[#D3DAD9] md:px-12 md:py-28 lg:px-20">
      <div className="pointer-events-none absolute -right-40 top-1/3 h-112 w-md rounded-full bg-[#715A5A]/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 md:grid-cols-12 md:gap-16">
        {/* Kiri: judul, filter, dan tahun bab yang sedang dibaca (menempel di desktop) */}
        <div className="jn-head md:col-span-5 md:sticky md:top-24 md:self-start">
          <h2 className={`${DISPLAY_FONT} text-5xl font-extrabold leading-[1] tracking-[-0.03em] md:text-6xl xl:text-7xl`}>
            {["Journey", "& Education"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <Chars text={line} cls="jn-title-char" />
              </span>
            ))}
          </h2>
          <p className={`jn-intro ${SERIF_FONT} mt-4 max-w-sm text-2xl italic leading-snug text-[#D3DAD9]/85 md:text-3xl`}>Perjalanan dari balik lensa, kursi barber, sampai editor kode.</p>

          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter cerita">
            {FILTERS.map((f) => {
              const n = f.id === "all" ? CHAPTERS.length : CHAPTERS.filter((c) => c.kind === f.id).length;
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9] ${on ? "border-[#D3DAD9] bg-[#D3DAD9] text-[#37353E]" : "border-[#D3DAD9]/30 hover:bg-[#715A5A]"}`}
                >
                  {f.label} <span className="tabular-nums opacity-60">{n}</span>
                </button>
              );
            })}
          </div>

          {/* Tahun besar di dalam sudut bidik viewfinder */}
          <div aria-hidden="true" className="relative mt-10 hidden p-8 md:block">
            <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[#D3DAD9]/50" />
            <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-[#D3DAD9]/50" />
            <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-[#D3DAD9]/50" />
            <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[#D3DAD9]/50" />
            <p className={`jn-year ${DISPLAY_FONT} text-6xl font-extrabold leading-none tracking-[-0.03em] lg:text-7xl`}>{list[0].year}</p>
            <p className="mt-3 text-sm text-[#D3DAD9]/60">
              Bab <span className="jn-count tabular-nums">1</span> dari {list.length}
            </p>
          </div>
        </div>

        {/* Kanan: bab-bab cerita di sepanjang garis perjalanan */}
        <ol className="jn-list relative md:col-span-7">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-[2px] bg-[#D3DAD9]/15">
            <div className="jn-fill h-full origin-top bg-[#D3DAD9]" />
          </div>

          {list.map((c, ) => (
            <li key={c.title} data-active="false" className="jn-item group relative pb-12 pl-8 opacity-60 transition-opacity duration-500 last:pb-0 data-[active=true]:opacity-100 md:pb-20 md:pl-12">
              <span aria-hidden="true" className="jn-dot absolute left-0 top-1.5 size-4 rounded-full border-2 border-[#D3DAD9] bg-[#37353E] transition-colors duration-300 group-data-[active=true]:bg-[#D3DAD9]" />

              <article className="jn-card">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.kind === "edu" ? "bg-[#D3DAD9] text-[#37353E]" : "border border-[#D3DAD9]/40"}`}>{KIND_LABEL[c.kind]}</span>
                  <span className={`${SERIF_FONT} text-xl italic text-[#D3DAD9]/75`}>
                    {c.year}, {c.place}
                  </span>
                </div>

                <h3 className={`${DISPLAY_FONT} mt-4 text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] md:text-4xl`}>{c.title}</h3>
                <p className="mt-4 max-w-prose text-lg leading-relaxed text-[#D3DAD9]/80">{c.story}</p>
                <p className={`${SERIF_FONT} mt-5 max-w-prose border-l-2 border-[#715A5A] pl-4 text-2xl italic leading-snug text-[#D3DAD9]`}>{c.quote}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li key={t} className="rounded-full bg-[#715A5A]/35 px-3 py-1 text-sm text-[#D3DAD9]/90">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}