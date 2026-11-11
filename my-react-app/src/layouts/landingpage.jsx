import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "../components/hero.jsx";
import About from "../components/about.jsx";
import Aperture from "../components/aperture.jsx";
import TechStack from "../components/TechStack.jsx";
import JourneyEducation from "../components/JourneyEducation.jsx";
import FeaturedProjects from "../components/FeaturedProjects.jsx";
import CreativeWorks from "../components/CreativeWorks.jsx";
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Di mobile, address bar yang naik-turun tidak perlu memicu refresh (mencegah layout loncat)
ScrollTrigger.config({ ignoreMobileResize: true });

const DISPLAY = "font-['Bricolage_Grotesque',system-ui,sans-serif]";

/* ============ WARNA BACKGROUND SECTION ============
   Samakan dengan background asli tiap section supaya sambungannya mulus.
   Pita transisi dimulai dari warna section di atasnya dan berakhir di warna section di bawahnya. */
const BG = {
  tech: "#44444E", // background TechStack
  journey: "#37353E", // background JourneyEducation
  projects: "#44444E", // background FeaturedProjects (cek dan samakan dengan aslinya)
  creative: "#2f2d35", // background CreativeWorks
};

/* Daftar section untuk navigasi samping. id = id pembungkus di bawah. */
const SECTIONS = [
  { id: "s-hero", label: "Beranda" },
  { id: "s-about", label: "Tentang" },
  { id: "s-tech", label: "Tech Stack" },
  { id: "s-journey", label: "Journey" },
  { id: "s-projects", label: "Proyek" },
  { id: "s-creative", label: "Karya" },
];

/* ---------- Transisi A: kata-kata berjalan berlawanan arah, miring mengikuti kecepatan scroll ---------- */
function WordsTransition({ from, to }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(".wt-a", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
        gsap.fromTo(".wt-b", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: st });

        const skew = gsap.quickTo(".wt-row", "skewX", { duration: 0.4, ease: "power3" });
        let t;
        ScrollTrigger.create({
          ...st,
          scrub: undefined,
          onUpdate: (self) => {
            skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -150));
            clearTimeout(t);
            t = setTimeout(() => skew(0), 120);
          },
        });
        return () => clearTimeout(t);
      });
    },
    { scope: ref },
  );

  const unit = (
    <span className="flex items-center gap-[4vw] pr-[4vw]">
      {["Kode", "Kamera", "Klipper"].map((w) => (
        <span key={w} className="flex items-center gap-[4vw]">
          {w}
          <span className="inline-block size-[2.4vw] rounded-full bg-current opacity-60" />
        </span>
      ))}
    </span>
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative flex flex-col justify-center gap-2 overflow-hidden py-16 md:gap-4 md:py-24" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}>
      <div className={`wt-row wt-a flex w-max whitespace-nowrap text-[14vw] font-extrabold leading-none tracking-[-0.04em] text-[#D3DAD9] ${DISPLAY}`}>
        {unit}
        {unit}
        {unit}
        {unit}
      </div>
      <div
        className={`wt-row wt-b flex w-max whitespace-nowrap text-[14vw] font-extrabold leading-none tracking-[-0.04em] text-transparent ${DISPLAY}`}
        style={{ WebkitTextStroke: "2px rgba(211,218,217,0.55)" }}
      >
        {unit}
        {unit}
        {unit}
        {unit}
      </div>
    </div>
  );
}

/* ---------- Transisi B: rana shutter kamera membuka, menuju proyek ---------- */
const BLADES = 8;

function ShutterTransition({ from, to, label }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ref.current, start: "top 75%", end: "center 40%", scrub: true };
        // Bilah menutup dari tengah, lalu membuka satu per satu ke arah luar
        gsap.fromTo(".sh-blade", { scaleY: 1 }, { scaleY: 0, ease: "none", stagger: { each: 0.08, from: "center" }, scrollTrigger: st });
        gsap.fromTo(".sh-label", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, ease: "none", scrollTrigger: { ...st, end: "center 60%" } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative grid h-[55vh] place-items-center overflow-hidden" style={{ background: to }}>
      {Array.from({ length: BLADES }, (_, i) => (
        <span
          key={i}
          className={`sh-blade absolute inset-y-0 ${i % 2 ? "origin-top" : "origin-bottom"}`}
          style={{ left: `${(i * 100) / BLADES}%`, width: `${100 / BLADES + 0.2}%`, background: from }}
        />
      ))}
      <p className={`sh-label relative z-10 px-6 text-center text-[13vw] font-extrabold leading-none tracking-[-0.04em] text-[#D3DAD9] md:text-[9vw] ${DISPLAY}`}>{label}</p>
    </div>
  );
}

