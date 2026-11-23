import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DISPLAY = "font-['Bricolage_Grotesque',system-ui,sans-serif]";

/*
  PALET
  Section: charcoal #2C2C2C (samakan BG.projects di landing page).
  Tiga panel memakai warna paletmu langsung: code = #1F1F1F (turunan charcoal), photo = plum #612D53, barber = rose #853953.
  Teks selalu #F3F4F4 (di atas plum 9.5, di atas rose 7.0). Rose muda #E58FA8 untuk aksen kecil di atas gelap.
*/

/* ============ DATA: ganti dengan karya aslimu ============
   Isi `image` (dan `before` untuk barbering) dengan path gambar kalau sudah ada. */
const CATEGORIES = [
  {
    id: "code",
    index: "01",
    title: "Software Engineering",
    short: "Code",
    tagline: "Aplikasi yang dirakit baris demi baris.",
    bg: "#1F1F1F",
    projects: [
      {
        title: "Cutline",
        kind: "Web app",
        year: "2026",
        desc: "Sistem antrean dan booking untuk barbershop. Pelanggan memilih kapster dan jam, kapster melihat antrean secara langsung.",
        tags: ["React", "Node.js", "PostgreSQL"],
        a: "#853953",
        b: "#E58FA8",
        links: [
          { label: "Lihat situs", href: "#" },
          { label: "Lihat kode", href: "#" },
        ],
      },
      {
        title: "Orbit",
        kind: "Dashboard",
        year: "2025",
        desc: "Dashboard analitik yang merangkum data penjualan harian dalam satu layar dengan grafik interaktif.",
        tags: ["React", "D3", "Express"],
        a: "#612D53",
        b: "#E58FA8",
        links: [
          { label: "Lihat situs", href: "#" },
          { label: "Lihat kode", href: "#" },
        ],
      },
      {
        title: "Parsel",
        kind: "Mobile app",
        year: "2024",
        desc: "Aplikasi pelacak pengiriman dengan status real-time dan notifikasi saat paket berpindah tahap.",
        tags: ["React Native", "Firebase"],
        a: "#2C2C2C",
        b: "#853953",
        links: [
          { label: "Lihat situs", href: "#" },
          { label: "Lihat kode", href: "#" },
        ],
      },
    ],
  },
  {
    id: "photo",
    index: "02",
    title: "Photography",
    short: "Foto",
    tagline: "Cahaya, momen, dan sudut yang tepat.",
    bg: "#612D53",
    projects: [
      {
        title: "Jakarta Pagi",
        kind: "Street series",
        year: "2026",
        desc: "Seri foto jalanan tentang kota sebelum ramai: tukang sayur, kabut tipis, dan lampu yang belum padam.",
        tags: ["Street", "35mm", "Natural light"],
        exif: "ƒ/2.8, 1/250, ISO 200",
        a: "#E58FA8",
        b: "#2C2C2C",
        links: [{ label: "Lihat album", href: "#" }],
      },
      {
        title: "Wajah Kota",
        kind: "Portrait series",
        year: "2025",
        desc: "Potret orang-orang yang ditemui di sudut kota, difoto dengan cahaya sekitar apa adanya.",
        tags: ["Portrait", "85mm"],
        exif: "ƒ/1.8, 1/320, ISO 100",
        a: "#2C2C2C",
        b: "#F3F4F4",
        links: [{ label: "Lihat album", href: "#" }],
      },
      {
        title: "Pesisir",
        kind: "Landscape",
        year: "2024",
        desc: "Perjalanan menyusuri pantai saat golden hour dengan eksposur panjang.",
        tags: ["Landscape", "Long exposure"],
        exif: "ƒ/11, 4s, ISO 100",
        a: "#853953",
        b: "#2C2C2C",
        links: [{ label: "Lihat album", href: "#" }],
      },
    ],
  },
  {
    id: "barber",
    index: "03",
    title: "Barbering",
    short: "Barber",
    tagline: "Potongan rapi dengan detail yang presisi.",
    bg: "#853953",
    projects: [
      {
        title: "Skin Fade",
        kind: "Fade",
        year: "2026",
        desc: "Gradasi halus dari kulit ke rambut, dirapikan dengan clipper dan foil shaver.",
        tags: ["Fade", "Clipper", "Foil shaver"],
        meta: "Durasi 45 menit",
        a: "#2C2C2C",
        b: "#F3F4F4",
        links: [{ label: "Lihat di Instagram", href: "#" }],
      },
      {
        title: "Textured Crop",
        kind: "Crop",
        year: "2025",
        desc: "Potongan pendek bertekstur di bagian atas dengan sisi yang bersih.",
        tags: ["Crop", "Texture"],
        meta: "Durasi 40 menit",
        a: "#612D53",
        b: "#F3F4F4",
        links: [{ label: "Lihat di Instagram", href: "#" }],
      },
      {
        title: "Classic Taper",
        kind: "Taper",
        year: "2024",
        desc: "Taper klasik dengan belahan samping yang rapi untuk tampilan formal.",
        tags: ["Taper", "Side part"],
        meta: "Durasi 35 menit",
        a: "#1F1F1F",
        b: "#E58FA8",
        links: [{ label: "Lihat di Instagram", href: "#" }],
      },
    ],
  },
];

