import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* Foto dari src/assets (nama file harus persis sama, termasuk huruf besar-kecil) */
import street from "../assets/street.jpg";
import night from "../assets/night.jpg";
import tower from "../assets/tower.jpg";
import blur from "../assets/blur.jpg";
import stadion from "../assets/stadion.jpg";
import stadion2 from "../assets/stadion2.jpg";
import unj1 from "../assets/UNJ1.jpg";
import unj2 from "../assets/UNJ2.jpg";
import unj3 from "../assets/UNJ3.jpg";
import rumah from "../assets/RUMAH.jpg";
import rumahair from "../assets/rumahair.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const DISPLAY = "font-['Bricolage_Grotesque',system-ui,sans-serif]";

/*
  PALET
  Section: #1F1F1F (turunan charcoal paling dalam, samakan BG.creative di landing page)
  Kertas foto: #F3F4F4 dan #E9E3E7 · teks di kertas #2C2C2C · selotip: rose muda #E58FA8
  Hover filter: rose #853953 (teks putih, kontras 7.0)
*/

/* ============ DATA: ganti judul, tahun, dan deskripsi sesuai fotomu ============
   image = foto dari src/assets. Rasio foto dibaca otomatis saat dimuat, jadi `ratio` hanya
   cadangan sebelum foto selesai dimuat. cat: "foto" atau "barber". Kosongkan `meta` bila tidak perlu. */
const ITEMS = [
  { id: "w1", title: "Riuh Jalanan", cat: "foto", year: "2026", ratio: "4/5", image: street, desc: "Potret kehidupan jalan, direkam apa adanya.", meta: "", a: "#E58FA8", b: "#2C2C2C" },
  { id: "w2", title: "Garis yang Bersih", cat: "barber", year: "2026", ratio: "1/1", image: rumahair, desc: "Potongan rapi dengan detail yang dikerjakan presisi.", meta: "Rumah Hair", a: "#2C2C2C", b: "#F3F4F4" },
  { id: "w3", title: "Menjulang", cat: "foto", year: "2026", ratio: "2/3", image: tower, desc: "Menara yang berdiri tegak di antara langit dan kota.", meta: "", a: "#853953", b: "#2C2C2C" },
  { id: "w4", title: "Arena", cat: "foto", year: "2026", ratio: "3/2", image: stadion, desc: "Skala dan ruang sebuah stadion dalam satu bingkai.", meta: "Seri Arena, 1 dari 2", a: "#612D53", b: "#F3F4F4" },
  { id: "w5", title: "Kampus, I", cat: "foto", year: "2026", ratio: "3/2", image: unj1, desc: "Seri kampus Universitas Negeri Jakarta, bab pertama.", meta: "Seri Kampus, 1 dari 3", a: "#612D53", b: "#E58FA8" },
  { id: "w6", title: "Rapi di Setiap Sisi", cat: "barber", year: "2026", ratio: "4/5", image: rumah, desc: "Kerapian yang terlihat dari setiap sudut kepala.", meta: "Rumah Hair", a: "#1F1F1F", b: "#E58FA8" },
  { id: "w7", title: "Setelah Gelap", cat: "foto", year: "2026", ratio: "3/2", image: night, desc: "Cahaya kota ketika malam mengambil alih.", meta: "", a: "#2C2C2C", b: "#853953" },
  { id: "w8", title: "Fokus yang Hilang", cat: "foto", year: "2026", ratio: "1/1", image: blur, desc: "Eksperimen cahaya dan fokus yang sengaja dibuat kabur.", meta: "", a: "#F3F4F4", b: "#853953" },
  { id: "w9", title: "Arena, II", cat: "foto", year: "2026", ratio: "4/5", image: stadion2, desc: "Bingkai kedua dari stadion yang sama.", meta: "Seri Arena, 2 dari 2", a: "#853953", b: "#612D53" },
  { id: "w10", title: "Kampus, II", cat: "foto", year: "2026", ratio: "3/2", image: unj2, desc: "Seri kampus Universitas Negeri Jakarta, bab kedua.", meta: "Seri Kampus, 2 dari 3", a: "#612D53", b: "#2C2C2C" },
  { id: "w11", title: "Kampus, III", cat: "foto", year: "2026", ratio: "4/5", image: unj3, desc: "Seri kampus Universitas Negeri Jakarta, bab penutup.", meta: "Seri Kampus, 3 dari 3", a: "#E58FA8", b: "#612D53" },
];

