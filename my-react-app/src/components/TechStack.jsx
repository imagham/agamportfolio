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
  PALET
  #2C2C2C latar · #F3F4F4 teks · #853953 rose (bidang: tab aktif) · #612D53 plum (cahaya latar)
  #E58FA8 rose muda (garis dan aksen di atas gelap). Permukaan kartu = putih transparan di atas latar.
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

const ALL = GROUPS.flatMap((g) => g.items);

const ICONS = {
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  layout: <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 9h17M9 9v11" /></>,
  motion: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></>,
  api: <path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5" />,
};

function Logo({ item }) {
  const [bad, setBad] = useState(false);
  if (item.ic) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F3F4F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-full p-1">
        {ICONS[item.ic]}
      </svg>
    );
  }
  if (bad) return <span className={`${DISPLAY} grid size-full place-items-center text-2xl font-bold`}>{item.n[0]}</span>;
  return (
    <img
      src={dev(item.s, item.v)}
      alt=""
      loading="lazy"
      draggable="false"
      onError={() => setBad(true)}
      className={`size-full object-contain ${item.mono ? "brightness-0 invert" : ""}`}
    />
  );
}

/* Kartu: cahaya mengikuti kursor + miring 3D tipis (hanya untuk mouse) */
function Tile({ item }) {
  const el = useRef(null);

  const move = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = el.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.current.style.setProperty("--mx", `${px * 100}%`);
    el.current.style.setProperty("--my", `${py * 100}%`);
    gsap.to(el.current, { rotationY: (px - 0.5) * 14, rotationX: (0.5 - py) * 14, transformPerspective: 800, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };
  const leave = () => gsap.to(el.current, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });

  return (
    <li
      ref={el}
      onPointerMove={move}
      onPointerLeave={leave}
      className="ts-tile group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-2xl border border-[#F3F4F4]/10 bg-[#F3F4F4]/[0.04] p-5 transition-colors duration-300 hover:border-[#E58FA8]/45 md:min-h-40"
    >
      {/* Cahaya kursor */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(229,143,168,0.22), transparent 70%)" }}
      />
      <div className="ts-logo relative size-12 md:size-14">
        <div className="size-full transition-transform duration-300 group-hover:scale-110">
          <Logo item={item} />
        </div>
      </div>
      <span className={`${DISPLAY} relative text-base font-semibold tracking-tight md:text-lg`}>{item.n}</span>
    </li>
  );
}

