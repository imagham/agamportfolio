import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* Foto dari src/assets (nama file harus persis sama, termasuk huruf besar-kecil) */
import street from "../assets/street.jpg";
import night from "../assets/night.jpg";
import streetlanscape from "../assets/streetlanscape.jpg";
import tower from "../assets/tower.jpg";
import jalanan from "../assets/jalanan.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Tambahkan font ini di CSS global:
// @import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap");
const SANS = "font-['Geist',system-ui,sans-serif]";

/*
  PALET
  #2C2C2C charcoal  : latar utama
  #853953 rose      : bidang aksen (tombol, hover). Jangan dipakai sebagai teks di atas gelap (kontras 1.8)
  #612D53 plum      : bidang pendukung
  #F3F4F4 putih     : semua teks
  #E58FA8 rose muda : turunan rose untuk garis, hover, dan progres di atas gelap (kontras 5.9)
  #1F1F1F           : turunan charcoal yang lebih dalam (placeholder foto)
*/

// Frasa di dalam [[ ]] ditonjolkan (lebih terang + garis bawah).
const LEAD =
  "Saya adalah seorang [[software engineer]] yang memiliki semangat dalam menciptakan solusi-solusi [[inovatif]]. Dengan latar belakang yang kuat dalam pengembangan web dan ketertarikan terhadap [[desain]], saya berusaha membangun aplikasi yang tidak hanya fungsional, tetapi juga memiliki tampilan visual yang menarik. Perjalanan saya di dunia teknologi didorong oleh rasa ingin tahu serta keinginan untuk [[terus belajar dan berkembang]].";

const P4 =
  "Saya selalu terbuka terhadap peluang dan kolaborasi baru. Jika kamu tertarik untuk bekerja sama atau sekadar ingin menjalin komunikasi, [[jangan ragu|untuk menghubungi|saya!]]";

/* ============ FOTO: tukar file sesuai selera ============
   Create = karya (foto dan visual), Wander = perjalanan dan tempat.
   speed = seberapa jauh foto "melayang" saat scroll (px). Beda tiap foto = terasa berlapis. */
const PHOTOS = {
  create: [
    { src: street, alt: "Foto jalanan", cls: "col-span-3 aspect-[4/5]", speed: 50 },
    { src: night, alt: "Foto suasana malam", cls: "col-span-3 aspect-[4/5] mt-10 md:mt-16", speed: -40 },
    { src: streetlanscape, alt: "Foto jalanan", cls: "col-span-6 aspect-[21/9]", speed: 25 },
  ],
  wander: [
    { src: jalanan, alt: "Foto jalanan", cls: "col-span-4 aspect-[4/3]", speed: -30 },
    { src: tower, alt: "Foto menara", cls: "col-span-2 aspect-[2/3] -mt-10 md:-mt-20", speed: 60 },
  ],
};

const SECTIONS = [
  {
    id: "create",
    title: "Create",
    text: "Selain memiliki keterampilan teknis, saya juga mempunyai sisi kreatif yang berkembang di luar dunia pemrograman. Saya senang mengeksplorasi berbagai bentuk seni dan fotografi, yang memungkinkan saya menghadirkan sudut pandang unik dalam setiap karya. Baik melalui mengabadikan momen dengan kamera maupun merancang antarmuka pengguna yang elegan, saya percaya bahwa kreativitas dan teknologi saling melengkapi.",
  },
  {
    id: "wander",
    title: "Wander",
    text: "Ketika tidak sedang menulis kode atau mengeksplorasi minat kreatif, saya senang menghabiskan waktu bersama teman dan keluarga, mengunjungi tempat-tempat baru, serta mengenal beragam budaya. Saya percaya bahwa setiap pengalaman memberikan pelajaran berharga untuk pengembangan diri dan membentuk cara saya menghadapi berbagai tantangan, baik dalam kehidupan pribadi maupun profesional.",
  },
];

const NAV = [
  { id: "intro", label: "Tentang saya" },
  { id: "create", label: "Create" },
  { id: "wander", label: "Wander" },
  { id: "contact", label: "Kontak" },
];

const splitKeys = (text) => text.split(/(\[\[.*?\]\])/g).filter(Boolean);
const REVERSE = "play none none reverse";

/* Lead: tiap kata dianimasikan; kata kunci diberi data-key */
function LeadText({ text }) {
  return splitKeys(text).map((part, pi) => {
    const key = part.startsWith("[[");
    const raw = key ? part.slice(2, -2) : part;
    const spans = raw.trim().split(/\s+/).map((w, i) => (
      <span key={`${pi}-${i}`} className="fill-word mr-[0.26em] inline-block" data-key={key ? "1" : undefined}>
        {w}
      </span>
    ));
    return key ? (
      <span key={pi} className="underline decoration-[#E58FA8] decoration-[3px] underline-offset-[0.18em]">{spans}</span>
    ) : (
      spans
    );
  });
}