/* Tata letak kolase. Dipakai berulang (siklus 6), jadi filter apa pun tetap terlihat seperti kolase.
   c = posisi kolom (HP 6 kolom, desktop 12 kolom), m = margin untuk saling menimpa,
   r = kemiringan (derajat), t = jenis selotip, sp = jarak parallax (px), paper = warna kertas. */
const LAYOUT = [
  { c: "col-start-1 col-span-4 md:col-start-1 md:col-span-5", m: "", r: -3, t: "top", sp: 30, paper: "#F3F4F4" },
  { c: "col-start-3 col-span-4 md:col-start-6 md:col-span-4 md:-ml-10", m: "-mt-10 md:mt-16", r: 3, t: "corner", sp: -40, paper: "#E9E3E7" },
  { c: "col-start-2 col-span-4 md:col-start-10 md:col-span-3 md:-ml-8", m: "-mt-8 md:mt-6", r: -2, t: "top", sp: 20, paper: "#F3F4F4" },
  { c: "col-start-1 col-span-4 md:col-start-1 md:col-span-3", m: "-mt-8 md:-mt-10", r: 2.5, t: "corner", sp: -20, paper: "#E9E3E7" },
  { c: "col-start-3 col-span-4 md:col-start-4 md:col-span-5 md:-ml-6", m: "-mt-10 md:mt-14", r: -3.5, t: "top", sp: 35, paper: "#F3F4F4" },
  { c: "col-start-2 col-span-4 md:col-start-9 md:col-span-4 md:-ml-8", m: "-mt-8 md:mt-4", r: 2, t: "corner", sp: -25, paper: "#E9E3E7" },
];

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "foto", label: "Fotografi" },
  { id: "barber", label: "Barbering" },
];
const CAT_LABEL = { foto: "Fotografi", barber: "Barbering" };
const pad = (n) => String(n).padStart(2, "0");
const toRatio = (r) => (typeof r === "number" ? r : r.split("/").reduce((a, b) => a / b));
const clampRatio = (r) => Math.min(2, Math.max(0.66, r));

function Art({ p }) {
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.a}, ${p.b})` }}>
      {p.image ? (
        <img src={p.image} alt={p.title} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className={`${DISPLAY} select-none text-6xl font-extrabold leading-none text-[#F3F4F4]/30 md:text-8xl`}>{p.title[0]}</span>
      )}
    </div>
  );
}

function Tape({ kind }) {
  const pos = kind === "top" ? "-top-3 left-1/2 -translate-x-1/2 -rotate-3" : "-left-5 -top-1 -rotate-[38deg]";
  return <span aria-hidden="true" className={`pointer-events-none absolute z-10 h-6 w-20 bg-[#E58FA8]/70 shadow-sm backdrop-blur-[1px] ${pos}`} />;
}

