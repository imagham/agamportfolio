import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
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

  PALET: latar charcoal #2C2C2C dengan cahaya plum #612D53 di belakang foto
         kata solid #F3F4F4 · garis, tagline, dan titik status rose muda #E58FA8
         tombol utama putih (hover rose muda) · bagian bawah memudar ke #2C2C2C
         (sama dengan latar About yang menimpa Hero)

  PENYETELAN (nilai kiri = mobile, nilai "md:" = tablet dan desktop):
    WORD_TOP   : posisi tengah kata dari atas hero. Naik/turunkan kalau kata tidak pas di wajah.
    PORTRAIT_H : tinggi foto relatif terhadap hero.
  Tulis sebagai class Tailwind utuh (jangan disusun dari potongan string) supaya terbaca Tailwind.
*/
const WORD = "IMAGHAM";
const WORD_TOP = "top-[43%] md:top-[47%]";
const PORTRAIT_H = "h-[80%] md:h-[92%]";

const BIG = "font-['Anton',Impact,'Arial_Narrow',sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";
const ACCENT = "#E58FA8";
const SILVER = "#F3F4F4";

const TAGLINE = "Where Technology Meets Creativity.";
const TEXT = "A Software Engineer, Barber, and Photographer driven by curiosity and the passion to create meaningful things.";
const ROLES = ["Software Engineer", "Barber", "Photographer"];

/* id harus sama dengan pembungkus section di LandingPage */
const LINKS = {
  about: "#s-about",
  works: "#s-projects",
  gallery: "#s-creative",
  contact: "#s-contact",
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3F4F4]";

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
        fontSize: "clamp(5rem, min(29vw, 62vh), 40rem)",
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
          <stop offset="0" stopColor="#853953" />
          <stop offset="1" stopColor="#612D53" />
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
  const lenis = useLenis();

  /* Link ke section lewat Lenis, supaya scroll-nya halus dan id-nya benar */
  const jump = (e, href) => {
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(href, { duration: 1.2, immediate: reduce });
    else document.querySelector(href)?.scrollIntoView({ block: "start" });
  };

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
           Jarak sebar lebih kecil di layar sempit supaya huruf tidak keluar layar.
           Memakai posisi scroll absolut (bukan trigger elemen) karena Hero bisa sticky di LandingPage. */
        const spread = window.innerWidth < 768 ? 24 : 70;
        const range = { start: 0, end: () => window.innerHeight * 0.8, scrub: true, invalidateOnRefresh: true };
        gsap.to(".big-char", { x: (i, el) => (Number(el.dataset.i) - mid) * spread, ease: "none", scrollTrigger: range });
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
      className={`relative min-h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#612D53_0%,#2C2C2C_68%)] text-[#F3F4F4] ${BODY}`}
    >
      <h1 className="sr-only">Imagham: Software Engineer, Barber, and Photographer</h1>

      {/* Latar: spotlight kursor (hanya muncul di desktop dengan mouse) */}
      <div
        aria-hidden="true"
        className="spot pointer-events-none absolute left-0 top-0 z-0 hidden size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(229,143,168,0.16),transparent_65%)] opacity-0 md:block"
      />

      {/* LAPIS 1: kata raksasa solid (paling belakang) */}
      <div className={`pointer-events-none absolute inset-x-0 z-[1] -translate-y-1/2 ${WORD_TOP}`}>
        <BigWord />
      </div>

      {/* LAPIS 2: foto */}
      <div
        className={`pointer-events-none absolute bottom-0 left-1/2 z-10 w-[min(100vw,62rem)] -translate-x-1/2 md:w-[min(92vw,62rem)] ${PORTRAIT_H}`}
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
        className={`word-front pointer-events-none absolute inset-x-0 z-20 -translate-y-1/2 [mask-image:linear-gradient(90deg,transparent_32%,black_41%,black_59%,transparent_68%)] ${WORD_TOP}`}
      >
        <BigWord outline />
      </div>

      {/* Gradasi bawah agar teks tetap terbaca di atas badan foto; ujungnya sama dengan latar About.
          Lebih tinggi di mobile karena blok teks di bawah menumpuk ke atas. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[50%] bg-gradient-to-t from-[#2C2C2C] via-[#2C2C2C]/80 to-transparent md:h-[38%] md:via-[#2C2C2C]/70" />

      {/* Grain film: dimatikan di mobile karena blend mode layar penuh membebani GPU */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[25] hidden opacity-[0.07] mix-blend-overlay md:block"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Bar atas */}
      <header className="topbar absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-5 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-10 md:py-6 lg:px-16">
        <div className="flex items-center gap-3 text-sm">
          <span aria-hidden="true" className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#E58FA8] opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#E58FA8]" />
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

        <nav aria-label="Utama" className="hidden items-center gap-9 text-sm font-medium text-[#F3F4F4]/80 md:flex">
          {[
            ["About", LINKS.about],
            ["Works", LINKS.works],
            ["Gallery", LINKS.gallery],
          ].map(([label, href]) => (
            <a key={label} href={href} onClick={(e) => jump(e, href)} className={`transition-colors hover:text-[#E58FA8] ${focusRing}`}>
              {label}
            </a>
          ))}
        </nav>

        <a
          href={LINKS.contact}
          onClick={(e) => jump(e, LINKS.contact)}
          className={`magnet group flex min-h-11 items-center gap-3 text-sm font-semibold ${focusRing}`}
        >
          Let's talk
          <LongArrow className="w-12 text-[#E58FA8] transition-transform duration-300 group-hover:translate-x-1.5 md:w-16" />
        </a>
      </header>

      {/* Bar bawah */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-start justify-between gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:flex-row md:items-end md:gap-5 md:px-10 md:pb-7 lg:px-16">
        <div className="fade-in max-w-xs">
          <p className="text-base font-bold" style={{ color: ACCENT }}>{TAGLINE}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#F3F4F4]/80 md:text-sm">{TEXT}</p>
        </div>
        <div className="fade-in flex w-full gap-3 md:w-auto md:flex-wrap">
          <a
            href={LINKS.works}
            onClick={(e) => jump(e, LINKS.works)}
            className={`magnet flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#F3F4F4] px-6 text-sm font-semibold text-[#2C2C2C] transition-colors hover:bg-[#E58FA8] md:flex-none md:px-7 ${focusRing}`}
          >
            View works
          </a>
          <a
            href={LINKS.about}
            onClick={(e) => jump(e, LINKS.about)}
            className={`magnet flex min-h-12 flex-1 items-center justify-center rounded-full border border-[#F3F4F4]/40 px-6 text-sm font-semibold backdrop-blur transition-colors hover:border-[#F3F4F4] hover:bg-[#F3F4F4]/10 md:flex-none md:px-7 ${focusRing}`}
          >
            About me
          </a>
        </div>
      </div>
    </main>
  );
}