function Words({ text }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="p-word mr-[0.26em] inline-block">{w}</span>
  ));
}

function Photo({ src, alt, cls, speed }) {
  return (
    <figure data-speed={speed} className={`photo relative overflow-hidden rounded-2xl bg-[#1F1F1F] ${cls}`}>
      <div className="photo-inner absolute inset-x-0 -top-[8%] h-[116%]">
        {src ? (
          <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
        ) : (
          <div role="img" aria-label={alt} className="grid size-full place-items-center bg-[linear-gradient(135deg,#1F1F1F_0%,#612D53_60%,#853953_100%)]">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-10 opacity-40" fill="none" stroke="#F3F4F4" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          </div>
        )}
      </div>
    </figure>
  );
}

/* Kontak: minimalis. Garis tipis, teks, dan satu tombol. */
function Outro({ text }) {
  const m = text.match(/^([\s\S]*?)\[\[([\s\S]*?)\]\]/);
  const intro = (m ? m[1] : text).trim();
  const lines = (m ? m[2] : "").split("|").map((l, i) => (i === 0 ? l.charAt(0).toUpperCase() + l.slice(1) : l));
  const introParts = intro.split(/(?<=\.)\s+/);

  return (
    <div className="about-outro border-t border-[#F3F4F4]/10 pt-16 md:pt-24">
      <div className="max-w-md text-lg leading-relaxed text-[#F3F4F4]/70 md:text-xl">
        {introParts.map((t, i) => (
          <span key={i} className="block overflow-hidden">
            <span className="outro-sent block">{t}</span>
          </span>
        ))}
      </div>

      <h3 className="mt-8 text-5xl font-semibold leading-[1] tracking-[-0.04em] md:text-7xl xl:text-8xl">
        {lines.map((ln, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em]">
            <span className="outro-line block">{ln}</span>
          </span>
        ))}
      </h3>

      {/* href menuju section Kontak di landing page (id: s-contact) */}
      <a
        href="#s-contact"
        className="outro-cta group mt-12 inline-flex items-center gap-3 rounded-full border border-[#F3F4F4]/25 py-3 pl-7 pr-5 text-lg font-medium transition-colors duration-300 hover:border-[#853953] hover:bg-[#853953] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E58FA8]"
      >
        Mari bicara
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </div>
  );
}

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" },
        (ctx) => {
          const { motion, desktop } = ctx.conditions;
          if (!motion) return;
          const small = window.innerWidth < 768;

          /* 1. Judul: huruf naik dari balik mask, lalu seluruh judul melayang naik pelan saat scroll */
          gsap.from(".about-char", {
            yPercent: 110, duration: 1.1, stagger: 0.05, ease: "power4.out",
            scrollTrigger: { trigger: ".about-title", start: "top 90%", toggleActions: REVERSE },
          });
          gsap.to(".about-title", {
            yPercent: -22, ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=900", scrub: true },
          });

          /* 2. Lead: di desktop, paragraf DIKUNCI di layar sementara kata-katanya menyala satu per satu.
                Kata kunci berakhir paling terang. */
          const fill = { opacity: (i, el) => (el.dataset.key ? 1 : 0.62), ease: "none", stagger: 0.1 };
          if (desktop) {
            gsap
              .timeline({ scrollTrigger: { trigger: ".lead-pin", start: "top top", end: "+=140%", pin: true, scrub: true } })
              .fromTo(".fill-word", { opacity: 0.16 }, fill);
          } else {
            gsap.fromTo(".fill-word", { opacity: 0.16 }, {
              ...fill,
              scrollTrigger: { trigger: ".about-lead", start: "top 80%", end: "bottom 50%", scrub: true },
            });
          }

          /* 3. Judul bagian naik pelan; paragraf menyala per kata mengikuti scroll */
          gsap.utils.toArray(".reveal").forEach((el) => {
            gsap.from(el, {
              y: 28, opacity: 0, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: REVERSE },
            });
          });
          gsap.utils.toArray(".para").forEach((p) => {
            gsap.fromTo(p.querySelectorAll(".p-word"), { opacity: 0.2 }, {
              opacity: 1, ease: "none", stagger: 0.08,
              scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 58%", scrub: true },
            });
          });

          /* 4. Foto: terbuka dari bawah; tiap foto melayang dengan kecepatan berbeda;
                isi foto sedikit membesar lalu mengendap */
          gsap.utils.toArray(".photo").forEach((ph) => {
            const speed = Number(ph.dataset.speed || 0) * (small ? 0.5 : 1);
            gsap.fromTo(ph, { clipPath: "inset(100% 0% 0% 0%)" }, {
              clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out",
              scrollTrigger: { trigger: ph, start: "top 90%", toggleActions: REVERSE },
            });
            gsap.fromTo(ph, { y: speed }, {
              y: -speed, ease: "none",
              scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: true },
            });
            gsap.fromTo(ph.querySelector(".photo-inner"), { yPercent: -6.5, scale: 1.15 }, {
              yPercent: 6.5, scale: 1, ease: "none",
              scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: true },
            });
          });

          /* 5. Navigasi samping: bagian aktif menyala + bar progres seluruh bagian */
          const items = gsap.utils.toArray(".toc-item");
          gsap.set(items, { opacity: 0.4 });
          gsap.set(".toc-line", { scaleX: 0.3, transformOrigin: "0% 50%" });
          NAV.forEach((n, i) => {
            ScrollTrigger.create({
              trigger: `#about-${n.id}`, start: "top 55%", end: "bottom 55%",
              onToggle: (self) => {
                gsap.to(items[i], { opacity: self.isActive ? 1 : 0.4, duration: 0.3 });
                gsap.to(items[i].querySelector(".toc-line"), { scaleX: self.isActive ? 1 : 0.3, duration: 0.4, ease: "power3.out" });
              },
            });
          });
          gsap.fromTo(".toc-bar", { scaleX: 0 }, {
            scaleX: 1, ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 30%", end: "bottom 80%", scrub: true },
          });

          /* 6. Kontak: teks dan tombol muncul pelan dari balik mask.
                Latar sengaja tidak diubah lagi supaya ujung bawah About (#2C2C2C)
                menyambung mulus dengan Aperture. */
          gsap
            .timeline({
              defaults: { ease: "power4.out" },
              scrollTrigger: { trigger: ".about-outro", start: "top 80%", toggleActions: REVERSE },
            })
            .from(".outro-sent", { yPercent: 110, duration: 0.9, stagger: 0.12 })
            .from(".outro-line", { yPercent: 110, duration: 1, stagger: 0.12 }, "-=0.5")
            .from(".outro-cta", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className={`${SANS} relative overflow-clip bg-[#2C2C2C] px-6 py-24 text-[#F3F4F4] md:px-12 md:py-36 lg:px-20`}>
      <div className="mx-auto max-w-7xl">
        <h2 className="about-title mb-16 text-7xl font-semibold leading-none tracking-[-0.05em] md:mb-24 md:text-[9rem] xl:text-[12rem]">
          <span className="block overflow-hidden pb-[0.08em]">
            {"About me".split("").map((ch, i) => (
              <span key={i} className="about-char inline-block whitespace-pre">{ch}</span>
            ))}
          </span>
        </h2>

        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
          {/* Daftar isi + bar progres */}
          <nav aria-label="Bagian About" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <ul className="flex flex-col gap-4">
                {NAV.map((n) => (
                  <li key={n.id}>
                    <a href={`#about-${n.id}`} className="toc-item flex items-center gap-3 text-base font-medium transition-colors hover:text-[#E58FA8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E58FA8]">
                      <span aria-hidden="true" className="toc-line h-px w-10 bg-[#E58FA8]" />
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div aria-hidden="true" className="mt-8 h-px w-40 bg-[#F3F4F4]/15">
                <div className="toc-bar h-full origin-left bg-[#E58FA8]" />
              </div>
            </div>
          </nav>

          <div className="flex flex-col gap-28 lg:col-span-9 lg:gap-44">
            {/* Pembuka: dikunci di layar saat kata-kata menyala */}
            <div id="about-intro" className="scroll-mt-28">
              <div className="lead-pin flex items-center lg:min-h-screen">
                <p className="about-lead max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.02em] md:text-5xl lg:text-4xl xl:text-[2.6rem]">
                  <LeadText text={LEAD} />
                </p>
              </div>
            </div>

            {/* Create & Wander: judul menempel saat paragraf dan foto lewat */}
            {SECTIONS.map((s) => (
              <div key={s.id} id={`about-${s.id}`} className="scroll-mt-28 grid gap-6 md:grid-cols-12 md:gap-10">
                <h3 className="reveal text-3xl font-semibold tracking-[-0.03em] md:sticky md:top-28 md:col-span-4 md:self-start md:text-5xl">
                  {s.title}
                </h3>
                <div className="md:col-span-8">
                  <p className="para max-w-xl text-lg leading-relaxed text-[#F3F4F4]/85">
                    <Words text={s.text} />
                  </p>
                  <div className="mt-12 grid grid-cols-6 gap-4 md:mt-16 md:gap-6">
                    {PHOTOS[s.id].map((p) => (
                      <Photo key={p.alt} {...p} />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Kontak */}
            <div id="about-contact" className="scroll-mt-28">
              <Outro text={P4} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}