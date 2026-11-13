import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import saya from "../assets/saya.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font (tambahkan sekali di index.html / CSS global):
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  FOTO: src/assets/saya.png HARUS PNG transparan (background dihapus), kalau tidak
  kata raksasa tidak bisa lewat di belakang badanmu.

  KONSEP (3 lapis, dari belakang ke depan):
    1. Kata raksasa solid          -> terlihat di kiri-kanan kepala
    2. Fotomu (cutout)             -> menutupi kata di belakangnya
    3. Kata yang sama, hanya garis -> hanya muncul di tengah, "menembus" wajahmu

  PENYETELAN: kalau kata terasa terlalu tinggi/rendah terhadap wajahmu, ubah WORD_TOP dan PORTRAIT_H.
*/
const WORD = "IMAGHAM";
const WORD_TOP = 47; // posisi tengah kata dari atas hero (%)
const PORTRAIT_H = 92; // tinggi foto relatif terhadap hero (%)

const BIG = "font-['Anton',Impact,'Arial_Narrow',sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";
const ACCENT = "#FFC857";
const SILVER = "#D3DAD9";

const TAGLINE = "Where Technology Meets Creativity.";
const TEXT = "A Software Engineer, Barber, and Photographer driven by curiosity and the passion to create meaningful things.";
const ROLES = ["Software Engineer", "Barber", "Photographer"];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D3DAD9]";

const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

/* Kata raksasa dipecah per huruf supaya tiap huruf bisa dianimasikan */
function BigWord({ outline }) {
  return (
    <div
      aria-hidden="true"
      className={`depth-word pointer-events-none flex select-none justify-center whitespace-nowrap uppercase leading-[0.82] ${BIG}`}
      style={{
        fontSize: "clamp(7rem, min(29vw, 62vh), 40rem)",
        ...(outline
          ? { color: "transparent", WebkitTextStroke: `2px ${ACCENT}` }
          : { color: SILVER }),
      }}
    >
      {[...WORD].map((ch, i) => (
        <span key={i} data-i={i} className="big-char inline-block">
          {ch}
        </span>
      ))}
    </div>
  );
}

function LongArrow({ className = "" }) {
  return (
    <svg width="64" height="12" viewBox="0 0 64 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <line x1="1" y1="6" x2="62" y2="6" />
      <polyline points="56 1 62 6 56 11" />
    </svg>
  );
}