// Tiang barber: putih, plum, putih, charcoal (terbaca di atas panel rose)
const stripes = (o) =>
  `repeating-linear-gradient(135deg, #F3F4F4 ${o}px, #F3F4F4 ${o + 14}px, #612D53 ${o + 14}px, #612D53 ${o + 28}px, #F3F4F4 ${o + 28}px, #F3F4F4 ${o + 42}px, #2C2C2C ${o + 42}px, #2C2C2C ${o + 56}px)`;

// Animasi baris saat panel dibuka: tiap kategori punya gaya sendiri
const ROW_FX = {
  code: { from: { x: -30, opacity: 0 }, to: { x: 0, opacity: 1 } },
  photo: {
    from: { opacity: 0, filter: "blur(14px)" },
    to: { opacity: 1, filter: "blur(0px)" },
  },
  barber: {
    from: { clipPath: "polygon(0 0, 0 0, -15% 100%, -15% 100%)" },
    to: { clipPath: "polygon(0 0, 115% 0, 100% 100%, -15% 100%)" },
  },
};

const Arrow = ({ className = "size-4" }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

function Art({ p, src, className = "" }) {
  const img = src || p.image;
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
    >
      {img ? (
        <img
          src={img}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span
          className={`${DISPLAY} select-none text-[8rem] font-extrabold leading-none tracking-[-0.05em] text-[#F3F4F4]/30`}
        >
          {p.title[0]}
        </span>
      )}
    </div>
  );
}

