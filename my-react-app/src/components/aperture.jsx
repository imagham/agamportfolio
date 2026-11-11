import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font: Bricolage Grotesque (variable). Tambahkan sekali di index.html / CSS global:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,500;12..96,800&display=swap" rel="stylesheet">
*/
const DISPLAY_FONT = "font-['Bricolage_Grotesque',system-ui,sans-serif]";
const BLADES = [0, 60, 120, 180, 240, 300];

const OUTLINE = {
  WebkitTextStroke: "1.5px rgba(211,218,217,0.6)",
  color: "transparent",
};

/*
  Aperture + focus pull:
  1. Bilah diafragma membuka sambil berputar (scrub).
  2. Di dalam bukaan, judul masih buram (out of focus) lalu menajam.
  3. Baris kedua mulai sebagai garis tepi, lalu terisi dari kiri ke kanan.
  4. Angka f-stop turun-naik realistis dari f/1.4 ke f/8.0 mengikuti bukaan.
  5. Reticle fokus mengunci di akhir, lalu muncul "Fokus terkunci".
  Reduced motion: langsung tampil dalam keadaan terbuka dan tajam.
*/
export default function Aperture() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".ap-iris", { svgOrigin: "0 0" });

        const fstop = { n: 1.4 };
        const readout = root.current.querySelector(".ap-fstop");

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          })
          // Bilah membuka + berputar
          .fromTo(".ap-blade", { y: 700 }, { y: 0, duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(".ap-iris", { rotate: 0 }, { rotate: 70, duration: 1, ease: "power2.inOut" }, 0)
          // Kilatan shutter
          .fromTo(".ap-flash", { opacity: 0.45 }, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0)
          // Bingkai viewfinder masuk
          .fromTo(".ap-frame", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.4)
          // Angka f-stop
          .fromTo(
            fstop,
            { n: 1.4 },
            {
              n: 8,
              duration: 1.1,
              ease: "power1.inOut",
              onUpdate: () => {
                if (readout) readout.textContent = "f/" + fstop.n.toFixed(1);
              },
            },
            0.1,
          )
          // Judul: fokus menajam dari buram
          .fromTo(
            ".ap-text",
            { filter: "blur(22px)", opacity: 0.2, letterSpacing: "0.04em" },
            { filter: "blur(0px)", opacity: 1, letterSpacing: "-0.03em", duration: 0.75, ease: "power2.out" },
            0.45,
          )
          // Baris kedua: outline terisi dari kiri
          .fromTo(
            ".ap-fill",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.inOut" },
            1.0,
          )
          // Reticle mengunci
          .fromTo(
            ".ap-reticle",
            { opacity: 0, scale: 2.2, rotate: -20 },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.35, ease: "back.out(2)" },
            1.35,
          )
          .fromTo(".ap-lock", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, 1.55)
          // Dorongan zoom kecil sebelum lepas
          .to(".ap-text", { scale: 1.05, duration: 0.5 }, 1.6);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[260vh] bg-[#44444E] text-[#D3DAD9]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#44444E]">
        {/* Glow latar */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-112 w-md rounded-full bg-[#715A5A]/25 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-112 w-md rounded-full bg-[#D3DAD9]/10 blur-[120px]" />

        {/* Bingkai viewfinder */}
        <div className="ap-frame pointer-events-none absolute inset-5 md:inset-10">
          <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-[#D3DAD9]/60" />
          <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-[#D3DAD9]/60" />
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[#D3DAD9]/60" />
          <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[#D3DAD9]/60" />

          {/* Readout di bawah bingkai */}
          <div
            className={`absolute -bottom-1 left-12 right-12 flex items-end justify-between text-sm tabular-nums text-[#D3DAD9]/70 md:text-base ${DISPLAY_FONT}`}
          >
            <span className="ap-fstop font-medium">f/8.0</span>
            <span className="ap-lock text-[#D3DAD9]">Fokus terkunci</span>
            <span className="font-medium">1/250</span>
          </div>
        </div>

        {/* Judul */}
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <h2
            className={`ap-text ${DISPLAY_FONT} text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl lg:text-8xl`}
          >
            <span className="block pb-[0.08em]">Dari balik lensa,</span>
            <span className="relative mt-1 block pb-[0.08em]">
              {/* Lapisan outline (selalu ada) */}
              <span style={OUTLINE} aria-hidden="true">
                ke balik layar.
              </span>
              {/* Lapisan isi: terbuka dari kiri */}
              <span className="ap-fill absolute inset-0 block text-[#D3DAD9]">ke balik layar.</span>
            </span>
          </h2>

          {/* Reticle fokus di tengah */}
          <div className="ap-reticle pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] max-w-[520px] -translate-x-1/2 -translate-y-1/2">
            <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#D3DAD9]/70" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[#D3DAD9]/70" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#D3DAD9]/70" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#D3DAD9]/70" />
          </div>
        </div>

        {/* Iris: enam bilah. Keadaan statis = terbuka. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="ap-iris">
            {BLADES.map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <polygon
                  className="ap-blade"
                  points="-1500,-2200 1500,-2200 1500,-700 -1500,-700"
                  fill="#37353E"
                  stroke="rgba(211,218,217,0.28)"
                  strokeWidth="2"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Kilatan shutter */}
        <div className="ap-flash pointer-events-none absolute inset-0 bg-[#D3DAD9] opacity-0" />
      </div>
    </section>
  );
}