import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font: sama dengan Hero (Unbounded + Plus Jakarta Sans).

  KONSEP (minimalis): satu panel rose #853953 sebagai penutup cerita. Headline polos, email,
  dan tiga kartu peran dengan satu bahasa visual yang sama: ikon garis tipis yang "digambar"
  saat muncul dan setiap kali di-hover. Footer satu baris yang tenang.

  PALET: #1F1F1F latar footer (menyambung dengan CreativeWorks) · #853953 panel · #2C2C2C kartu
  #F3F4F4 teks · #E58FA8 aksen kecil
  Ganti semua nilai di CONFIG di bawah dengan kontakmu yang asli.
*/
const CONFIG = {
  email: "imagham1224@gmail.com",
  project: "mailto:imagham1224@gmail.com?subject=Project%20inquiry",
  // Format WhatsApp wajib kode negara tanpa 0 di depan: 0857... menjadi 62857...
  cut: "https://wa.me/6285707408144",
  shoot: "https://www.instagram.com/imagham/",
  socials: [
    { label: "Instagram", href: "https://instagram.com/imagham" },
    { label: "GitHub", href: "https://github.com/imagham" },
    { label: "LinkedIn", href: "https://linkedin.com/in/imagham" },
  ],
  nav: [
    { label: "About", href: "#about" },
    { label: "Works", href: "#works" },
    { label: "Gallery", href: "#gallery" },
  ],
};

const DISPLAY = "font-['Unbounded',system-ui,sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";

const hex = (r) =>
  [0, 60, 120, 180, 240, 300]
    .map((a) => `${(r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`)
    .join(" ");

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3F4F4]";

/* Ikon garis (viewBox 24). Setiap bentuk digambar lewat stroke-dashoffset. */
const SHAPES = {
  code: [
    { d: "m8 7-5 5 5 5" },
    { d: "m16 7 5 5-5 5" },
    { d: "m14 4-4 16" },
  ],
  aperture: [
    { c: [12, 12, 10] },
    { d: "m14.31 8 5.74 9.94" },
    { d: "M9.69 8h11.48" },
    { d: "m7.38 12 5.74-9.94" },
    { d: "M9.69 16 3.95 6.06" },
    { d: "M14.31 16H2.83" },
    { d: "m16.62 12-5.74 9.94" },
  ],
  scissors: [
    { c: [6, 6, 3] },
    { d: "M8.12 8.12 12 12" },
    { d: "M20 4 8.12 15.88" },
    { c: [6, 18, 3] },
    { d: "M14.8 14.8 20 20" },
  ],
};

const Arrow = ({ className = "size-4", up = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={up ? "M12 19V5M5 12l7-7 7 7" : "M7 17 17 7M8 7h9v9"} />
  </svg>
);

function LineIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="#E58FA8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-7 ${name === "aperture" ? "transition-transform duration-700 ease-out motion-safe:group-hover:rotate-[60deg]" : ""}`}
    >
      {SHAPES[name].map((s, i) =>
        s.c ? (
          <circle key={i} className="ic" cx={s.c[0]} cy={s.c[1]} r={s.c[2]} pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
        ) : (
          <path key={i} className="ic" d={s.d} pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 0 }} />
        ),
      )}
    </svg>
  );
}

