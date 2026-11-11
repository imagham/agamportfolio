import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Frasa di dalam [[ ]] otomatis diberi gaya khusus (serif italic + stabilo).
const LEAD =
  "Saya adalah seorang [[software engineer]] yang memiliki semangat dalam menciptakan solusi-solusi [[inovatif]]. Dengan latar belakang yang kuat dalam pengembangan web dan ketertarikan terhadap [[desain]], saya berusaha membangun aplikasi yang tidak hanya fungsional, tetapi juga memiliki tampilan visual yang menarik. Perjalanan saya di dunia teknologi didorong oleh rasa ingin tahu serta keinginan untuk [[terus belajar dan berkembang]].";

const P4 =
  "Saya selalu terbuka terhadap peluang dan kolaborasi baru. Jika kamu tertarik untuk bekerja sama atau sekadar ingin menjalin komunikasi, [[jangan ragu|untuk menghubungi|saya!]]";

// Tambahkan font ini di CSS global:
// @import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
const KEY_FONT = "font-['Instrument_Serif',Georgia,serif]";

const splitKeys = (text) => text.split(/(\[\[.*?\]\])/g).filter(Boolean);

/* Lead: kata biasa = sans tebal, kata kunci = serif italic + stabilo */
function LeadText({ text }) {
  return splitKeys(text).map((part, pi) => {
    const key = part.startsWith("[[");
    const raw = key ? part.slice(2, -2) : part;
    return raw
      .trim()
      .split(/\s+/)
      .map((w, i) => (
        <span
          key={`${pi}-${i}`}
          className={`fill-word relative mr-[0.28em] inline-block ${
            key ? `${KEY_FONT} text-[1.15em] font-normal italic leading-none` : ""
          }`}
        >
          {key && (
            <span
              aria-hidden="true"
              className="mark absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.42em] origin-left bg-[#715A5A]/70"
            />
          )}
          {w}
        </span>
      ));
  });
}

/* Penutup tanpa card: tipografi raksasa + CTA pill dengan teks bergulir */
// Tambahkan font ini di CSS global:
// @import url("https://fonts.googleapis.com/css2?family=Anton&display=swap");
const DISPLAY_FONT = "font-['Anton',Impact,'Arial_Narrow',sans-serif]";