export default function CreativeWorks() {
  const root = useRef(null);
  const artRef = useRef(null);
  const hiddenId = useRef(null);
  const wasOpen = useRef(false);
  const closing = useRef(false);
  const [filter, setFilter] = useState("all");
  const [lb, setLb] = useState(null); // index di dalam daftar `visible`
  const [ratios, setRatios] = useState({}); // rasio asli foto, dibaca saat dimuat
  const ratioOf = (it) => ratios[it.id] ?? toRatio(it.ratio);

  useEffect(() => {
    let alive = true;
    Promise.all(
      ITEMS.filter((i) => i.image).map(
        (i) =>
          new Promise((res) => {
            const im = new Image();
            im.onload = () => res([i.id, clampRatio(im.naturalWidth / im.naturalHeight)]);
            im.onerror = () => res(null);
            im.src = i.image;
          }),
      ),
    ).then((list) => alive && setRatios(Object.fromEntries(list.filter(Boolean))));
    return () => {
      alive = false;
    };
  }, []);

  // Setelah rasio foto berubah, posisi trigger scroll perlu dihitung ulang
  useEffect(() => {
    if (Object.keys(ratios).length) ScrollTrigger.refresh();
  }, [ratios]);

  const visible = ITEMS.filter((i) => filter === "all" || i.cat === filter);
  const item = lb !== null ? visible[lb] : null;
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Judul masuk, foto "dilempar" ke papan, lalu bergeser pelan saat scroll ---------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cw-line", { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out", scrollTrigger: { trigger: ".cw-head", start: "top 85%", once: true } });

        gsap.set(".cw-item", { opacity: 0 });
        ScrollTrigger.batch(".cw-item", {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, scale: 1.25, rotation: () => gsap.utils.random(-9, 9) },
              { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.6)", stagger: 0.1, clearProps: "transform,opacity" },
            ),
        });

        // Cahaya latar bergerak berlawanan arah saat scroll
        gsap.to(".cw-glow-a", { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.to(".cw-glow-b", { yPercent: 30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Tiap foto bergeser dengan kecepatan berbeda supaya tumpukannya terasa berlapis
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".cw-par").forEach((el) => {
          const sp = Number(el.dataset.sp) || 0;
          gsap.fromTo(el, { y: sp }, { y: -sp, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  /* ---------- Lightbox: foto membesar dari posisinya di kolase ---------- */
  const setThumb = (id, hide) => {
    const el = root.current?.querySelector(`[data-art="${id}"]`);
    if (el) el.style.visibility = hide ? "hidden" : "";
  };

  useEffect(() => {
    if (lb === null || !item || !artRef.current) {
      if (lb === null) wasOpen.current = false;
      return;
    }
    const art = artRef.current;
    if (hiddenId.current) setThumb(hiddenId.current, false);
    hiddenId.current = item.id;

    if (!wasOpen.current) {
      wasOpen.current = true;
      document.body.style.setProperty("overflow", "hidden");
      const thumb = root.current.querySelector(`[data-art="${item.id}"]`);
      const t = thumb.getBoundingClientRect();
      const r = art.getBoundingClientRect();
      setThumb(item.id, true);
      if (reduce()) return;
      gsap.fromTo(art, { x: t.left - r.left, y: t.top - r.top, scale: t.width / r.width, transformOrigin: "0 0" }, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "power4.inOut" });
      gsap.from(".lb-bg", { opacity: 0, duration: 0.6 });
      gsap.from(".lb-ui", { opacity: 0, duration: 0.4, delay: 0.6 });
      gsap.from(".lb-cap > *", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, delay: 0.55, ease: "power3.out" });
    } else {
      setThumb(item.id, true);
      if (reduce()) return;
      gsap.fromTo(art, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" });
      gsap.from(".lb-cap > *", { y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" });
    }
  }, [lb, filter]);

  useEffect(() => () => (document.body.style.overflow = ""), []);

  const closeLb = () => {
    if (closing.current || !item) return;
    closing.current = true;
    const art = artRef.current;
    const thumb = root.current.querySelector(`[data-art="${item.id}"]`);
    const done = () => {
      setThumb(item.id, false);
      hiddenId.current = null;
      document.body.style.overflow = "";
      closing.current = false;
      setLb(null);
    };
    if (reduce() || !art || !thumb) return done();
    const t = thumb.getBoundingClientRect();
    const r = art.getBoundingClientRect();
    gsap.to(".lb-cap, .lb-ui", { opacity: 0, duration: 0.25 });
    gsap.to(".lb-bg", { opacity: 0, duration: 0.6, delay: 0.1 });
    // Jika foto asal sedang di luar layar (setelah Berikutnya/Sebelumnya), cukup pudar
    const offscreen = t.bottom < 0 || t.top > window.innerHeight || t.right < 0 || t.left > window.innerWidth;
    if (offscreen) return void gsap.to(art, { opacity: 0, duration: 0.4, onComplete: done });
    gsap.to(art, { x: t.left - r.left, y: t.top - r.top, scale: t.width / r.width, transformOrigin: "0 0", duration: 0.8, ease: "power4.inOut", onComplete: done });
  };

  const go = (d) => setLb((i) => (i === null ? i : (i + d + visible.length) % visible.length));

  useEffect(() => {
    if (lb === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ratio = item ? ratioOf(item) : 1;

  return (
    <section ref={root} id="gallery" className="relative overflow-clip bg-linear-to-b from-[#612D53] to-[#1F1F1F] px-6 py-20 text-[#F3F4F4] md:px-12 md:py-28 lg:px-20">
      {/* Cahaya latar */}
      <div aria-hidden="true" className="cw-glow-a pointer-events-none absolute -left-40 top-1/4 h-112 w-md rounded-full bg-[#612D53]/40 blur-[120px]" />
      <div aria-hidden="true" className="cw-glow-b pointer-events-none absolute -right-40 bottom-1/4 h-112 w-md rounded-full bg-[#853953]/25 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="cw-head mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <h2 className={`${DISPLAY} text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-7xl`}>
            {["Creative", "Works"].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span className="cw-line block">{line}</span>
              </span>
            ))}
          </h2>

          <div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter karya">
              {FILTERS.map((f) => {
                const n = f.id === "all" ? ITEMS.length : ITEMS.filter((i) => i.cat === f.id).length;
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E58FA8] ${on ? "border-[#F3F4F4] bg-[#F3F4F4] text-[#2C2C2C]" : "border-[#F3F4F4]/30 hover:border-[#853953] hover:bg-[#853953]"}`}
                  >
                    {f.label} <span className="tabular-nums opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-[#F3F4F4]/70">Klik foto untuk memperbesar.</p>
          </div>
        </header>

        {/* Kolase: foto saling menimpa, miring, dan ditempel selotip */}
        <div className="grid grid-cols-6 items-start gap-y-8 md:grid-cols-12 md:gap-y-12">
          {visible.map((it, i) => {
            const L = LAYOUT[i % LAYOUT.length];
            const rowOverlap = i >= 6 && i % 6 === 0 ? " md:-mt-10" : "";
            return (
              <div key={it.id} data-sp={L.sp} className={`cw-par relative focus-within:z-30 hover:z-30 ${L.c} ${L.m}${rowOverlap}`} style={{ zIndex: i + 1 }}>
                <div className="cw-item">
                  <button
                    type="button"
                    onClick={() => setLb(i)}
                    aria-label={`Perbesar ${it.title}`}
                    className="group relative block w-full text-left transition-transform duration-500 [transform:rotate(var(--r))] hover:[transform:rotate(0deg)_scale(1.04)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E58FA8] focus-visible:[transform:rotate(0deg)_scale(1.04)]"
                    style={{ "--r": `${L.r}deg` }}
                  >
                    <Tape kind={L.t} />
                    <div className="p-2 shadow-[0_22px_38px_-14px_rgba(0,0,0,0.75)] md:p-3" style={{ background: L.paper }}>
                      <div data-art={it.id} className="overflow-hidden" style={{ aspectRatio: ratioOf(it) }}>
                        <Art p={it} />
                      </div>
                      <div className="mt-2 flex items-baseline justify-between gap-2 text-[#2C2C2C] md:mt-3">
                        <span className={`${DISPLAY} text-sm font-semibold md:text-base`}>{it.title}</span>
                        <span className="shrink-0 text-xs text-[#2C2C2C]/70">
                          {CAT_LABEL[it.cat]}, {it.year}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {item &&
        createPortal(
          <div role="dialog" aria-modal="true" aria-label={item.title} className="fixed inset-0 z-[70]">
            <div className="lb-bg absolute inset-0 bg-[#1F1F1F]/95 backdrop-blur-sm" onClick={closeLb} />
            <button type="button" onClick={closeLb} className={`lb-ui absolute right-5 top-5 z-10 rounded-full border border-[#F3F4F4]/35 px-4 py-2 text-sm text-[#F3F4F4] transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C] ${DISPLAY}`}>
              Tutup (Esc)
            </button>

            <div className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-20 md:flex-row md:gap-14">
              <div
                ref={artRef}
                className="lb-art pointer-events-auto shrink-0 overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
                style={{ aspectRatio: ratioOf(item), height: `min(66vh, calc(min(84vw, 680px) / ${ratio}))` }}
              >
                <Art p={item} />
              </div>

              <div className="lb-cap pointer-events-auto max-w-sm text-[#F3F4F4]">
                <span className="inline-block rounded-full bg-[#853953] px-3.5 py-1 text-xs font-semibold">
                  {CAT_LABEL[item.cat]}, {item.year}
                </span>
                <h3 className={`mt-4 ${DISPLAY} text-5xl font-extrabold leading-none tracking-[-0.03em] md:text-6xl`}>{item.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-[#F3F4F4]/85">{item.desc}</p>
                {item.meta && <p className="mt-5 tabular-nums text-[#E58FA8]">{item.meta}</p>}
              </div>
            </div>

            <div className={`lb-ui absolute inset-x-0 bottom-5 z-10 flex items-center justify-center ${DISPLAY}`}>
              <div className="flex items-center gap-2 rounded-full border border-[#F3F4F4]/15 bg-[#F3F4F4]/10 p-1.5 text-sm text-[#F3F4F4] backdrop-blur-md">
                <button type="button" onClick={() => go(-1)} className="rounded-full px-4 py-2 transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C]">
                  Sebelumnya
                </button>
                <span className="w-16 text-center tabular-nums text-[#F3F4F4]/80">
                  {pad(lb + 1)} / {pad(visible.length)}
                </span>
                <button type="button" onClick={() => go(1)} className="rounded-full px-4 py-2 transition hover:bg-[#F3F4F4] hover:text-[#2C2C2C]">
                  Berikutnya
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}