function Tile({ href, icon, title, text, action, external }) {
  const el = useRef(null);

  // Hover: ikon digambar ulang
  const redraw = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el.current.querySelectorAll(".ic"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05, ease: "power2.out", overwrite: "auto" });
  };

  return (
    <a
      ref={el}
      href={href}
      onPointerEnter={redraw}
      className={`tile group relative flex min-h-[16rem] flex-col justify-between rounded-3xl bg-[#2C2C2C] p-6 transition-transform duration-300 hover:-translate-y-1 ${focusRing}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="flex items-start justify-between">
        <span aria-hidden="true" className="grid size-14 place-items-center rounded-full border border-[#F3F4F4]/12">
          <LineIcon name={icon} />
        </span>
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-[#F3F4F4]/10 transition-colors duration-300 group-hover:bg-[#E58FA8] group-hover:text-[#1F1F1F]">
          <Arrow />
        </span>
      </span>
      <span className="block">
        <span className={`${DISPLAY} block text-lg font-medium tracking-[-0.02em]`}>{title}</span>
        <span className="mt-2 block max-w-[17rem] text-sm leading-relaxed text-[#F3F4F4]/70">{text}</span>
        <span className="mt-5 inline-block text-sm font-semibold text-[#E58FA8] underline decoration-[#E58FA8]/30 underline-offset-[6px] transition group-hover:decoration-[#E58FA8]">
          {action}
        </span>
      </span>
    </a>
  );
}

export default function Contact() {
  const rootRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Satu sekuens masuk saat panel terlihat */
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: ".cta-block", start: "top 78%", once: true },
          })
          .from(".line > span", { yPercent: 115, duration: 1.1, stagger: 0.12 })
          .from(".fade-in", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .from(".tile", { opacity: 0, y: 36, duration: 0.9, stagger: 0.12, clearProps: "transform,opacity" }, "-=0.7")
          .from(".ic", { strokeDashoffset: 1, duration: 1.2, stagger: 0.03, ease: "power2.inOut" }, "-=0.8");

        /* Wordmark: naik pelan saat terlihat */
        gsap.from(".mark-letter", {
          yPercent: 100,
          duration: 1.3,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".mark", start: "top 95%", once: true },
        });

        /* Heksagon di panel: berputar sangat pelan, berlawanan arah */
        gsap.set(".ct-hex", { svgOrigin: "0 0" });
        gsap.to(".ct-hex-a", { rotation: 360, duration: 90, ease: "none", repeat: -1 });
        gsap.to(".ct-hex-b", { rotation: -360, duration: 70, ease: "none", repeat: -1 });
      });
    },
    { scope: rootRef },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia: link mailto tetap bisa dipakai */
    }
  };

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer ref={rootRef} id="contact" className={`relative overflow-hidden bg-[#2C2C2C] px-4 pt-4 text-[#F3F4F4] md:px-8 ${BODY}`}>
      {/* ---------- Panel kontak ---------- */}
      <div className="cta-block relative overflow-hidden rounded-[2rem] bg-[#853953] px-6 py-14 md:rounded-[2.5rem] md:px-12 md:py-20 lg:px-16">
        {/* Heksagon diafragma, sangat tipis */}
        <svg aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] md:-right-24 md:-top-24" viewBox="-250 -250 500 500" fill="none" stroke="#F3F4F4">
          <polygon className="ct-hex ct-hex-a" points={hex(240)} strokeOpacity="0.18" />
          <polygon className="ct-hex ct-hex-b" points={hex(170)} strokeOpacity="0.12" />
          <polygon className="ct-hex ct-hex-a" points={hex(100)} strokeOpacity="0.08" />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <h2 className={`${DISPLAY} text-[clamp(1.9rem,6vw,5rem)] font-medium leading-[1.06] tracking-[-0.045em]`}>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">Let's make something</span>
            </span>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">worth keeping.</span>
            </span>
          </h2>

          <div className="fade-in mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <a
              href={`mailto:${CONFIG.email}`}
              className={`${DISPLAY} break-all text-[clamp(1.1rem,2.6vw,2rem)] font-medium tracking-[-0.03em] underline decoration-[#F3F4F4]/40 underline-offset-[10px] transition hover:decoration-[#F3F4F4] ${focusRing}`}
            >
              {CONFIG.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className={`rounded-full border border-[#F3F4F4]/40 px-5 py-2.5 text-sm font-semibold transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C] ${focusRing}`}
            >
              {copied ? "Copied" : "Copy email"}
            </button>
            <span role="status" className="sr-only">{copied ? "Email copied to clipboard" : ""}</span>
          </div>

          {/* Kartu per peran */}
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Tile href={CONFIG.project} icon="code" title="Engineer" text="Web apps, landing pages, and product builds." action="Start a project" />
            <Tile href={CONFIG.shoot} external icon="aperture" title="Photographer" text="Portraits, events, and products in natural light." action="Plan a shoot" />
            <Tile href={CONFIG.cut} external icon="scissors" title="Barber" text="Clean fades and sharp lines, walk-in or by appointment." action="Book a cut" />
          </div>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-2 md:px-4">
        <div className="grid gap-10 pt-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#" className={`${DISPLAY} text-lg font-bold ${focusRing}`}>imagham</a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#F3F4F4]/65">
              Software engineer, barber, and photographer.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:ml-auto md:min-w-[22rem]">
            <div>
              <p className="text-sm text-[#F3F4F4]/45">Menu</p>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                {CONFIG.nav.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={`text-[#F3F4F4]/80 transition hover:text-[#E58FA8] ${focusRing}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-[#F3F4F4]/45">Social</p>
              <ul className="mt-4 space-y-3 text-sm font-medium">
                {CONFIG.socials.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-[#F3F4F4]/80 transition hover:text-[#E58FA8] ${focusRing}`}>
                      {l.label}
                      <Arrow className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#F3F4F4]/10 pt-6 text-sm text-[#F3F4F4]/60">
          <p>&copy; {new Date().getFullYear()} imagham. All rights reserved.</p>
          <button
            type="button"
            onClick={toTop}
            className={`inline-flex items-center gap-2 rounded-full border border-[#F3F4F4]/20 py-2 pl-4 pr-3 text-[#F3F4F4]/80 transition hover:border-[#F3F4F4] hover:text-[#F3F4F4] ${focusRing}`}
          >
            Back to top
            <Arrow className="size-4" up />
          </button>
        </div>

        {/* Wordmark: hanya tekstur yang sangat tenang. Hapus blok ini kalau mau footer lebih polos. */}
        <div aria-hidden="true" className="[mask-image:linear-gradient(to_bottom,black_20%,transparent_95%)]">
          <div className={`mark ${DISPLAY} flex select-none justify-center overflow-hidden pt-8 text-[clamp(3.5rem,19vw,17rem)] font-bold leading-[0.95] tracking-[-0.05em] text-[#F3F4F4]/[0.05]`}>
            {"imagham".split("").map((ch, i) => (
              <span key={i} className="mark-letter inline-block">{ch}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}