function Outro({ text }) {
  const m = text.match(/^([\s\S]*?)\[\[([\s\S]*?)\]\]/);
  const intro = (m ? m[1] : text).trim();
  const lines = (m ? m[2] : "").split("|");
  const introParts = intro.split(/(?<=\.)\s+/);

  return (
    <div className="relative">
      <span className={DOT} />
      <div className="about-outro">
        <div className="max-w-md text-lg leading-relaxed text-[#D3DAD9]/80 md:text-xl">
          {introParts.map((t, i) => (
            <span key={i} className="block overflow-hidden">
              <span className="outro-sent block">{t}</span>
            </span>
          ))}
        </div>

        <div
          className={`mt-10 ${DISPLAY_FONT} text-4xl uppercase leading-[0.95] tracking-tight md:text-6xl lg:text-[5rem]`}
        >
          {lines.map((ln, i) => {
            const outline = i % 2 === 1;
            const lineEl = (
              <span
                className="outro-line-wrap block overflow-hidden pb-[0.08em]"
                data-dir={outline ? -1 : 1}
              >
                <span
                  className={`outro-line block transition-colors duration-500 ${
                    outline ? "text-transparent hover:text-[#D3DAD9]" : ""
                  }`}
                  style={
                    outline
                      ? { WebkitTextStroke: "1.5px rgba(211,218,217,0.7)" }
                      : undefined
                  }
                >
                  {ln}
                </span>
              </span>
            );

            return <div key={i}>{lineEl}</div>;
          })}
        </div>

        {/* CTA: pill dengan teks bergulir + isi mauve menyapu dari bawah */}
        <a
          href="#contact"
          className="outro-cta group relative mt-12 inline-flex items-center gap-5 overflow-hidden rounded-full bg-[#D3DAD9] py-2 pl-8 pr-2 text-lg font-semibold text-[#37353E] transition-colors duration-500 hover:text-[#D3DAD9] md:text-xl"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-[#715A5A] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
          />

          <span className="relative block h-[1.5em] overflow-hidden leading-[1.5em]">
            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full">
              Mari bicara
            </span>
            <span
              aria-hidden="true"
              className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-full"
            >
              Mari bicara
            </span>
          </span>

          <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#37353E] text-[#D3DAD9] transition-colors duration-500 group-hover:bg-[#D3DAD9] group-hover:text-[#37353E] md:h-14 md:w-14">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-10 group-hover:translate-x-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="absolute h-5 w-5 -translate-x-10 translate-y-10 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:translate-x-0 group-hover:translate-y-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}

const SPREADS = [
  {
    word: "Create",
    dir: 1,
    text: "Selain memiliki keterampilan teknis, saya juga mempunyai sisi kreatif yang berkembang di luar dunia pemrograman. Saya senang mengeksplorasi berbagai bentuk seni dan fotografi, yang memungkinkan saya menghadirkan sudut pandang unik dalam setiap karya. Baik melalui mengabadikan momen dengan kamera maupun merancang antarmuka pengguna yang elegan, saya percaya bahwa kreativitas dan teknologi saling melengkapi.",
  },
  {
    word: "Wander",
    dir: -1,
    text: "Ketika tidak sedang menulis kode atau mengeksplorasi minat kreatif, saya senang menghabiskan waktu bersama teman dan keluarga, mengunjungi tempat-tempat baru, serta mengenal beragam budaya. Saya percaya bahwa setiap pengalaman memberikan pelajaran berharga untuk pengembangan diri dan membentuk cara saya menghadapi berbagai tantangan, baik dalam kehidupan pribadi maupun profesional.",
  },
];

const sentences = (t) => t.match(/[^.!?]+[.!?]+/g).map((s) => s.trim());

const DOT =
  "rail-dot absolute -left-8 top-3 -ml-1.5 h-3 w-3 rounded-full bg-[#D3DAD9] md:-left-12 lg:-left-14";

// Semua animasi memakai play/reverse atau scrub,
// jadi saat di-scroll balik, elemen menutup / kembali ke kondisi awal.
const REVERSE = "play none none reverse";

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* 1. Judul: huruf naik dari balik mask (menutup lagi saat scroll balik) */
        gsap.from(".about-char", {
          yPercent: 115,
          rotate: 10,
          transformOrigin: "0% 100%",
          duration: 1.1,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-title",
            start: "top 85%",
            toggleActions: REVERSE,
          },
        });

        /* 2. Viewfinder: bingkai tergambar + iris menutup mengikuti scroll */
        gsap.from(".vf-line, .vf-ring", {
          strokeDashoffset: 1,
          duration: 1.6,
          stagger: 0.15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".about-title",
            start: "top 80%",
            toggleActions: REVERSE,
          },
        });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top 50%",
              end: "bottom 80%",
              scrub: 1,
            },
          })
          .to(".iris", { rotate: 180, scale: 0.35, svgOrigin: "100 100" }, 0)
          .to(".vf-ring-wrap", { rotate: -120, svgOrigin: "100 100" }, 0)
          .to(".vf-dot", { scale: 2.4, svgOrigin: "100 100" }, 0);

        /* 3. Rail vertikal: garis terisi mengikuti scroll, titik menyala per bagian */
        gsap.fromTo(
          ".rail-fill",
          { scaleY: 0, transformOrigin: "50% 0%" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-right",
              start: "top 60%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );

        gsap.utils.toArray(".rail-dot").forEach((dot) => {
          gsap.fromTo(
            dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.6,
              ease: "back.out(3)",
              scrollTrigger: {
                trigger: dot.parentElement,
                start: "top 75%",
                toggleActions: REVERSE,
              },
            },
          );
        });

        /* 4. Paragraf utama: kata "fokus" satu per satu seperti lensa kamera
              (blur + redup -> tajam + terang), otomatis reversible */
        gsap.fromTo(
          ".fill-word",
          { opacity: 0.14, filter: "blur(6px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".about-lead",
              start: "top 75%",
              end: "bottom 50%",
              scrub: true,
            },
          },
        );

        /* 4b. Stabilo di kata kunci tersapu saat kata itu melewati garis baca */
        gsap.utils.toArray(".mark").forEach((mark) => {
          gsap.fromTo(
            mark,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: mark,
                start: "top 62%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
        });

        /* 5. Spread: garis tergambar, kata raksasa naik dari mask,
              kalimat naik satu per satu. Scroll balik = semuanya menutup. */
        gsap.utils.toArray(".spread").forEach((spread) => {
          const dir = Number(spread.dataset.dir);
          const chars = spread.querySelectorAll(".spread-char");
          const sents = spread.querySelectorAll(".sent");

          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: {
                trigger: spread,
                start: "top 78%",
                toggleActions: REVERSE,
              },
            })
            .fromTo(
              spread.querySelector(".spread-rule"),
              { scaleX: 0, transformOrigin: dir === 1 ? "0% 50%" : "100% 50%" },
              { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
            )
            .from(
              chars,
              {
                yPercent: 115,
                rotate: 8 * dir,
                transformOrigin: "0% 100%",
                duration: 0.9,
                stagger: 0.05,
              },
              0.15,
            )
            .from(sents, { yPercent: 110, duration: 0.9, stagger: 0.14 }, 0.45);

          // Huruf outline terisi penuh mengikuti scroll
          gsap.fromTo(
            chars,
            { color: "rgba(211,218,217,0)" },
            {
              color: "rgba(211,218,217,1)",
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: spread,
                start: "top 70%",
                end: "top 20%",
                scrub: true,
              },
            },
          );

          // Kata raksasa bergeser horizontal (arah bergantian)
          gsap.fromTo(
            spread.querySelector(".spread-word"),
            { xPercent: 10 * dir },
            {
              xPercent: -10 * dir,
              ease: "none",
              scrollTrigger: {
                trigger: spread,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        /* 6. Penutup: teks raksasa naik dari mask, bergeser berlawanan saat scroll,
              CTA muncul membal. Scroll balik = menutup lagi. */
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: {
              trigger: ".about-outro",
              start: "top 80%",
              toggleActions: REVERSE,
            },
          })
          .from(".outro-sent", { yPercent: 110, duration: 0.9, stagger: 0.12 })
          .from(
            ".outro-line",
            { yPercent: 110, skewY: 6, duration: 1.1, stagger: 0.12 },
            "-=0.5",
          )
          .from(
            ".outro-cta",
            { y: 40, scale: 0.7, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.6)" },
            "-=0.6",
          );

        gsap.utils.toArray(".outro-line-wrap").forEach((el) => {
          const d = Number(el.dataset.dir);
          gsap.fromTo(
            el,
            { xPercent: 6 * d },
            {
              xPercent: -6 * d,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-outro",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        /* 7. Glow latar bergerak berlawanan dengan scroll */
        gsap.to(".about-glow-a", {
          yPercent: -60,
          ease: "none",
          scrollTrigger: { trigger: root.current, scrub: true },
        });
        gsap.to(".about-glow-b", {
          yPercent: 50,
          ease: "none",
          scrollTrigger: { trigger: root.current, scrub: true },
        });

        /* 8. Tombol magnetik */
        const cta = root.current.querySelector(".outro-cta");
        const xTo = gsap.quickTo(cta, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(cta, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const move = (e) => {
          const r = cta.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        cta.addEventListener("mousemove", move);
        cta.addEventListener("mouseleave", leave);

        return () => {
          cta.removeEventListener("mousemove", move);
          cta.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="relative overflow-clip bg-[#44444E] px-6 py-28 text-[#D3DAD9] md:px-12 md:py-40 lg:px-20"
    >
      {/* Glow latar */}
      <div className="about-glow-a pointer-events-none absolute -left-40 top-1/3 h-112 w-md rounded-full bg-[#715A5A]/30 blur-[120px]" />
      <div className="about-glow-b pointer-events-none absolute -right-40 top-0 h-112 w-md rounded-full bg-[#D3DAD9]/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-20">
        {/* Kolom kiri: menempel (sticky) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
            <h2 className="about-title text-6xl font-extrabold leading-[0.95] tracking-tight md:text-7xl xl:text-8xl">
              {["About", "Me"].map((word, wi) => (
                <span key={wi} className="block overflow-hidden pb-2">
                  {word.split("").map((ch, i) => (
                    <span key={i} className="about-char inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Viewfinder: kamera + kode dalam satu bentuk */}
            <svg
              viewBox="0 0 200 200"
              role="img"
              aria-label="Camera viewfinder with a closing aperture"
              className="mt-12 hidden w-full max-w-[300px] lg:block"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g stroke="#D3DAD9" strokeWidth="2" opacity="0.7">
                <path className="vf-line" pathLength="1" strokeDasharray="1" d="M10 40 V10 H40" />
                <path className="vf-line" pathLength="1" strokeDasharray="1" d="M160 10 H190 V40" />
                <path className="vf-line" pathLength="1" strokeDasharray="1" d="M190 160 V190 H160" />
                <path className="vf-line" pathLength="1" strokeDasharray="1" d="M40 190 H10 V160" />
              </g>

              <g className="vf-ring-wrap">
                <circle
                  className="vf-ring"
                  cx="100"
                  cy="100"
                  r="66"
                  pathLength="1"
                  strokeDasharray="1"
                  stroke="#D3DAD9"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
                <circle cx="100" cy="100" r="78" stroke="#715A5A" strokeWidth="1.5" strokeDasharray="2 7" />
              </g>

              <g className="iris" stroke="#D3DAD9" strokeOpacity="0.8" strokeWidth="1.5">
                <polygon
                  points="148,100 124,141.6 76,141.6 52,100 76,58.4 124,58.4"
                  fill="#715A5A"
                  fillOpacity="0.35"
                />
                <polygon points="119,111 100,122 81,111 81,89 100,78 119,89" />
                <path d="M148 100 L119 111 M124 141.6 L100 122 M76 141.6 L81 111 M52 100 L81 89 M76 58.4 L100 78 M124 58.4 L119 89" />
              </g>

              <circle className="vf-dot" cx="100" cy="100" r="3" fill="#D3DAD9" />
            </svg>
          </div>
        </div>

        {/* Kolom kanan: konten tanpa card, dihubungkan oleh rail vertikal */}
        <div className="about-right relative flex flex-col gap-28 pl-8 md:pl-12 lg:col-span-7 lg:gap-40 lg:pl-14 lg:pt-6">
          {/* Rail */}
          <div className="absolute left-0 top-0 h-full w-px bg-[#D3DAD9]/15">
            <div className="rail-fill h-full w-full bg-[#D3DAD9]/70" />
          </div>

          {/* Lead */}
          <div className="relative">
            <span className={DOT} />
            <p className="about-lead max-w-2xl text-2xl font-semibold leading-snug md:text-3xl lg:text-[2.1rem] lg:leading-[1.25]">
              <LeadText text={LEAD} />
            </p>
          </div>

          {/* Spreads */}
          {SPREADS.map((s) => (
            <div
              key={s.word}
              data-dir={s.dir}
              className={`spread relative overflow-x-clip ${s.dir === -1 ? "lg:pl-10" : ""}`}
            >
              <span className={DOT} />
              <div className="spread-rule mb-6 h-px w-full bg-[#D3DAD9]/30" />

              <div className="spread-word -mb-2">
                <span className="block overflow-hidden pb-4">
                  <span
                    aria-label={s.word}
                    className="block text-6xl font-extrabold leading-none tracking-tight text-transparent md:text-7xl xl:text-[6.5rem]"
                    style={{ WebkitTextStroke: "1.5px rgba(211,218,217,0.6)" }}
                  >
                    {s.word.split("").map((ch, i) => (
                      <span key={i} aria-hidden="true" className="spread-char inline-block">
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              </div>

              <div className="mt-4 max-w-xl text-base leading-relaxed text-[#D3DAD9]/85 md:text-lg">
                {sentences(s.text).map((t, i) => (
                  <span key={i} className="mt-2 block overflow-hidden">
                    <span className="sent block">{t}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Penutup */}
          <Outro text={P4} />
        </div>
      </div>
    </section>
  );
}