export default function TechStack() {
  const root = useRef(null);
  const first = useRef(true);
  const [active, setActive] = useState(0);
  const group = GROUPS[active];

  /* Sekali: judul, hitungan angka, cahaya latar parallax, marquee yang ikut kecepatan scroll */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".ts-head", start: "top 82%", once: true };
        gsap.from(".ts-line", { yPercent: 110, duration: 1, stagger: 0.12, ease: "power4.out", scrollTrigger: st });
        gsap.from(".ts-intro", { y: 16, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out", scrollTrigger: st });

        const n = { v: 0 };
        gsap.to(n, {
          v: ALL.length, duration: 1.4, ease: "power2.out", scrollTrigger: st,
          onUpdate: () => { root.current.querySelector(".ts-count").textContent = Math.round(n.v); },
        });

        gsap.to(".ts-glow-a", { yPercent: -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to(".ts-glow-b", { yPercent: 35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

        // Marquee berjalan terus; makin kencang saat scroll cepat, lalu kembali pelan
        const loop = gsap.to(".ts-track", { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
        ScrollTrigger.create({
          trigger: root.current, start: "top bottom", end: "bottom top",
          onUpdate: (self) => {
            loop.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 350, 5));
            gsap.to(loop, { timeScale: 1, duration: 0.9, overwrite: true });
          },
        });
      });
    },
    { scope: root },
  );

  /* Pil penanda tab: meluncur ke tab aktif */
  useGSAP(
    () => {
      const place = (instant) => {
        const tab = root.current.querySelector(`#ts-tab-${active}`);
        if (!tab) return;
        gsap.to(".ts-pill", { x: tab.offsetLeft, width: tab.offsetWidth, duration: instant ? 0 : 0.55, ease: "power3.out" });
      };
      place(first.current);
      first.current = false;
      const onResize = () => place(true);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root, dependencies: [active] },
  );

  /* Tiap ganti kategori: judul kategori naik, kartu bangkit satu per satu, logo melayang pelan */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".ts-grid", start: "top 88%", once: true };
        gsap.from(".ts-gname", { yPercent: 110, duration: 0.8, ease: "power4.out", scrollTrigger: st });
        gsap.from(".ts-note", { y: 14, opacity: 0, duration: 0.6, delay: 0.1, ease: "power3.out", scrollTrigger: st });
        gsap.from(".ts-tile", {
          y: 50, opacity: 0, rotationX: -40, transformPerspective: 800, transformOrigin: "50% 100%",
          duration: 0.9, stagger: 0.07, ease: "power3.out", scrollTrigger: st,
        });
        gsap.utils.toArray(".ts-logo").forEach((l) => {
          gsap.to(l, { y: -6, duration: 2 + Math.random() * 1.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: Math.random() * 1.5 });
        });
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );

  const onKeyDown = (e) => {
    const move = ["ArrowRight", "ArrowDown"].includes(e.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(e.key) ? -1 : 0;
    if (!move) return;
    e.preventDefault();
    const next = (active + move + GROUPS.length) % GROUPS.length;
    setActive(next);
    root.current.querySelector(`#ts-tab-${next}`)?.focus();
  };

  return (
    <section id="skills" ref={root} className={`${BODY} relative overflow-clip bg-[#2C2C2C] py-20 text-[#F3F4F4] md:py-28`}>
      {/* Cahaya latar */}
      <div aria-hidden="true" className="ts-glow-a pointer-events-none absolute -left-40 top-1/4 h-112 w-md rounded-full bg-[#612D53]/45 blur-[120px]" />
      <div aria-hidden="true" className="ts-glow-b pointer-events-none absolute -right-40 bottom-0 h-112 w-md rounded-full bg-[#853953]/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <header className="ts-head mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className={`${DISPLAY} text-5xl font-bold leading-none tracking-[-0.04em] md:text-7xl xl:text-8xl`}>
            {["Tech Stack", "& Skills"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span className="ts-line block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="ts-intro max-w-xs text-base leading-relaxed text-[#F3F4F4]/70 md:text-right">
            <span className={`${DISPLAY} ts-count text-[#E58FA8] font-semibold`}>{ALL.length}</span> teknologi dan alat yang saya pakai untuk membangun produk dari ide sampai rilis.
          </p>
        </header>
      </div>

      {/* Marquee semua teknologi */}
      <div aria-hidden="true" className="mb-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:mb-16">
        <div className="ts-track flex w-max gap-3 pr-3">
          {[...ALL, ...ALL].map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#F3F4F4]/10 bg-[#F3F4F4]/[0.04] py-2 pl-2.5 pr-5 text-sm font-medium text-[#F3F4F4]/80">
              <span className="size-6"><Logo item={item} /></span>
              {item.n}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Pemilih kategori: pil rose meluncur ke tab aktif */}
        <div className="mb-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div role="tablist" aria-label="Kategori skill" onKeyDown={onKeyDown} className="relative inline-flex rounded-full border border-[#F3F4F4]/12 bg-[#F3F4F4]/[0.04] p-1.5">
            <span aria-hidden="true" className="ts-pill absolute bottom-1.5 left-0 top-1.5 w-0 rounded-full bg-[#853953]" />
            {GROUPS.map((g, i) => (
              <button
                key={g.name}
                id={`ts-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="ts-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
                className={`${DISPLAY} relative z-10 shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E58FA8] md:px-7 md:text-base ${
                  i === active ? "text-[#F3F4F4]" : "text-[#F3F4F4]/60 hover:text-[#F3F4F4]"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div id="ts-panel" role="tabpanel" aria-labelledby={`ts-tab-${active}`} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Judul kategori */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h3 className={`${DISPLAY} text-4xl font-bold tracking-[-0.03em] md:text-5xl`}>
                <span className="block overflow-hidden pb-1">
                  <span className="ts-gname block">{group.name}</span>
                </span>
              </h3>
              <p className="ts-note mt-4 max-w-xs text-lg leading-relaxed text-[#F3F4F4]/75">{group.note}</p>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-[#F3F4F4]/60">
                <span aria-hidden="true" className="size-2 rounded-full bg-[#E58FA8]" />
                {group.items.length} alat di kategori ini
              </p>
            </div>
          </div>

          {/* Kartu */}
          <ul className="ts-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-8">
            {group.items.map((item) => (
              <Tile key={`${group.name}-${item.n}`} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}