/* Siluet cadangan kalau foto gagal dimuat */
function Silhouette() {
  return (
    <svg viewBox="0 0 400 500" aria-hidden="true" className="absolute bottom-0 left-1/2 h-[88%] -translate-x-1/2">
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#715A5A" />
          <stop offset="1" stopColor="#44444E" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="150" r="74" fill="url(#sil)" />
      <path d="M30 500 C30 370 110 305 200 305 C290 305 370 370 370 500 Z" fill="url(#sil)" />
    </svg>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const [missing, setMissing] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const mid = (WORD.length - 1) / 2;

      /* ================= Animasi otomatis ================= */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".topbar > *", { y: -18, opacity: 0, duration: 0.8, stagger: 0.1 })
          .from(".big-char", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.1, stagger: { each: 0.07, from: "start" } }, "-=0.5")
          .from(".portrait", { y: 90, opacity: 0, scale: 1.04, duration: 1.4 }, "-=0.9")
          .from(".word-front", { opacity: 0, duration: 1 }, "-=0.5")
          .from(".fade-in", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, "-=0.7");

        /* Foto "bernapas" */
        gsap.to(".breathe", { y: -8, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

        /* Ticker peran di kiri atas: ganti peran tiap ~2 detik */
        const n = ROLES.length;
        const tick = gsap.timeline({ repeat: -1 });
        for (let i = 1; i <= n; i++) {
          tick.to(".ticker-list", { yPercent: -(100 / (n + 1)) * i, duration: 0.6, ease: "power3.inOut" }, "+=1.8");
        }
        tick.set(".ticker-list", { yPercent: 0 });

        /* Saat scroll: huruf menyebar dari tengah, foto membesar sedikit.
           Memakai posisi scroll absolut (bukan trigger elemen) karena Hero bisa sticky di LandingPage. */
        const range = { start: 0, end: () => window.innerHeight * 0.8, scrub: true };
        gsap.to(".big-char", { x: (i, el) => (Number(el.dataset.i) - mid) * 70, ease: "none", scrollTrigger: range });
        gsap.to(".breathe", { scale: 1.07, transformOrigin: "50% 100%", ease: "none", scrollTrigger: range });
      });

      /* ================= Interaksi kursor (desktop saja) ================= */
      mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
        const root = heroRef.current;

        // quickTo untuk semua elemen yang cocok dengan selector
        const layer = (sel, dur) => {
          const els = gsap.utils.toArray(sel);
          const xs = els.map((el) => gsap.quickTo(el, "x", { duration: dur, ease: "power3.out" }));
          const ys = els.map((el) => gsap.quickTo(el, "y", { duration: dur, ease: "power3.out" }));
          return { x: (v) => xs.forEach((f) => f(v)), y: (v) => ys.forEach((f) => f(v)) };
        };
        // Kedua lapis kata bergerak SAMA, supaya garis dan huruf solid tetap tepat bertumpuk.
        // Foto bergerak berlawanan, jadi huruf terasa "meluncur" melewati wajahmu.
        const words = layer(".depth-word", 1);
        const face = layer(".depth-face", 0.8);

        gsap.set(".spot", { xPercent: -50, yPercent: -50, x: root.clientWidth / 2, y: root.clientHeight / 2, opacity: 0 });
        const sx = gsap.quickTo(".spot", "x", { duration: 0.7, ease: "power3.out" });
        const sy = gsap.quickTo(".spot", "y", { duration: 0.7, ease: "power3.out" });
        let spotOn = false;

        const onMove = (e) => {
          const r = root.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          words.x(nx * -26);
          words.y(ny * -10);
          face.x(nx * 14);
          face.y(ny * 8);
          sx(e.clientX - r.left);
          sy(e.clientY - r.top);
          if (!spotOn) {
            spotOn = true;
            gsap.to(".spot", { opacity: 1, duration: 0.8 });
          }
        };
        const onLeave = () => {
          [words, face].forEach((l) => {
            l.x(0);
            l.y(0);
          });
          spotOn = false;
          gsap.to(".spot", { opacity: 0, duration: 0.6 });
        };
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);

        // Tombol magnetik
        const cleanups = gsap.utils.toArray(".magnet").map((el) => {
          const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
          const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
          const move = (e) => {
            const r = el.getBoundingClientRect();
            mx((e.clientX - (r.left + r.width / 2)) * 0.3);
            my((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            mx(0);
            my(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          };
        });

        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
          cleanups.forEach((fn) => fn());
        };
      });
    },
    { scope: heroRef },
  );

  return (
    <main
      ref={heroRef}
      className={`relative min-h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#44444E_0%,#2a282f_68%)] text-[#D3DAD9] ${BODY}`}
    >
      <h1 className="sr-only">Imagham: Software Engineer, Barber, and Photographer</h1>

      {/* Latar: spotlight kursor + grain film */}
      <div
        aria-hidden="true"
        className="spot pointer-events-none absolute left-0 top-0 z-0 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,200,87,0.12),transparent_65%)] opacity-0"
      />

      {/* LAPIS 1: kata raksasa solid (paling belakang) */}
      <div className="pointer-events-none absolute inset-x-0 z-[1] -translate-y-1/2" style={{ top: `${WORD_TOP}%` }}>
        <BigWord />
      </div>

      {/* LAPIS 2: foto */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[min(92vw,62rem)] -translate-x-1/2"
        style={{ height: `${PORTRAIT_H}%` }}
      >
        <div className="portrait absolute inset-0 [mask-image:linear-gradient(to_top,transparent_0,black_14%)]">
          <div className="depth-face absolute inset-0">
            <div className="breathe absolute inset-0">
              {missing ? (
                <Silhouette />
              ) : (
                <img
                  src={saya}
                  alt="Portrait of Imagham"
                  onError={() => setMissing(true)}
                  className="absolute inset-0 size-full object-contain object-bottom"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LAPIS 3: kata yang sama, hanya garis, dibatasi di tengah supaya "menembus" wajah */}
      <div
        className="word-front pointer-events-none absolute inset-x-0 z-20 -translate-y-1/2 [mask-image:linear-gradient(90deg,transparent_32%,black_41%,black_59%,transparent_68%)]"
        style={{ top: `${WORD_TOP}%` }}
      >
        <BigWord outline />
      </div>

      {/* Gradasi bawah agar teks tetap terbaca di atas badan foto */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[38%] bg-gradient-to-t from-[#2a282f] via-[#2a282f]/70 to-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[25] opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Bar atas */}
      <header className="topbar absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 py-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-3 text-sm">
          <span aria-hidden="true" className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7EE0A1] opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#7EE0A1]" />
          </span>
          <span className="sr-only">{ROLES.join(", ")}. Open for freelance projects.</span>
          <span aria-hidden="true" className="block h-6 overflow-hidden font-semibold">
            <span className="ticker-list block">
              {[...ROLES, ROLES[0]].map((r, i) => (
                <span key={i} className="block h-6 leading-6">{r}</span>
              ))}
            </span>
          </span>
        </div>

        <nav aria-label="Utama" className="hidden items-center gap-9 text-sm font-medium text-[#D3DAD9]/75 md:flex">
          {[
            ["About", "#about"],
            ["Works", "#works"],
            ["Gallery", "#gallery"],
          ].map(([label, href]) => (
            <a key={label} href={href} className={`transition-colors hover:text-[#D3DAD9] ${focusRing}`}>
              {label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={`magnet group flex items-center gap-3 text-sm font-semibold ${focusRing}`}>
          Let's talk
          <LongArrow className="w-12 transition-transform duration-300 group-hover:translate-x-1.5 md:w-16" />
        </a>
      </header>

      {/* Bar bawah */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-start justify-between gap-5 px-5 pb-7 md:flex-row md:items-end md:px-10 lg:px-16">
        <div className="fade-in max-w-xs">
          <p className="text-base font-bold" style={{ color: ACCENT }}>{TAGLINE}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#D3DAD9]/75">{TEXT}</p>
        </div>
        <div className="fade-in flex flex-wrap gap-3">
          <a
            href="#works"
            className={`magnet rounded-full bg-[#D3DAD9] px-7 py-3.5 text-sm font-semibold text-[#37353E] transition-colors hover:bg-white ${focusRing}`}
          >
            View works
          </a>
          <a
            href="#about"
            className={`magnet rounded-full border border-[#D3DAD9]/35 px-7 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:border-[#D3DAD9] ${focusRing}`}
          >
            About me
          </a>
        </div>
      </div>
    </main>
  );
}