// Before / after yang bisa digeser (untuk barbering)
function Compare({ p }) {
  const [v, setV] = useState(50);
  return (
    <div className="relative aspect-4/5 select-none overflow-hidden">
      <Art p={p} />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - v}% 0 0)` }}
      >
        <Art
          p={p}
          src={p.before}
          className={p.before ? "" : "grayscale brightness-75"}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#F3F4F4]"
        style={{ left: `${v}%` }}
      >
        <span className="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#F3F4F4] text-sm font-semibold text-[#2C2C2C] shadow-lg">
          ⇆
        </span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-[#2C2C2C]/60 px-3 py-1 text-xs font-medium text-[#F3F4F4] backdrop-blur-md">
        Sebelum
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-[#2C2C2C]/60 px-3 py-1 text-xs font-medium text-[#F3F4F4] backdrop-blur-md">
        Sesudah
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={v}
        onChange={(e) => setV(+e.target.value)}
        aria-label="Geser untuk membandingkan sebelum dan sesudah"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

export default function FeaturedProjects() {
  const root = useRef(null);
  const modalRef = useRef(null);
  const closing = useRef(false);
  const activeRef = useRef(null);
  const [active, setActive] = useState(null); // panel yang terbuka
  const [sel, setSel] = useState(null); // { c, p } proyek yang dibuka detailnya
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /* ---------- Masuk, loop idle, hover-lean + cahaya kursor ---------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const panels = gsap.utils.toArray(".pn");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hs = { trigger: ".fp-head", start: "top 82%", once: true };
        gsap.from(".fp-line", {
          yPercent: 110,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: hs,
        });
        gsap.from(".fp-fade", {
          y: 16,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: hs,
        });

        gsap.from(panels, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".fp-panels",
            start: "top 80%",
            once: true,
          },
        });

        // Idle: code diketik, fokus kamera menajam, barber pole berputar
        gsap
          .timeline({ repeat: -1, repeatDelay: 1 })
          .fromTo(
            ".mo-line",
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.9,
              stagger: 0.6,
              ease: "steps(20)",
            },
          )
          .to(".mo-line", { opacity: 0, duration: 0.3 }, "+=1.6")
          .set(".mo-line", { opacity: 1 });
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.5 })
          .fromTo(
            ".mo-focus",
            { scale: 2.4, opacity: 0, filter: "blur(6px)" },
            {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power3.out",
            },
          )
          .to(".mo-focus", { opacity: 0.15, duration: 0.4 }, "+=0.9");
        const pole = root.current.querySelector(".mo-pole-bg");
        const o = { v: 0 };
        gsap.to(o, {
          v: 56,
          duration: 2.2,
          ease: "none",
          repeat: -1,
          onUpdate: () => pole && (pole.style.backgroundImage = stripes(o.v)),
        });
      });

      // Hover (desktop): panel yang disorot sedikit melebar, cahaya lembut mengikuti kursor
      mm.add(
        "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const box = root.current.querySelector(".fp-panels");
          const lean = (hot) => {
            if (activeRef.current !== null) return;
            gsap.to(panels, {
              flexGrow: (i) => (hot === null ? 1 : i === hot ? 1.45 : 0.8),
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto",
            });
          };
          const cleanups = panels.map((p, i) => {
            const enter = () => lean(i);
            const move = (e) => {
              const r = p.getBoundingClientRect();
              p.style.setProperty("--mx", `${e.clientX - r.left}px`);
              p.style.setProperty("--my", `${e.clientY - r.top}px`);
            };
            p.addEventListener("mouseenter", enter);
            p.addEventListener("mousemove", move);
            return () => {
              p.removeEventListener("mouseenter", enter);
              p.removeEventListener("mousemove", move);
            };
          });
          const out = () => lean(null);
          box.addEventListener("mouseleave", out);
          return () => {
            cleanups.forEach((fn) => fn());
            box.removeEventListener("mouseleave", out);
          };
        },
      );
    },
    { scope: root },
  );

  /* ---------- Buka / tutup panel ---------- */
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const t = (d) => (reduce ? 0 : d);
      gsap.utils.toArray(".pn").forEach((p, i) => {
        const none = active === null;
        const on = active === i;
        const rows = p.querySelectorAll(".pl-row");
        const fx = ROW_FX[CATEGORIES[i].id];

        gsap.to(p, {
          flexGrow: none ? 1 : on ? 6 : 0.55,
          duration: t(0.9),
          ease: "power4.inOut",
          overwrite: "auto",
        });
        gsap.to(p.querySelector(".pn-full"), {
          opacity: none || on ? 1 : 0,
          duration: t(0.3),
        });
        gsap.to(p.querySelector(".pn-short"), {
          opacity: !none && !on ? 1 : 0,
          duration: t(0.4),
          delay: t(0.3),
        });
        gsap.to(p.querySelector(".pn-idle"), {
          opacity: none ? 1 : 0,
          duration: t(0.3),
        });

        if (on) {
          gsap.set(p.querySelector(".pn-list"), { autoAlpha: 1 });
          gsap.fromTo(rows, fx.from, {
            ...fx.to,
            duration: t(0.8),
            stagger: t(0.12),
            delay: t(0.55),
            ease: "power3.out",
            clearProps: "clipPath,filter,transform",
          });
        } else {
          gsap.to(p.querySelector(".pn-list"), {
            autoAlpha: 0,
            duration: t(0.2),
          });
        }
      });
    },
    { scope: root, dependencies: [active] },
  );

  /* ---------- Detail proyek: transisi beda tiap kategori ---------- */
  const sweep = (m, cat, opening) => {
    const body = m.querySelector(".md-body");
    const ins = m.querySelectorAll(".md-in");
    if (cat === "photo") {
      const flash = m.querySelector(".md-flash");
      if (!opening)
        return gsap
          .timeline()
          .to(m, {
            clipPath: "circle(0% at 50% 50%)",
            duration: 0.6,
            ease: "power3.inOut",
          });
      gsap.set(body, { opacity: 1 });
      return gsap
        .timeline()
        .fromTo(
          m,
          { clipPath: "circle(0% at 50% 50%)" },
          {
            clipPath: "circle(150% at 50% 50%)",
            duration: 0.9,
            ease: "power3.inOut",
          },
        )
        .fromTo(flash, { opacity: 0.7 }, { opacity: 0, duration: 0.5 }, 0.5)
        .from(
          ins,
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: "power3.out",
          },
          0.6,
        )
        .fromTo(
          m.querySelector(".md-art"),
          { filter: "invert(1) grayscale(1) blur(10px)" },
          {
            filter: "invert(0) grayscale(0) blur(0px)",
            duration: 1.3,
            ease: "power2.out",
          },
          0.7,
        );
    }
    const bars = m.querySelectorAll(".md-bar");
    gsap.set(bars, { skewX: cat === "barber" ? -12 : 0 });
    const tl = gsap.timeline();
    tl.set(bars, { scaleX: 0, transformOrigin: "0% 50%" })
      .to(bars, { scaleX: 1, duration: 0.45, ease: "power3.in", stagger: 0.05 })
      .set(body, { opacity: opening ? 1 : 0 })
      .set(bars, { transformOrigin: "100% 50%" })
      .to(bars, {
        scaleX: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
      });
    if (opening)
      tl.from(
        ins,
        { y: 40, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
        "-=0.4",
      );
    return tl;
  };

  useEffect(() => {
    if (!sel || !modalRef.current) return;
    const m = modalRef.current;
    closing.current = false;
    document.body.style.overflow = "hidden";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gsap.set(m.querySelector(".md-body"), { opacity: 1 });
    else sweep(m, CATEGORIES[sel.c].id, true);
    return () => {
      document.body.style.overflow = "";
    };
  }, [sel]);

  const closeModal = () => {
    const m = modalRef.current;
    if (closing.current || !sel) return;
    closing.current = true;
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return setSel(null);
    sweep(m, CATEGORIES[sel.c].id, false).eventCallback("onComplete", () =>
      setSel(null),
    );
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (sel) closeModal();
      else if (activeRef.current !== null) setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const cat = sel ? CATEGORIES[sel.c] : null;
  const p = sel ? cat.projects[sel.p] : null;

  return (
    <section
      ref={root}
      id="works"
      className="relative overflow-clip bg-[#2C2C2C] px-6 py-20 text-[#F3F4F4] md:px-12 md:py-28 lg:px-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#612D53]/40 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="fp-head mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2
            className={`${DISPLAY} text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl`}
          >
            {["Featured", "Projects"].map((line) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span className="fp-line block">{line}</span>
              </span>
            ))}
          </h2>
          <p className="fp-fade max-w-xs text-[#F3F4F4]/75 md:text-right">
            Tiga sisi, satu orang. Pilih salah satu untuk melihat karyanya.
          </p>
        </header>

        {/* Tiga panel */}
        <div className="fp-panels flex h-[92vh] min-h-[640px] flex-col gap-3 md:h-[78vh] md:flex-row">
          {CATEGORIES.map((c, i) => (
            <div
              key={c.id}
              className="pn group/pn relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-[28px] border border-[#F3F4F4]/10"
              style={{ background: c.bg }}
            >
              {c.id === "code" && (
                <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_right,#F3F4F4_1px,transparent_1px),linear-gradient(to_bottom,#F3F4F4_1px,transparent_1px)] [background-size:32px_32px]" />
              )}

              {/* Cahaya lembut mengikuti kursor */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/pn:opacity-100"
                style={{
                  background:
                    "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(243,244,244,0.10), transparent 70%)",
                }}
              />

              <div className="absolute inset-0 flex flex-col p-5 md:p-8">
                <div className="relative">
                  {/* label sempit saat panel lain terbuka */}
                  <span
                    className={`pn-short absolute left-0 top-0 whitespace-nowrap text-2xl font-bold opacity-0 md:text-3xl md:[writing-mode:vertical-rl] md:rotate-180 ${DISPLAY}`}
                  >
                    {c.index} {c.short}
                  </span>
                  <div className="pn-full">
                    <span className="inline-grid size-9 place-items-center rounded-full border border-[#F3F4F4]/30 text-sm tabular-nums">
                      {c.index}
                    </span>
                    <h3
                      className={`mt-4 ${DISPLAY} text-3xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-4xl lg:text-5xl`}
                    >
                      {c.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm text-[#F3F4F4]/80 md:text-base">
                      {c.tagline}
                    </p>
                  </div>
                </div>

                <div className="relative mt-5 min-h-0 flex-1">
                  {/* Idle: motif animasi + ajakan buka */}
                  <div
                    className="pn-idle absolute inset-0 flex items-end justify-between"
                    aria-hidden="true"
                  >
                    {c.id === "code" && (
                      <div className="font-mono text-sm leading-relaxed text-[#F3F4F4]/75">
                        <p className="mo-line">const me = "engineer";</p>
                        <p className="mo-line">build(ideas).ship();</p>
                        <p className="mo-line">
                          // {c.projects.length} proyek unggulan
                        </p>
                      </div>
                    )}
                    {c.id === "photo" && (
                      <div className="relative h-24 w-32">
                        {[
                          "left-0 top-0 border-l-2 border-t-2",
                          "right-0 top-0 border-r-2 border-t-2",
                          "bottom-0 left-0 border-b-2 border-l-2",
                          "bottom-0 right-0 border-b-2 border-r-2",
                        ].map((k) => (
                          <span
                            key={k}
                            className={`absolute h-5 w-5 border-[#F3F4F4]/80 ${k}`}
                          />
                        ))}
                        <span className="mo-focus absolute inset-0 m-auto h-9 w-9 rounded-full border border-[#F3F4F4]" />
                      </div>
                    )}
                    {c.id === "barber" && (
                      <div className="relative h-24 w-8 overflow-hidden rounded-full border border-[#F3F4F4]/40">
                        <div
                          className="mo-pole-bg absolute inset-0"
                          style={{ backgroundImage: stripes(0) }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.3),transparent_40%,rgba(0,0,0,0.35))]" />
                      </div>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F4F4] py-1.5 pl-4 pr-1.5 text-sm font-semibold text-[#2C2C2C]">
                      Buka {c.projects.length} proyek
                      <span className="grid size-7 place-items-center rounded-full bg-[#2C2C2C] text-[#F3F4F4] transition-transform duration-300 group-hover/pn:rotate-45">
                        <Arrow className="size-3.5" />
                      </span>
                    </span>
                  </div>

                  {/* Daftar proyek saat panel terbuka */}
                  <ul className="pn-list invisible absolute inset-0 overflow-y-auto opacity-0">
                    {c.projects.map((proj, pi) => (
                      <li key={proj.title} className="pl-row mb-2">
                        <button
                          type="button"
                          onClick={() => setSel({ c: i, p: pi })}
                          aria-label={`Buka detail ${proj.title}`}
                          className="group flex w-full items-center gap-4 rounded-2xl bg-[#F3F4F4]/[0.08] p-3 text-left transition-colors duration-300 hover:bg-[#F3F4F4]/[0.16] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3F4F4]"
                        >
                          {c.id === "barber" && (
                            <span
                              className="h-14 w-1 shrink-0 rounded-full transition-[width] duration-300 group-hover:w-3"
                              style={{ backgroundImage: stripes(0) }}
                            />
                          )}
                          <span
                            className={`h-16 w-14 shrink-0 overflow-hidden rounded-xl ${c.id === "photo" ? "[filter:invert(1)_grayscale(1)] transition-[filter] duration-500 group-hover:[filter:none]" : ""}`}
                          >
                            <Art p={proj} className="[&_span]:!text-5xl" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate ${DISPLAY} text-2xl font-bold tracking-tight md:text-3xl`}
                            >
                              {proj.title}
                            </span>
                            <span
                              className={`block text-sm text-[#F3F4F4]/75 ${c.id === "code" ? "font-mono" : ""}`}
                            >
                              {c.id === "code"
                                ? `$ open ${proj.title.toLowerCase()}`
                                : `${proj.kind}, ${proj.year}`}
                            </span>
                          </span>
                          <span className="hidden text-sm tabular-nums text-[#F3F4F4]/75 md:block">
                            {proj.year}
                          </span>
                          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#F3F4F4]/30 transition-colors duration-300 group-hover:bg-[#F3F4F4] group-hover:text-[#2C2C2C]">
                            <Arrow />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Seluruh panel bisa diklik saat belum terbuka */}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Buka kategori ${c.title}`}
                className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#F3F4F4]"
                style={{ pointerEvents: active === i ? "none" : "auto" }}
              />
              {active === i && (
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className={`absolute right-4 top-4 z-20 rounded-full border border-[#F3F4F4]/35 px-4 py-2 text-sm transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C] ${DISPLAY}`}
                >
                  Kembali
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal detail */}
      {p &&
        createPortal(
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
            className="fixed inset-0 z-[70]"
          >
            <div
              className="md-body absolute inset-0 overflow-y-auto text-[#F3F4F4] opacity-0"
              style={{ background: cat.bg }}
            >
              <button
                type="button"
                onClick={closeModal}
                className={`absolute right-5 top-5 z-10 rounded-full border border-[#F3F4F4]/35 px-4 py-2 text-sm transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C] ${DISPLAY}`}
              >
                Tutup (Esc)
              </button>
              <div className="mx-auto grid min-h-full max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-16">
                <div className="md-in">
                  <div className="md-art aspect-4/5 overflow-hidden rounded-3xl shadow-2xl shadow-black/40">
                    {cat.id === "barber" ? <Compare p={p} /> : <Art p={p} />}
                  </div>
                </div>
                <div>
                  <p className="md-in text-[#F3F4F4]/80">
                    {cat.title}, {p.year}
                  </p>
                  <h3
                    className={`md-in mt-2 ${DISPLAY} text-6xl font-extrabold leading-none tracking-[-0.03em] md:text-8xl`}
                  >
                    {p.title}
                  </h3>
                  <p className="md-in mt-6 max-w-md text-lg leading-relaxed text-[#F3F4F4]/85">
                    {p.desc}
                  </p>

                  {cat.id === "code" && (
                    <div className="md-in mt-8 max-w-md overflow-hidden rounded-xl border border-[#F3F4F4]/10 bg-[#2C2C2C]">
                      <div
                        className="flex gap-1.5 border-b border-[#F3F4F4]/10 px-4 py-3"
                        aria-hidden="true"
                      >
                        <span className="size-2.5 rounded-full bg-[#853953]" />
                        <span className="size-2.5 rounded-full bg-[#612D53]" />
                        <span className="size-2.5 rounded-full bg-[#E58FA8]" />
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#F3F4F4]/85">{`const project = {
  name: "${p.title}",
  type: "${p.kind}",
  year: ${p.year},
  stack: [${p.tags.map((s) => `"${s}"`).join(", ")}],
};`}</pre>
                    </div>
                  )}
                  {cat.id === "photo" && (
                    <p className="md-in mt-8 text-lg tabular-nums text-[#F3F4F4]/85">
                      {p.exif}
                    </p>
                  )}
                  {cat.id === "barber" && (
                    <p className="md-in mt-8 text-lg text-[#F3F4F4]/90">
                      {p.meta}
                    </p>
                  )}

                  <ul className="md-in mt-5 flex flex-wrap gap-2">
                    {p.tags.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-[#F3F4F4]/30 px-4 py-1.5 text-sm"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  <div className="md-in mt-8 flex flex-wrap gap-3">
                    {p.links.map((l, i) => (
                      <a
                        key={l.label}
                        href={l.href}
                        className={
                          i === 0
                            ? "rounded-full bg-[#F3F4F4] px-6 py-3 font-semibold text-[#2C2C2C] transition hover:bg-[#E58FA8]"
                            : "rounded-full border border-[#F3F4F4]/35 px-6 py-3 font-semibold transition hover:bg-[#F3F4F4]/10"
                        }
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tirai transisi: code = baris horizontal, barber = garis miring, photo = iris + kilatan */}
            {cat.id === "code" && (
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="md-bar flex-1"
                    style={{ background: i % 2 ? "#612D53" : "#2C2C2C" }}
                  />
                ))}
              </div>
            )}
            {cat.id === "barber" && (
              <div className="pointer-events-none absolute inset-y-0 -left-[10%] z-20 flex w-[120%]">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="md-bar flex-1"
                    style={{ background: i % 2 ? "#F3F4F4" : "#612D53" }}
                  />
                ))}
              </div>
            )}
            {cat.id === "photo" && (
              <div className="md-flash pointer-events-none absolute inset-0 z-20 bg-[#F3F4F4] opacity-0" />
            )}
          </div>,
          document.body,
        )}
    </section>
  );
}
