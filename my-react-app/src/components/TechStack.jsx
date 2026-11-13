import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Font (tambahkan di CSS global bila belum):
   @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Instrument+Serif:ital@0;1&display=swap"); */
const DISPLAY = "font-['Bricolage_Grotesque',system-ui,sans-serif]";
const SERIF = "font-['Instrument_Serif',Georgia,serif]";
const CIRC = 2 * Math.PI * 26; // keliling cincin (r = 26)

/* ============ DATA: ganti sesuai kemampuanmu (angka = 0-100) ============ */
const GROUPS = [
  { name: "Frontend", note: "Antarmuka yang terasa hidup.", items: [["React", 90], ["Tailwind CSS", 92], ["JavaScript", 88], ["GSAP", 80], ["Next.js", 70], ["HTML & CSS", 95]] },
  { name: "Backend", note: "Mesin di balik layar.", items: [["Node.js", 70], ["Express", 68], ["REST API", 72], ["MySQL", 65], ["Firebase", 60], ["MongoDB", 55]] },
  { name: "Kreatif", note: "Sudut pandang dari balik lensa.", items: [["Fotografi", 85], ["Figma", 82], ["UI Design", 80], ["Lightroom", 78], ["Photoshop", 70], ["Motion", 62]] },
  { name: "Workflow", note: "Cara saya bekerja rapi.", items: [["VS Code", 95], ["Git & GitHub", 85], ["Vite", 80], ["Vercel", 75], ["Postman", 70], ["Linux", 55]] },
];

const levelWord = (v) => (v >= 85 ? "mahir" : v >= 70 ? "nyaman" : v >= 55 ? "menengah" : "belajar");

// Cahaya lembut mengikuti kursor di dalam tiap kartu
const spot = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
};

export default function TechStack() {
  const root = useRef(null);
  const first = useRef(true);
  const [active, setActive] = useState(0);
  const group = GROUPS[active];

  /* Judul masuk sekali */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".ts-head", start: "top 82%", once: true };
        gsap.from(".ts-line", { yPercent: 115, duration: 1.1, stagger: 0.12, ease: "power4.out", scrollTrigger: st });
        gsap.from(".ts-intro", { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out", scrollTrigger: st });
      });
    },
    { scope: root },
  );

  /* Penanda tab meluncur ke tab aktif (dipisah supaya tidak ikut di-revert) */
  useGSAP(
    () => {
      const place = (d) => {
        const b = root.current.querySelector(`#ts-tab-${active}`);
        gsap.to(".ts-ind", { x: b.offsetLeft, width: b.offsetWidth, duration: d, ease: "power3.out" });
      };
      place(first.current ? 0 : 0.55);
      first.current = false;
      const onResize = () => place(0);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root, dependencies: [active] },
  );

  /* Tiap ganti kategori: kartu masuk bergantian, cincin terisi, angka menghitung naik */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".ts-grid", start: "top 88%", once: true };
        gsap.from(".ts-note", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st });
        gsap.from(".ts-tile", { y: 28, opacity: 0, scale: 0.96, duration: 0.7, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: st });
        root.current.querySelectorAll(".ts-tile").forEach((t, i) => {
          const v = Number(t.dataset.v);
          const num = t.querySelector(".ts-num");
          const o = { n: 0 };
          const d = { duration: 1.2, delay: 0.15 + i * 0.06, ease: "power3.out", scrollTrigger: st };
          gsap.fromTo(t.querySelector(".ts-ring"), { strokeDashoffset: CIRC }, { strokeDashoffset: CIRC * (1 - v / 100), ...d });
          gsap.to(o, { n: v, ...d, onUpdate: () => (num.textContent = Math.round(o.n)) });
        });
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  const onKeyDown = (e) => {
    const move = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!move) return;
    e.preventDefault();
    const next = (active + move + GROUPS.length) % GROUPS.length;
    setActive(next);
    root.current.querySelector(`#ts-tab-${next}`)?.focus();
  };

  return (
    <section id="skills" ref={root} className="relative overflow-clip bg-[#44444E] px-6 py-20 text-[#D3DAD9] md:px-12 md:py-28 lg:px-20">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-112 w-md rounded-full bg-[#715A5A]/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-112 w-md rounded-full bg-[#D3DAD9]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="ts-head mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className={`${DISPLAY} text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl xl:text-8xl`}>
            {["Tech Stack", "& Skills"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span className="ts-line block">{line}</span>
              </span>
            ))}
          </h2>
        </header>

        {/* Pemilih kategori dengan penanda yang meluncur */}
        <div
          role="tablist"
          aria-label="Kategori skill"
          onKeyDown={onKeyDown}
          className="relative mb-8 inline-flex max-w-full overflow-x-auto rounded-full border border-[#D3DAD9]/15 bg-[#37353E]/60 p-1.5 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span aria-hidden="true" className="ts-ind absolute bottom-1.5 left-0 top-1.5 rounded-full bg-[#D3DAD9]" />
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
                className={`${DISPLAY} relative z-10 shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9] md:px-7 md:text-base ${on ? "text-[#37353E]" : "text-[#D3DAD9]/70 hover:text-[#D3DAD9]"}`}
              >
                {g.name} <span className="ml-1 tabular-nums opacity-60">{g.items.length}</span>
              </button>
            );
          })}
        </div>

        <div id="ts-panel" role="tabpanel" aria-labelledby={`ts-tab-${active}`}>
          <p className={`ts-note ${SERIF} mb-8 text-3xl italic text-[#D3DAD9]/85 md:text-4xl`}>{group.note}</p>

          <ul className="ts-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(([name, v]) => (
              <li
                key={`${group.name}-${name}`}
                data-v={v}
                onPointerMove={spot}
                className="ts-tile group relative overflow-hidden rounded-3xl border border-[#D3DAD9]/10 bg-[#37353E]/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#D3DAD9]/40"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(240px_circle_at_var(--x,50%)_var(--y,50%),rgba(211,218,217,0.14),transparent_70%)] group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="relative size-16 shrink-0" aria-hidden="true">
                    <svg viewBox="0 0 64 64" className="size-full -rotate-90" fill="none">
                      <circle cx="32" cy="32" r="26" stroke="#D3DAD9" strokeOpacity=".15" strokeWidth="4" />
                      <circle className="ts-ring" cx="32" cy="32" r="26" stroke="#D3DAD9" strokeWidth="4" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - v / 100)} />
                    </svg>
                    <span className={`ts-num absolute inset-0 grid place-items-center text-sm font-bold tabular-nums ${DISPLAY}`}>{v}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`${DISPLAY} truncate text-xl font-semibold`}>{name}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-[#715A5A]/40 px-3 py-0.5 text-sm text-[#D3DAD9]/90">{levelWord(v)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}