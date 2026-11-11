import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Font (tambahkan di CSS global bila belum):
   @import url("https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&display=swap"); */
const DISPLAY_FONT = "font-['Anton',Impact,'Arial_Narrow',sans-serif]";
const SERIF_FONT = "font-['Instrument_Serif',Georgia,serif]";

/* ============ DATA: ganti sesuai kemampuanmu (angka = 0-100) ============ */
const GROUPS = [
  {
    name: "Frontend",
    note: "Antarmuka yang terasa hidup.",
    items: [
      ["React", 90],
      ["Tailwind CSS", 92],
      ["JavaScript", 88],
      ["GSAP", 80],
      ["Next.js", 70],
      ["HTML & CSS", 95],
    ],
  },
  {
    name: "Backend",
    note: "Mesin di balik layar.",
    items: [
      ["Node.js", 70],
      ["Express", 68],
      ["REST API", 72],
      ["MySQL", 65],
      ["Firebase", 60],
      ["MongoDB", 55],
    ],
  },
  {
    name: "Kreatif",
    note: "Sudut pandang dari balik lensa.",
    items: [
      ["Fotografi", 85],
      ["Figma", 82],
      ["UI Design", 80],
      ["Lightroom", 78],
      ["Photoshop", 70],
      ["Motion", 62],
    ],
  },
  {
    name: "Workflow",
    note: "Cara saya bekerja rapi.",
    items: [
      ["VS Code", 95],
      ["Git & GitHub", 85],
      ["Vite", 80],
      ["Vercel", 75],
      ["Postman", 70],
      ["Linux", 55],
    ],
  },
];

const levelWord = (v) => (v >= 85 ? "mahir" : v >= 70 ? "nyaman" : v >= 55 ? "menengah" : "belajar");

const Chars = ({ text, cls }) =>
  text.split("").map((ch, i) => (
    <span key={i} className={`${cls} inline-block`}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));

export default function TechStack() {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const group = GROUPS[active];

  /* Judul dan pengantar masuk sekali saja */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: ".ts-head", start: "top 80%", once: true };
        gsap.from(".ts-title-char", { yPercent: 115, rotate: 10, transformOrigin: "0% 100%", duration: 1.1, stagger: 0.04, ease: "power4.out", scrollTrigger: trigger });
        gsap.from(".ts-intro", { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out", scrollTrigger: trigger });
      });
    },
    { scope: root },
  );

  /* Setiap ganti kategori: baris muncul bergantian dan bar terisi */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".ts-panel", start: "top 85%", once: true };
        gsap.from(".ts-head-note", { y: 14, opacity: 0, duration: 0.5, ease: "power3.out", scrollTrigger: st });
        gsap.from(".ts-row", { y: 16, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power3.out", scrollTrigger: st });
        root.current.querySelectorAll(".ts-bar").forEach((bar, i) => {
          gsap.fromTo(bar, { width: "0%" }, { width: `${bar.dataset.v}%`, duration: 0.9, delay: 0.1 + i * 0.05, ease: "power3.out", scrollTrigger: st });
        });
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  const onKeyDown = (e) => {
    const move = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!move) return;
    e.preventDefault();
    const next = (active + move + GROUPS.length) % GROUPS.length;
    setActive(next);
    root.current.querySelector(`#ts-tab-${next}`)?.focus();
  };

  return (
    <section id="skills" ref={root} className="relative overflow-clip bg-[#44444E] px-6 py-20 text-[#D3DAD9] md:px-12 md:py-28 lg:px-20">
      {/* Glow latar */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-112 w-md rounded-full bg-[#715A5A]/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-112 w-md rounded-full bg-[#D3DAD9]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="ts-head mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="text-6xl font-extrabold leading-[0.95] tracking-tight md:text-7xl xl:text-8xl">
            {["Tech Stack", "& Skills"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <Chars text={line} cls="ts-title-char" />
              </span>
            ))}
          </h2>
          <p className={`ts-intro ${SERIF_FONT} max-w-sm text-2xl italic leading-snug text-[#D3DAD9]/85 md:text-3xl`}>
            Alat yang saya pakai untuk membangun, merancang, dan menangkap ide.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          {/* Pemilih kategori: berderet di HP, bertumpuk di desktop */}
          <div
            role="tablist"
            aria-label="Kategori skill"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:col-span-4 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {GROUPS.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.name}
                  id={`ts-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="ts-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative shrink-0 rounded-full border px-5 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9] md:rounded-md md:border-0 md:px-0 md:py-3 md:pl-6 ${
                    on ? "border-[#D3DAD9] bg-[#D3DAD9] text-[#37353E] md:bg-transparent md:text-[#D3DAD9]" : "border-[#D3DAD9]/30 text-[#D3DAD9]/60 hover:text-[#D3DAD9] md:text-[#D3DAD9]/40"
                  }`}
                >
                  {/* Penanda kategori aktif (desktop) */}
                  <span aria-hidden="true" className={`absolute left-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-full bg-[#715A5A] transition-opacity md:block ${on ? "opacity-100" : "opacity-0"}`} />
                  <span className={`${DISPLAY_FONT} block text-xl uppercase leading-none tracking-tight md:text-5xl xl:text-6xl`}>{g.name}</span>
                  <span className={`${SERIF_FONT} mt-1 hidden text-lg italic md:block ${on ? "text-[#D3DAD9]/75" : "text-transparent"}`}>{g.items.length} alat</span>
                </button>
              );
            })}
          </div>

          {/* Panel isi kategori, dengan sudut bidik viewfinder */}
          <div id="ts-panel" role="tabpanel" aria-labelledby={`ts-tab-${active}`} className="ts-panel relative bg-[#37353E] p-6 md:col-span-8 md:p-10">
            <span aria-hidden="true" className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-[#D3DAD9]/50" />
            <span aria-hidden="true" className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-[#D3DAD9]/50" />
            <span aria-hidden="true" className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#D3DAD9]/50" />
            <span aria-hidden="true" className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#D3DAD9]/50" />

            <p className={`ts-head-note ${SERIF_FONT} mb-8 text-2xl italic text-[#D3DAD9]/80 md:mb-10 md:text-3xl`}>{group.note}</p>

            <ul className="grid gap-x-12 gap-y-7 md:grid-cols-2">
              {group.items.map(([name, v]) => (
                <li key={name} className="ts-row">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-lg font-semibold md:text-xl">{name}</span>
                    <span className={`${SERIF_FONT} text-lg italic text-[#D3DAD9]/70`}>{levelWord(v)}</span>
                  </div>

                  {/* Skala tick seperti exposure meter, dengan penanda level */}
                  <div
                    className="relative mt-2 h-2.5 [background-image:repeating-linear-gradient(90deg,rgba(211,218,217,0.28)_0_1px,transparent_1px_10%)]"
                    role="img"
                    aria-label={`${name}: ${levelWord(v)}`}
                  >
                    <div className="absolute inset-x-0 top-1/2 h-px bg-[#D3DAD9]/20" />
                    <div data-v={v} style={{ width: `${v}%` }} className="ts-bar absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-[#D3DAD9]">
                      <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#715A5A] ring-1 ring-[#D3DAD9]" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}