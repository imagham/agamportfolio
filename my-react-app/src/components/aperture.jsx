import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font: Geist. Tambahkan sekali di CSS global:
  @import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap");
*/
const SANS = "font-['Geist',system-ui,sans-serif]";
const BLADES = [0, 60, 120, 180, 240, 300];

/*
  Konsep: teks berada tepat di tengah bukaan diafragma.
  1. Layar mulai tertutup enam bilah iris, lalu membuka sambil berputar.
     Cahaya rose di baliknya terungkap seiring bukaan membesar.
  2. Cincin lensa tipis ikut mengembang di balik bilah.
  3. Judul di tengah menajam dari buram (focus pull), baris kedua terisi dari kiri.
  4. Bingkai fokus mengunci di sekeliling judul, lalu "Fokus terkunci" menyala.
  Reduced motion: langsung tampil terbuka dan tajam.

  PALET: #2C2C2C latar (menyambung mulus dengan About), #612D53 bilah, #853953 cahaya,
  #E58FA8 garis dan titik status (turunan rose), #F3F4F4 teks.
*/
export default function Aperture() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".ap-iris", { svgOrigin: "0 0" });
        gsap.set(".ap-ring", { svgOrigin: "0 0" });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
          })
          // Bilah membuka + berputar
          .fromTo(".ap-blade", { y: 700 }, { y: 0, duration: 1.2, ease: "power2.inOut" }, 0)
          .fromTo(".ap-iris", { rotate: 0 }, { rotate: 80, duration: 1.2, ease: "power2.inOut" }, 0)
          // Cahaya di balik bukaan membesar
          .fromTo(".ap-glow", { scale: 0.4, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1.3, ease: "power2.out" }, 0)
          // Cincin lensa mengembang
          .fromTo(".ap-ring", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: 0.12, ease: "power2.out" }, 0.2)
          // Judul: fokus menajam dari buram
          .fromTo(
            ".ap-text",
            { filter: "blur(20px)", opacity: 0.15, scale: 0.94 },
            { filter: "blur(0px)", opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
            0.5,
          )
          // Baris kedua: dari redup ke terang, menyapu dari kiri
          .fromTo(".ap-fill", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power2.inOut" }, 1.15)
          // Bingkai fokus mengunci
          .fromTo(".ap-reticle", { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }, 1.6)
          .fromTo(".ap-lock", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.75)
          .fromTo(".ap-dot", { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 1.8)
          // Dorongan zoom kecil sebelum lepas
          .to(".ap-stage", { scale: 1.04, duration: 0.5 }, 1.85);
      });
    },
    { scope: root },
  );

  const corner = "absolute h-6 w-6 border-[#F3F4F4]/80 md:h-8 md:w-8";

  return (
    <section ref={root} className={`${SANS} relative h-[260vh] bg-[#2C2C2C] text-[#F3F4F4] antialiased`}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[#2C2C2C]">
        {/* Cahaya hangat di balik bukaan */}
        <div
          aria-hidden="true"
          className="ap-glow pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(48% 52% at 50% 50%, rgba(229,143,168,0.40) 0%, rgba(133,57,83,0.58) 40%, rgba(97,45,83,0.34) 66%, rgba(44,44,44,0) 85%)",
          }}
        />

        {/* Cincin lensa + iris */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="-500 -500 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="ap-grad-a" gradientUnits="userSpaceOnUse" x1="0" y1="-700" x2="0" y2="-1500">
              <stop offset="0" stopColor="#612D53" />
              <stop offset="1" stopColor="#3F1D37" />
            </linearGradient>
            <linearGradient id="ap-grad-b" gradientUnits="userSpaceOnUse" x1="0" y1="-700" x2="0" y2="-1500">
              <stop offset="0" stopColor="#52264A" />
              <stop offset="1" stopColor="#34162E" />
            </linearGradient>
            {/* Bayangan di bawah tepi bilah, jatuh ke arah bukaan */}
            <linearGradient id="ap-shade" gradientUnits="userSpaceOnUse" x1="0" y1="-700" x2="0" y2="-560">
              <stop offset="0" stopColor="#000" stopOpacity="0.55" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </linearGradient>
          </defs>

          <g fill="none" stroke="#E58FA8">
            <circle className="ap-ring" r="300" strokeOpacity="0.32" />
            <circle className="ap-ring" r="400" strokeOpacity="0.20" />
            <circle className="ap-ring" r="500" strokeOpacity="0.12" />
          </g>

          <g className="ap-iris">
            {BLADES.map((deg, i) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <polygon
                  className="ap-blade"
                  points="-1500,-700 1500,-700 1500,-560 -1500,-560"
                  fill="url(#ap-shade)"
                />
                <polygon
                  className="ap-blade"
                  points="-1500,-2200 1500,-2200 1500,-700 -1500,-700"
                  fill={i % 2 === 0 ? "url(#ap-grad-a)" : "url(#ap-grad-b)"}
                />
                <line
                  className="ap-blade"
                  x1="-1500"
                  y1="-700"
                  x2="1500"
                  y2="-700"
                  stroke="#E58FA8"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* Judul di tengah bukaan */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
          <div className="ap-stage relative px-8 py-10 md:px-16 md:py-14">
            <h2 className="ap-text text-center text-5xl font-medium leading-[0.98] tracking-[-0.04em] drop-shadow-[0_4px_30px_rgba(44,44,44,0.55)] md:text-7xl xl:text-[7.5rem]">
              <span className="block pb-[0.06em]">Dari balik lensa,</span>
              <span className="relative block pb-[0.06em]">
                {/* Lapisan redup (selalu ada) */}
                <span className="text-[#F3F4F4]/25" aria-hidden="true">ke balik layar.</span>
                {/* Lapisan terang: terbuka dari kiri */}
                <span className="ap-fill absolute inset-0 block">ke balik layar.</span>
              </span>
            </h2>

            {/* Bingkai fokus */}
            <div aria-hidden="true" className="ap-reticle pointer-events-none absolute inset-0">
              <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
              <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
              <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
              <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
}