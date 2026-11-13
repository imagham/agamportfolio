import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
  Font: sama dengan Hero & Contact (Unbounded + Plus Jakarta Sans).

  FOTO: taruh gambar di public/works/ dengan nama sesuai field `image` di data
  (cutline.jpg, orbit.jpg, parsel.jpg, jakarta-pagi.jpg, wajah-kota.jpg, pesisir.jpg,
  skin-fade.jpg, textured-crop.jpg, classic-taper.jpg). Kalau file belum ada,
  cover otomatis memakai ilustrasi gradien sebagai cadangan.

  KONSEP: tiga kategori sebagai tab. Memilih kategori mengubah warna latar section,
  lalu daftar proyek di kiri dan cover besar di kanan. Klik proyek untuk membuka detail
  dan mengganti cover. Cover dibuat dari warna a/b tiap proyek (tanpa file gambar),
  jadi nanti tinggal diganti foto/screenshot asli kalau sudah ada.
*/
const CATEGORIES = [
  {
    id: "code",
    index: "01",
    title: "Software Engineering",
    short: "Code",
    tagline: "Aplikasi yang dirakit baris demi baris.",
    bg: "#2a282f",
    projects: [
      { title: "Cutline", image: "/works/cutline.jpg", kind: "Web app", year: "2026", desc: "Sistem antrean dan booking untuk barbershop. Pelanggan memilih kapster dan jam, kapster melihat antrean secara langsung.", tags: ["React", "Node.js", "PostgreSQL"], a: "#715A5A", b: "#D3DAD9", links: [{ label: "Lihat situs", href: "#" }, { label: "Lihat kode", href: "#" }] },
      { title: "Orbit", image: "/works/orbit.jpg", kind: "Dashboard", year: "2025", desc: "Dashboard analitik yang merangkum data penjualan harian dalam satu layar dengan grafik interaktif.", tags: ["React", "D3", "Express"], a: "#D3DAD9", b: "#715A5A", links: [{ label: "Lihat situs", href: "#" }, { label: "Lihat kode", href: "#" }] },
      { title: "Parsel", image: "/works/parsel.jpg", kind: "Mobile app", year: "2024", desc: "Aplikasi pelacak pengiriman dengan status real-time dan notifikasi saat paket berpindah tahap.", tags: ["React Native", "Firebase"], a: "#44444E", b: "#9a8080", links: [{ label: "Lihat situs", href: "#" }, { label: "Lihat kode", href: "#" }] },
    ],
  },
  {
    id: "photo",
    index: "02",
    title: "Photography",
    short: "Foto",
    tagline: "Cahaya, momen, dan sudut yang tepat.",
    bg: "#44444E",
    projects: [
      { title: "Jakarta Pagi", image: "/works/jakarta-pagi.jpg", kind: "Street series", year: "2026", desc: "Seri foto jalanan tentang kota sebelum ramai: tukang sayur, kabut tipis, dan lampu yang belum padam.", tags: ["Street", "35mm", "Natural light"], exif: "ƒ/2.8, 1/250, ISO 200", a: "#9a8080", b: "#37353E", links: [{ label: "Lihat album", href: "#" }] },
      { title: "Wajah Kota", image: "/works/wajah-kota.jpg", kind: "Portrait series", year: "2025", desc: "Potret orang-orang yang ditemui di sudut kota, difoto dengan cahaya sekitar apa adanya.", tags: ["Portrait", "85mm"], exif: "ƒ/1.8, 1/320, ISO 100", a: "#37353E", b: "#D3DAD9", links: [{ label: "Lihat album", href: "#" }] },
      { title: "Pesisir", image: "/works/pesisir.jpg", kind: "Landscape", year: "2024", desc: "Perjalanan menyusuri pantai saat golden hour dengan eksposur panjang.", tags: ["Landscape", "Long exposure"], exif: "ƒ/11, 4s, ISO 100", a: "#715A5A", b: "#44444E", links: [{ label: "Lihat album", href: "#" }] },
    ],
  },
  {
    id: "barber",
    index: "03",
    title: "Barbering",
    short: "Barber",
    tagline: "Potongan rapi dengan detail yang presisi.",
    bg: "#5b4747",
    projects: [
      { title: "Skin Fade", image: "/works/skin-fade.jpg", kind: "Fade", year: "2026", desc: "Gradasi halus dari kulit ke rambut, dirapikan dengan clipper dan foil shaver.", tags: ["Fade", "Clipper", "Foil shaver"], meta: "Durasi 45 menit", a: "#37353E", b: "#D3DAD9", links: [{ label: "Lihat di Instagram", href: "#" }] },
      { title: "Textured Crop", image: "/works/textured-crop.jpg", kind: "Crop", year: "2025", desc: "Potongan pendek bertekstur di bagian atas dengan sisi yang bersih.", tags: ["Crop", "Texture"], meta: "Durasi 40 menit", a: "#715A5A", b: "#D3DAD9", links: [{ label: "Lihat di Instagram", href: "#" }] },
      { title: "Classic Taper", image: "/works/classic-taper.jpg", kind: "Taper", year: "2024", desc: "Taper klasik dengan belahan samping yang rapi untuk tampilan formal.", tags: ["Taper", "Side part"], meta: "Durasi 35 menit", a: "#44444E", b: "#9a8080", links: [{ label: "Lihat di Instagram", href: "#" }] },
    ],
  },
];

