import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Font (tambahkan di CSS global bila belum):
   @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"); */
const DISPLAY = "font-['Sora',system-ui,sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";

/*
  KONSEP: daftar editorial. Empat kategori sebagai baris yang dipisah garis tipis, tiap baris berisi
  nama kategori di kiri dan teknologinya di kanan. Semua logo dibuat monokrom putih supaya selaras
  dengan palet, lalu menyala dengan warna aslinya saat di-hover. Saat satu baris di-hover,
  baris lain meredup dan garis rose muncul di tepi kirinya.

  PALET: #2C2C2C latar · #F3F4F4 teks · #E58FA8 aksen kecil (garis, angka) · #612D53 cahaya latar
*/

/* Logo diambil dari Devicon (CDN), tidak perlu install paket apa pun.
   s = nama ikon di Devicon, v = varian (default "original"),
   mono = logo hitam yang perlu dibalik jadi putih di latar gelap,
   ic = ikon bawaan (untuk skill yang tidak punya logo brand). */
const dev = (s, v = "original") => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s}/${s}-${v}.svg`;

/* ============ DATA: ganti sesuai teknologi yang kamu pakai ============ */
const GROUPS = [
  { name: "Frontend", note: "Antarmuka yang terasa hidup dan responsif.", items: [
    { n: "React", s: "react" }, { n: "Next.js", s: "nextjs", mono: true }, { n: "JavaScript", s: "javascript" },
    { n: "Tailwind CSS", s: "tailwindcss" }, { n: "HTML", s: "html5" }, { n: "CSS", s: "css3" },
  ] },
  { name: "Backend", note: "Mesin di balik layar yang menjaga semuanya berjalan.", items: [
    { n: "Node.js", s: "nodejs" }, { n: "Express", s: "express", mono: true }, { n: "REST API", ic: "api" },
    { n: "MySQL", s: "mysql" }, { n: "MongoDB", s: "mongodb" }, { n: "Firebase", s: "firebase" },
  ] },
  { name: "Kreatif", note: "Sudut pandang fotografer dalam setiap desain.", items: [
    { n: "Fotografi", ic: "camera" }, { n: "Figma", s: "figma" }, { n: "UI Design", ic: "layout" },
    { n: "Lightroom", s: "lightroom" }, { n: "Photoshop", s: "photoshop" }, { n: "Motion", ic: "motion" },
  ] },
  { name: "Workflow", note: "Cara kerja yang rapi dari ide sampai rilis.", items: [
    { n: "VS Code", s: "vscode" }, { n: "Git", s: "git" }, { n: "GitHub", s: "github", mono: true },
    { n: "Vite", s: "vitejs" }, { n: "Vercel", s: "vercel", mono: true }, { n: "Postman", s: "postman" },
  ] },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

const ICONS = {
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  layout: <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 9h17M9 9v11" /></>,
  motion: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></>,
  api: <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" />,
};

/* Logo: monokrom putih, berwarna asli saat chip di-hover. */
function Logo({ item }) {
  const [bad, setBad] = useState(false);
  if (item.ic) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F3F4F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-full opacity-80 transition-opacity duration-300 group-hover/chip:opacity-100">
        {ICONS[item.ic]}
      </svg>
    );
  }
  if (bad) return <span className={`${DISPLAY} grid size-full place-items-center text-lg font-bold`}>{item.n[0]}</span>;
  return (
    <img
      src={dev(item.s, item.v)}
      alt=""
      loading="lazy"
      draggable="false"
      onError={() => setBad(true)}
      className={`size-full object-contain transition-[filter,opacity] duration-300 ${
        item.mono
          ? "[filter:brightness(0)_invert(1)] opacity-80 group-hover/chip:opacity-100"
          : "[filter:brightness(0)_invert(1)] opacity-80 group-hover/chip:[filter:none] group-hover/chip:opacity-100"
      }`}
    />
  );
}

export default function TechStack() {
  const root = useRef(null);

  /* Judul, hitungan angka, lalu tiap baris: garis menarik dari kiri, nama naik dari balik mask, chip muncul berurutan */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hs = { trigger: ".ts-head", start: "top 82%", once: true };
        gsap.from(".ts-line", { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", scrollTrigger: hs });
        gsap.from(".ts-intro", { y: 16, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out", scrollTrigger: hs });

        const n = { v: 0 };
        gsap.to(n, {
          v: TOTAL, duration: 1.4, ease: "power2.out", scrollTrigger: hs,
          onUpdate: () => { root.current.querySelector(".ts-count").textContent = Math.round(n.v); },
        });

        gsap.utils.toArray(".ts-row").forEach((row) => {
          gsap
            .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: row, start: "top 85%", once: true } })
            .from(row.querySelector(".ts-rule"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: "power3.inOut" })
            .from(row.querySelector(".ts-name"), { yPercent: 110, duration: 0.8 }, 0.15)
            .from(row.querySelector(".ts-note"), { y: 12, opacity: 0, duration: 0.7 }, 0.3)
            .from(row.querySelectorAll(".ts-chip"), { y: 16, opacity: 0, duration: 0.6, stagger: 0.05 }, 0.3);
        });

        gsap.from(".ts-rule-end", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: ".ts-rule-end", start: "top 95%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section id="skills" ref={root} className={`${BODY} relative overflow-clip bg-[#2C2C2C] px-6 py-24 text-[#F3F4F4] md:px-12 md:py-32 lg:px-20`}>
      {/* Cahaya latar yang sangat halus */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-24 h-112 w-md rounded-full bg-[#612D53]/35 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="ts-head mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <h2 className={`${DISPLAY} text-5xl font-bold leading-[1] tracking-[-0.04em] md:text-7xl`}>
            {["Tech Stack", "& Skills"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span className="ts-line block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="ts-intro max-w-xs text-base leading-relaxed text-[#F3F4F4]/75 md:text-right">
            <span className={`${DISPLAY} ts-count font-semibold text-[#E58FA8]`}>{TOTAL}</span> teknologi dan alat yang saya pakai untuk membangun produk dari ide sampai rilis.
          </p>
        </header>

        {/* Daftar kategori: baris lain meredup saat satu baris di-hover */}
        <ul className="group/list">
          {GROUPS.map((g) => (
            <li
              key={g.name}
              className="ts-row group/row relative transition-opacity duration-300 md:group-hover/list:opacity-45 md:hover:!opacity-100"
            >
              <span aria-hidden="true" className="ts-rule absolute inset-x-0 top-0 block h-px bg-[#F3F4F4]/15" />
              {/* Garis rose di tepi kiri saat baris di-hover */}
              <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-0.5 origin-top scale-y-0 bg-[#E58FA8] transition-transform duration-500 md:block md:group-hover/row:scale-y-100" />

              <div className="grid gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14 md:pl-8">
                <div className="md:col-span-4">
                  <h3 className={`${DISPLAY} flex items-baseline gap-3 text-3xl font-semibold tracking-[-0.03em] transition-transform duration-500 md:text-4xl md:group-hover/row:translate-x-1`}>
                    <span className="block overflow-hidden pb-1">
                      <span className="ts-name block">{g.name}</span>
                    </span>
                    <span className="text-sm font-normal tabular-nums text-[#F3F4F4]/45">{g.items.length}</span>
                  </h3>
                  <p className="ts-note mt-3 max-w-xs text-base leading-relaxed text-[#F3F4F4]/70">{g.note}</p>
                </div>

                <ul className="flex flex-wrap content-start gap-3 md:col-span-8">
                  {g.items.map((item) => (
                    <li
                      key={item.n}
                      className="ts-chip group/chip inline-flex items-center gap-3 rounded-xl border border-[#F3F4F4]/10 bg-[#F3F4F4]/[0.03] py-2.5 pl-3 pr-4 transition-colors duration-300 hover:border-[#E58FA8]/50 hover:bg-[#F3F4F4]/[0.07]"
                    >
                      <span className="size-7 shrink-0">
                        <Logo item={item} />
                      </span>
                      <span className="text-sm font-medium text-[#F3F4F4]/85">{item.n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="ts-rule-end block h-px bg-[#F3F4F4]/15" />
      </div>
    </section>
  );
}