/* ---------- Transisi C: dua rol film berjalan miring, menuju galeri ---------- */
const FRAMES = [
  ["#9a8080", "#37353E"], ["#37353E", "#D3DAD9"], ["#715A5A", "#44444E"], ["#D3DAD9", "#715A5A"],
  ["#44444E", "#9a8080"], ["#715A5A", "#D3DAD9"], ["#37353E", "#715A5A"], ["#9a8080", "#D3DAD9"],
  ["#44444E", "#D3DAD9"], ["#D3DAD9", "#37353E"], ["#715A5A", "#37353E"], ["#9a8080", "#44444E"],
];
const HOLES = "repeating-linear-gradient(90deg, rgba(211,218,217,0.75) 0 14px, transparent 14px 30px)";

function Reel({ className = "", dir, frames }) {
  return (
    <div className={`absolute inset-x-[-15%] ${className}`}>
      <div className={`reel reel-${dir} w-max bg-[#1f1e24] py-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]`}>
        <div className="mb-2 h-2" style={{ background: HOLES }} />
        <div className="flex gap-3 px-3">
          {frames.map(([a, b], i) => (
            <div key={i} className="h-28 w-40 shrink-0 md:h-40 md:w-56" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
          ))}
        </div>
        <div className="mt-2 h-2" style={{ background: HOLES }} />
      </div>
    </div>
  );
}

function FilmTransition({ from, to }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(".reel-l", { xPercent: 5 }, { xPercent: -35, ease: "none", scrollTrigger: st });
        gsap.fromTo(".reel-r", { xPercent: -40 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="relative h-[75vh] overflow-hidden md:h-[80vh]" style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}>
      <Reel className="top-[8%] -rotate-3" dir="l" frames={[...FRAMES, ...FRAMES]} />
      <Reel className="bottom-[8%] rotate-2 opacity-70" dir="r" frames={[...FRAMES, ...FRAMES].reverse()} />
    </div>
  );
}

/* ---------- Navigasi section: titik di sisi kanan, label muncul saat di-hover atau difokus ---------- */
function SectionNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    // Section dianggap aktif saat melewati garis tengah layar
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav aria-label="Navigasi bagian halaman" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 text-white mix-blend-difference md:block">
      <ul className="flex flex-col items-end gap-4">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-label={`Ke bagian ${s.label}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className={`text-sm opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${on ? "translate-x-0 opacity-100" : "translate-x-2"}`}>{s.label}</span>
                <span className={`block rounded-full border border-white transition-all duration-300 ${on ? "h-3 w-3 bg-white" : "h-2 w-2 group-hover:bg-white/60"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function LandingPage() {
  const page = useRef(null);
  const heroWrap = useRef(null);
  const aboutWrap = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Transisi 1: About menimpa Hero seperti tirai.
           Hero mengecil, meredup, dan sedikit turun supaya terasa menjauh. */
        gsap.to(heroWrap.current, {
          scale: 0.92,
          opacity: 0.35,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: aboutWrap.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });

        /* Progress halaman */
        gsap.fromTo(
          ".page-progress",
          { scaleX: 0, transformOrigin: "0% 50%" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: page.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          },
        );
      });

      /* Font Bricolage mengubah ukuran teks setelah dimuat. Posisi trigger yang sudah
         dihitung jadi meleset, jadi hitung ulang begitu font dan semua aset siap. */
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: page },
  );

  return (
    <div ref={page}>
      <div className="page-progress pointer-events-none fixed left-0 top-0 z-50 h-0.5 w-full bg-[#715A5A]" />
      <SectionNav />

      <div id="s-hero" ref={heroWrap} className="origin-top md:sticky md:top-0">
        <Hero />
      </div>

      <div id="s-about" ref={aboutWrap} className="relative z-10 overflow-clip rounded-t-[3rem]">
        <About />
      </div>

      {/* Urutan cerita: Aperture -> Tech Stack -> Journey -> Featured Projects -> Creative Works.
          Pita transisi berdiri sendiri di antara section dan tidak membungkus komponen mana pun.
          Pembungkus ber-id di bawah hanya <div> polos (tanpa transform atau overflow-hidden),
          jadi aman untuk elemen sticky di dalam section.
          Semuanya harus punya background solid karena Hero masih sticky di belakang. */}
      <div className="relative z-10">
        <Aperture />
        <div id="s-tech">
          <TechStack />
        </div>
        <WordsTransition from={BG.tech} to={BG.journey} />
        <div id="s-journey">
          <JourneyEducation />
        </div>
        <ShutterTransition from={BG.journey} to={BG.projects} label="Proyek Pilihan" />
        <div id="s-projects">
          <FeaturedProjects />
        </div>
        <FilmTransition from={BG.projects} to={BG.creative} />
        <div id="s-creative">
          <CreativeWorks />
        </div>
      </div>
    </div>
  );
}