const DISPLAY = "font-['Unbounded',system-ui,sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9]";

const BARS = 22;
const fadeHeight = (i) => 16 + (i / (BARS - 1)) * 72;
const hash = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0);

/* ---------- Cover per kategori ---------- */
function CodeCover({ p }) {
  const h = hash(p.title);
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-[82%] rounded-xl border border-white/10 bg-[#2a2830]/90 p-4 shadow-2xl">
        <div className="mb-3 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#E5484D]" />
          <span className="size-2 rounded-full bg-[#FFC857]" />
          <span className="size-2 rounded-full bg-[#7EE0A1]" />
          <span className="ml-3 h-2 flex-1 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-12 rounded-lg bg-white/10" />
          ))}
        </div>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${30 + ((h * (i + 3)) % 65)}%`, background: `linear-gradient(to top, ${p.a}, ${p.b})` }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-2">
          <span className="block h-2 rounded-full bg-white/10" style={{ width: `${55 + (h % 35)}%` }} />
          <span className="block h-2 rounded-full bg-white/10" style={{ width: `${30 + (h % 25)}%` }} />
        </div>
      </div>
    </div>
  );
}

function PhotoCover({ p }) {
  return (
    <>
      <span className="absolute left-[12%] top-[20%] size-16 rounded-full opacity-50 blur-lg" style={{ background: p.b }} />
      <span className="absolute left-[70%] top-[14%] size-12 rounded-full opacity-40 blur-lg" style={{ background: p.b }} />
      <span className="absolute left-[64%] top-[58%] size-24 rounded-full opacity-30 blur-xl" style={{ background: p.a }} />
      <span className="absolute left-[22%] top-[64%] size-14 rounded-full opacity-40 blur-lg" style={{ background: p.b }} />
      <span className="absolute inset-0 grid place-items-center">
        <span className="focus size-20 rounded-md border-2 border-[#D3DAD9]/80" />
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-[#2a2830]/75 px-3 py-1.5 font-mono text-xs backdrop-blur">{p.exif}</span>
    </>
  );
}

function BarberCover({ p }) {
  return (
    <>
      <div className="absolute inset-6 flex items-end gap-1 rounded-2xl bg-[#2a2830]/85 px-5 pb-5 pt-10 sm:gap-1.5">
        {Array.from({ length: BARS }, (_, i) => (
          <span
            key={i}
            className="c-bar flex-1 rounded-full bg-gradient-to-t from-[#715A5A] to-[#D3DAD9]"
            style={{ height: `${fadeHeight(i)}%` }}
          />
        ))}
      </div>
      <span className="absolute right-9 top-9 rounded-full bg-[#37353E]/80 px-3 py-1.5 font-mono text-xs backdrop-blur">{p.meta}</span>
    </>
  );
}

function Chip({ children }) {
  return (
    <span className="absolute right-4 top-4 rounded-full bg-[#2a2830]/75 px-3 py-1.5 font-mono text-xs backdrop-blur">
      {children}
    </span>
  );
}

function Cover({ cat, p, failed, onFail }) {
  const Art = cat.id === "code" ? CodeCover : cat.id === "photo" ? PhotoCover : BarberCover;
  const showImg = Boolean(p.image) && !failed[p.image];
  return (
    <div
      {...(showImg ? {} : { role: "img", "aria-label": `Ilustrasi proyek ${p.title}` })}
      className="relative aspect-[4/3] self-start overflow-hidden rounded-[28px] border border-[#D3DAD9]/15 lg:sticky lg:top-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
      style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}
    >
      <div className="cover-inner absolute inset-0">
        {showImg ? (
          <>
            <img
              key={p.image}
              src={p.image}
              alt={`${p.title}, ${p.kind}`}
              decoding="async"
              onError={() => onFail(p.image)}
              className="absolute inset-0 size-full object-cover"
            />
            {cat.id === "photo" && p.exif && <Chip>{p.exif}</Chip>}
            {cat.id === "barber" && p.meta && <Chip>{p.meta}</Chip>}
          </>
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            <Art p={p} />
          </div>
        )}
        <span aria-hidden="true" className="absolute bottom-4 left-4 rounded-full bg-[#2a2830]/80 px-4 py-2 text-sm backdrop-blur">
          <span className={`${DISPLAY} font-medium tracking-[-0.02em]`}>{p.title}</span>
          <span className="ml-2 text-[#D3DAD9]/65">{p.kind}</span>
        </span>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */
export default function Works() {
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const first = useRef(true);
  const [catIdx, setCatIdx] = useState(0);
  const [projIdx, setProjIdx] = useState(0);
  const [failed, setFailed] = useState({});

  const cat = CATEGORIES[catIdx];
  const proj = cat.projects[projIdx];

  /* Animasi masuk sekali saat section terlihat */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: ".works-head", start: "top 80%", once: true },
          })
          .from(".line > span", { yPercent: 115, duration: 1.1, stagger: 0.12 })
          .from(".fade-in", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .from(".panel", { opacity: 0, y: 36, duration: 0.9 }, "-=0.7");
      });
    },
    { scope: rootRef },
  );

  /* Latar section mengikuti warna kategori */
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(rootRef.current, { backgroundColor: cat.bg, duration: reduce || first.current ? 0 : 0.7, ease: "power2.out" });
    },
    { scope: rootRef, dependencies: [catIdx] },
  );

  /* Respons saat ganti kategori / proyek */
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const root = rootRef.current;
      gsap.fromTo(".cover-inner", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" });
      if (root.querySelector(".focus")) gsap.fromTo(
        ".focus",
        { scale: 1.6, borderColor: "rgba(211,218,217,0.8)" },
        { scale: 1, borderColor: "#FFC857", duration: 0.7, ease: "back.out(2)" },
      );
      if (root.querySelector(".c-bar")) gsap.fromTo(
        ".c-bar",
        { height: () => gsap.utils.random(30, 96) + "%" },
        { height: (i) => fadeHeight(i) + "%", duration: 0.9, ease: "power3.inOut", stagger: { each: 0.03, from: "start" } },
      );
    },
    { scope: rootRef, dependencies: [catIdx, projIdx] },
  );

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.fromTo(".cat-head", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    },
    { scope: rootRef, dependencies: [catIdx] },
  );

  const selectCat = (i) => {
    setCatIdx(i);
    setProjIdx(0);
  };

  const onTabKey = (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (catIdx + dir + CATEGORIES.length) % CATEGORIES.length;
    selectCat(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <section
      ref={rootRef}
      id="works"
      className={`relative overflow-hidden bg-[#2a282f] px-5 py-24 text-[#D3DAD9] md:px-10 lg:px-16 ${BODY}`}
    >
      {/* Latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(211,218,217,0.1)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_50%_20%,black,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="works-head">
          <h2 className={`${DISPLAY} text-[clamp(1.9rem,5.2vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.045em]`}>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">Karya yang lahir dari</span>
            </span>
            <span className="line -mb-[0.12em] block overflow-hidden pb-[0.12em]">
              <span className="inline-block">kode, kamera, dan clipper.</span>
            </span>
          </h2>
          <p className="fade-in mt-5 max-w-lg text-base leading-relaxed text-[#D3DAD9]/75 md:text-lg">
            Pilih satu kategori untuk melihat proyek, seri foto, dan potongan terbaru.
          </p>

          {/* Tab kategori */}
          <div
            role="tablist"
            aria-label="Kategori karya"
            onKeyDown={onTabKey}
            className="fade-in mt-8 inline-flex flex-wrap gap-1.5 rounded-full border border-[#D3DAD9]/15 bg-[#2a2830]/60 p-1.5 backdrop-blur-xl"
          >
            {CATEGORIES.map((c, i) => {
              const on = i === catIdx;
              return (
                <button
                  key={c.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${c.id}`}
                  tabIndex={on ? 0 : -1}
                  type="button"
                  onClick={() => selectCat(i)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${focusRing} ${
                    on ? "bg-[#D3DAD9] text-[#37353E]" : "text-[#D3DAD9]/75 hover:text-[#D3DAD9]"
                  }`}
                >
                  <span className={`mr-2 ${on ? "text-[#37353E]/55" : "text-[#D3DAD9]/45"}`}>{c.index}</span>
                  {c.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id={`panel-${cat.id}`}
          aria-labelledby={`tab-${cat.id}`}
          className="panel mt-12 grid gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0"
        >
          <div className="cat-head lg:col-span-5 lg:row-start-1">
            <h3 className={`${DISPLAY} text-xl font-medium tracking-[-0.03em] md:text-2xl`}>{cat.title}</h3>
            <p className="mt-2 text-[#D3DAD9]/70">{cat.tagline}</p>
          </div>

          <Cover cat={cat} p={proj} failed={failed} onFail={(src) => setFailed((f) => ({ ...f, [src]: true }))} />

          <ul className="lg:col-span-5 lg:row-start-2 lg:mt-8">
            {cat.projects.map((p, i) => {
              const on = i === projIdx;
              return (
                <li key={p.title} className="border-t border-[#D3DAD9]/15 last:border-b">
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => setProjIdx(i)}
                    className={`flex w-full items-baseline justify-between gap-4 py-5 text-left ${focusRing}`}
                  >
                    <span>
                      <span className={`${DISPLAY} block text-lg font-medium tracking-[-0.03em] transition-colors md:text-xl ${on ? "text-[#D3DAD9]" : "text-[#D3DAD9]/55 hover:text-[#D3DAD9]/85"}`}>
                        {p.title}
                      </span>
                      <span className="mt-1 block text-sm text-[#D3DAD9]/55">{p.kind}</span>
                    </span>
                    <span className="text-sm text-[#D3DAD9]/55">{p.year}</span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,visibility] duration-300 motion-reduce:transition-none ${
                      on ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-md pb-4 text-sm leading-relaxed text-[#D3DAD9]/80">{p.desc}</p>
                      <ul className="flex flex-wrap gap-2 pb-4" aria-label="Tag">
                        {p.tags.map((t) => (
                          <li key={t} className="rounded-full border border-[#D3DAD9]/20 px-3 py-1 text-xs">{t}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2.5 pb-6">
                        {p.links.map((l, k) => (
                          <a
                            key={l.label}
                            href={l.href}
                            {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${focusRing} ${
                              k === 0
                                ? "bg-[#D3DAD9] text-[#37353E] hover:bg-white"
                                : "border border-[#D3DAD9]/35 hover:border-[#D3DAD9]"
                            }`}
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}