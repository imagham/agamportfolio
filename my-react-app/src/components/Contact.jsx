import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font: sama dengan Hero (Unbounded + Plus Jakarta Sans).

  KONSEP: melanjutkan Hero. Headline besar + pill tiang barber, lalu tiga tile kontak
  sesuai peran (Engineer / Barber / Photographer) dengan animasi mini yang sama,
  diakhiri footer dengan wordmark raksasa yang memudar.
  Ganti semua nilai di CONFIG di bawah dengan kontakmu yang asli.
*/
const CONFIG = {
  email: "imagham1224@gmail.com",
  project: "mailto:imagham1224@gmail.com?subject=Project%20inquiry",
  cut: "https://wa.me/085707408144",
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

const BARS = 14;
const fadeHeight = (i) => 16 + (i / (BARS - 1)) * 72;
const POLE_SIZE = 56.57;
const POLE =
  "repeating-linear-gradient(-45deg,#E5484D 0 10px,#ECEEF0 10px 20px,#3E63DD 20px 30px,#ECEEF0 30px 40px)";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9]";

const TILE = `tile group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#D3DAD9]/10 bg-[#44444E]/45 p-5 backdrop-blur-xl transition-colors hover:border-[#D3DAD9]/35 ${focusRing}`;

function Tile({ href, visual, title, text, action, external }) {
  return (
    <a href={href} className={TILE} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span aria-hidden="true" className="relative block h-28 overflow-hidden rounded-2xl border border-[#D3DAD9]/10 bg-[#2a2830]/80">
        {visual}
      </span>
      <span className="mt-5 block">
        <span className={`${DISPLAY} block text-sm font-medium tracking-[-0.02em]`}>{title}</span>
        <span className="mt-1 block text-sm leading-snug text-[#D3DAD9]/65">{text}</span>
        <span className="mt-4 inline-block text-sm font-semibold underline decoration-[#D3DAD9]/30 underline-offset-[6px] transition group-hover:decoration-[#D3DAD9]">
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
        /* Satu sekuens masuk saat section terlihat */
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: ".cta-block", start: "top 78%", once: true },
          })
          .from(".line > span", { yPercent: 115, duration: 1.1, stagger: 0.12 })
          .from(".fade-in", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .from(".tile", { opacity: 0, y: 36, duration: 0.9, stagger: 0.12 }, "-=0.7");

        gsap.from(".mark-letter", {
          yPercent: 100,
          duration: 1.3,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".mark", start: "top 95%", once: true },
        });

        /* Pill tiang barber */
        gsap.fromTo(
          ".pole",
          { backgroundPosition: "0px 0px" },
          { backgroundPosition: `${POLE_SIZE}px 0px`, duration: 1.3, ease: "none", repeat: -1 },
        );

        /* Barber: acak -> fade */
        const bars = gsap.utils.toArray(".bar");
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.6, delay: 1 })
          .to(bars, {
            height: () => gsap.utils.random(30, 96) + "%",
            duration: 0.5,
            ease: "power2.inOut",
            stagger: { each: 0.01, from: "random" },
          })
          .to(
            bars,
            { height: (i) => fadeHeight(i) + "%", duration: 0.9, ease: "power3.inOut", stagger: { each: 0.04, from: "start" } },
            "+=0.6",
          );

        /* Photographer: cari fokus lalu kunci */
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.2 })
          .to(".focus", { x: -16, y: 8, scale: 1.25, duration: 0.5, ease: "power2.inOut" })
          .to(".focus", { x: 14, y: -6, scale: 0.8, duration: 0.45, ease: "power2.inOut" })
          .to(".focus", { x: 0, y: 0, scale: 1, borderColor: "#FFC857", duration: 0.4, ease: "back.out(2)" })
          .to(".focus", { borderColor: "rgba(211,218,217,0.8)", duration: 0.3 }, "+=1.2");

        gsap.to(".bokeh", {
          x: "random(-12,12)",
          y: "random(-12,12)",
          duration: "random(3,5)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.4,
        });

        /* Engineer: caret */
        gsap.to(".caret", { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });
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
    <footer
      ref={rootRef}
      id="contact"
      className={`relative overflow-hidden bg-[#37353E] px-5 pt-24 text-[#D3DAD9] md:px-10 lg:px-16 ${BODY}`}
    >
      {/* Latar */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 size-[30rem] rounded-full bg-[#715A5A]/35 blur-3xl" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(211,218,217,0.12)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* ---------- Contact ---------- */}
        <div className="cta-block">
          <h2 className={`${DISPLAY} text-[clamp(1.9rem,6vw,5.25rem)] font-medium leading-[1.04] tracking-[-0.045em]`}>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">
                Let's make something{" "}
                <span
                  aria-hidden="true"
                  className="relative ml-[0.1em] hidden h-[0.62em] w-[1.7em] -translate-y-[0.06em] overflow-hidden rounded-full border border-[#D3DAD9]/30 align-middle sm:inline-block"
                >
                  <span className="pole absolute inset-0" style={{ backgroundImage: POLE, backgroundSize: `${POLE_SIZE}px ${POLE_SIZE}px` }} />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent_45%,rgba(0,0,0,0.25))]" />
                </span>
              </span>
            </span>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">worth keeping.</span>
            </span>
          </h2>

          <div className="fade-in mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
            <a
              href={`mailto:${CONFIG.email}`}
              className={`${DISPLAY} break-all text-[clamp(1.1rem,3vw,2.25rem)] font-medium tracking-[-0.03em] underline decoration-[#D3DAD9]/30 underline-offset-[10px] transition hover:decoration-[#D3DAD9] ${focusRing}`}
            >
              {CONFIG.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className={`rounded-full border border-[#D3DAD9]/35 px-5 py-2.5 text-sm font-semibold transition hover:border-[#D3DAD9] ${focusRing}`}
            >
              {copied ? "Copied" : "Copy email"}
            </button>
            <span role="status" className="sr-only">{copied ? "Email copied to clipboard" : ""}</span>
          </div>

          {/* Tile kontak per peran */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Tile
              href={CONFIG.project}
              title="Engineer"
              text="Web apps, landing pages, and product builds."
              action="Start a project"
              visual={
                <span className="block p-4 font-mono text-xs leading-6">
                  <span className="block text-[#D3DAD9]/45">// next up</span>
                  <span className="block">
                    <span className="text-[#9FB3FF]">await</span> build(<span className="text-[#E6B8A2]">"yours"</span>);
                    <span className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-[#D3DAD9]" />
                  </span>
                </span>
              }
            />
            <Tile
              href={CONFIG.cut}
              external
              title="Barber"
              text="Clean fades and sharp lines, walk-in or by appointment."
              action="Book a cut"
              visual={
                <span className="flex h-full items-end gap-[3px] px-3 pb-3 pt-4">
                  {Array.from({ length: BARS }, (_, i) => (
                    <span key={i} className="bar flex-1 rounded-full bg-gradient-to-t from-[#715A5A] to-[#D3DAD9]" style={{ height: `${fadeHeight(i)}%` }} />
                  ))}
                </span>
              }
            />
            <Tile
              href={CONFIG.shoot}
              external
              title="Photographer"
              text="Portraits, events, and products in natural light."
              action="Plan a shoot"
              visual={
                <span className="block h-full">
                  <span className="bokeh absolute left-[14%] top-[22%] size-10 rounded-full bg-[#E6B8A2] opacity-50 blur-md" />
                  <span className="bokeh absolute left-[70%] top-[14%] size-8 rounded-full bg-[#9FB3FF] opacity-50 blur-md" />
                  <span className="bokeh absolute left-[62%] top-[56%] size-12 rounded-full bg-[#E6B8A2] opacity-30 blur-md" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="focus size-10 rounded-md border-2 border-[#D3DAD9]/80" />
                  </span>
                </span>
              }
            />
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="mt-24 grid gap-10 border-t border-[#D3DAD9]/15 pt-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <a href="#" className={`${DISPLAY} text-lg font-bold ${focusRing}`}>imagham</a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#D3DAD9]/65">
              Software engineer, barber, and photographer. Building things that are worth keeping.
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:justify-items-end">
            <ul className="space-y-3 text-sm font-medium md:min-w-32">
              {CONFIG.nav.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={`text-[#D3DAD9]/70 transition hover:text-[#D3DAD9] ${focusRing}`}>{l.label}</a>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 text-sm font-medium md:min-w-32">
              {CONFIG.socials.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={`text-[#D3DAD9]/70 transition hover:text-[#D3DAD9] ${focusRing}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm text-[#D3DAD9]/55">
          <p>&copy; {new Date().getFullYear()} imagham. All rights reserved.</p>
          <button
            type="button"
            onClick={toTop}
            className={`rounded-full border border-[#D3DAD9]/25 px-4 py-2 text-[#D3DAD9]/80 transition hover:border-[#D3DAD9] hover:text-[#D3DAD9] ${focusRing}`}
          >
            Back to top
          </button>
        </div>

        {/* Wordmark raksasa yang memudar */}
        <div aria-hidden="true" className="[mask-image:linear-gradient(to_bottom,black_25%,transparent_95%)]">
          <div className={`mark ${DISPLAY} flex select-none justify-center overflow-hidden pt-8 text-[clamp(3.5rem,19vw,17rem)] font-bold leading-[0.95] tracking-[-0.05em] text-[#D3DAD9]/15`}>
            {"imagham".split("").map((ch, i) => (
              <span key={i} className="mark-letter inline-block">{ch}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
