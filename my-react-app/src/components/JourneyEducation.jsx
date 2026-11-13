import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Font (tambahkan di CSS global bila belum):
   @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"); */
const DISPLAY = "font-['Sora',system-ui,sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";

/* ============ DATA: cerita perjalanan ============
   kind: "edu" (pendidikan) atau "journey" (perjalanan)
   year: boleh teks, misalnya "2019" atau "Sekarang" */
const CHAPTERS = [
  {
    year: "2014",
    kind: "edu",
    title: "Langkah Pertama",
    place: "MIN 5 Tangerang",
    story: "Setiap perjalanan dimulai dari suatu tempat, dan perjalanan saya dimulai di MIN 5 Tangerang. Di sinilah saya mengambil langkah pertama di pendidikan formal, membangun fondasi pengetahuan, dan mulai mengenal pentingnya belajar.",
    quote: "Semua berawal dari satu langkah kecil.",
    tags: ["Pendidikan dasar", "Fondasi belajar"],
  },
  {
    year: "2020",
    kind: "edu",
    title: "Mendalami Ilmu",
    place: "Ma'had Adz-Dzahabi",
    story: "Perjalanan saya mengambil arah yang lebih dalam. Di sini saya mulai menjelajahi ilmu agama: Tauhid, Fikih, Bahasa Arab, dan cabang ilmu Islam lainnya. Pengalaman ini membentuk cara saya memahami hidup dan mengajarkan nilai ilmu, disiplin, dan pertumbuhan diri.",
    quote: "Ilmu membentuk cara saya memandang hidup.",
    tags: ["Tauhid", "Fikih", "Bahasa Arab", "Disiplin"],
  },
  {
    year: "2023",
    kind: "edu",
    title: "Menemukan Teknologi",
    place: "Pondok Tahfizh Plus Abudzar",
    story: "Di sini saya menemukan sisi lain dari minat saya: teknologi dan kreativitas. Saya mulai mengenal dunia Teknologi Informasi lewat dasar-dasar pengembangan web seperti HTML, CSS, dan pemrograman. Selangkah demi selangkah, rasa penasaran itu tumbuh menjadi gairah untuk membangun pengalaman digital.",
    quote: "Rasa penasaran tumbuh menjadi keinginan untuk membangun.",
    tags: ["HTML", "CSS", "Pemrograman"],
  },
  {
    year: "2023",
    kind: "journey",
    title: "Kreativitas di Ujung Tangan",
    place: "Pondok Tahfizh Plus Abudzar",
    story: "Selain teknologi, Abudzar juga menjadi tempat saya pertama kali mengasah keterampilan barbering. Dari sini saya belajar bahwa kreativitas tidak terbatas pada layar atau baris kode, tetapi juga bisa diwujudkan lewat keterampilan tangan dan pekerjaan yang bermakna.",
    quote: "Kreativitas tidak hanya hidup di layar.",
    tags: ["Barbering", "Keterampilan tangan"],
  },
  {
    year: "Sekarang",
    kind: "journey",
    title: "Perjalanan Masih Berlanjut",
    place: "Siswa kelas 3 SMA",
    story: "Hari ini, sebagai siswa kelas tiga SMA, saya terus menjelajah, belajar, dan mengembangkan diri di berbagai bidang. Perjalanan saya masih terus berjalan, digerakkan oleh rasa ingin tahu, kecintaan pada ilmu, dan keinginan untuk terus bertumbuh.",
    quote: "Bab berikutnya belum ditulis.",
    tags: ["Web", "Barbering", "Terus belajar"],
  },
];

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "edu", label: "Pendidikan" },
  { id: "journey", label: "Perjalanan" },
];
const KIND_LABEL = { edu: "Pendidikan", journey: "Perjalanan" };
const GLOW = { edu: "rgba(113,90,90,0.5)", journey: "rgba(211,218,217,0.14)" };
const TOP = 96; // jarak kartu menempel dari atas layar (px)
const PEEK = 16; // tinggi tepi kartu yang mengintip saat menumpuk (px)
const pad = (n) => String(n).padStart(2, "0");

export default function JourneyEducation() {
  const root = useRef(null);
  const [filter, setFilter] = useState("all");
  const list = CHAPTERS.filter((c) => filter === "all" || c.kind === filter);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ".jn-head", start: "top 82%", once: true };
        gsap.from(".jn-line", { yPercent: 115, duration: 1.1, stagger: 0.12, ease: "power4.out", scrollTrigger: st });
        gsap.from(".jn-fade", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power3.out", scrollTrigger: st });

        const cards = gsap.utils.toArray(".jn-card");
        cards.forEach((el, i) => {
          // Kartu masuk dari bawah
          gsap.from(el, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: el, start: "top 90%", once: true } });

          // Saat kartu berikutnya naik menimpa, kartu ini mengecil dan meredup
          const next = cards[i + 1];
          if (!next) return;
          const tl = { trigger: next, start: "top 92%", end: `top ${TOP + (i + 1) * PEEK}px`, scrub: true };
          gsap.to(el.querySelector(".jn-inner"), { scale: 0.94, ease: "none", scrollTrigger: tl });
          gsap.to(el.querySelector(".jn-shade"), { opacity: 0.6, ease: "none", scrollTrigger: tl });
        });
      });
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <section id="journey" ref={root} className={`relative overflow-clip bg-[#2f2d35] px-6 py-20 text-[#D3DAD9] md:px-12 md:py-28 lg:px-20 ${BODY}`}>
      <div className="pointer-events-none absolute -right-40 top-1/4 h-112 w-md rounded-full bg-[#715A5A]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -left-40 bottom-1/4 h-112 w-md rounded-full bg-[#D3DAD9]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="jn-head mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`${DISPLAY} text-5xl font-extrabold leading-[1] tracking-[-0.04em] md:text-7xl`}>
              {["Journey", "& Education"].map((line) => (
                <span key={line} className="block overflow-hidden pb-2">
                  <span className="jn-line block">{line}</span>
                </span>
              ))}
            </h2>
            <p className="jn-fade mt-5 max-w-md text-lg leading-relaxed text-[#D3DAD9]/70">Perjalanan dari bangku madrasah dan pondok, sampai editor kode dan kursi barber.</p>
          </div>

          <div className="jn-fade flex flex-wrap gap-2" role="group" aria-label="Filter cerita">
            {FILTERS.map((f) => {
              const n = f.id === "all" ? CHAPTERS.length : CHAPTERS.filter((c) => c.kind === f.id).length;
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9] ${on ? "border-[#D3DAD9] bg-[#D3DAD9] text-[#37353E]" : "border-[#D3DAD9]/25 text-[#D3DAD9]/80 hover:border-[#D3DAD9]/60"}`}
                >
                  {f.label} <span className="tabular-nums opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Kartu menumpuk saat di-scroll */}
        <ol className="relative flex flex-col gap-10 md:gap-[20vh]">
          {list.map((c, i) => (
            <li key={c.title} className="jn-card sticky" style={{ top: TOP + i * PEEK }}>
              <article className="jn-inner relative origin-top overflow-hidden rounded-[32px] border border-[#D3DAD9]/15 bg-[linear-gradient(135deg,#4a4a55,#37353E)] p-7 shadow-2xl shadow-black/40 md:p-12">
                <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full blur-3xl" style={{ background: GLOW[c.kind] }} />
                <span className="absolute right-7 top-7 text-sm tabular-nums text-[#D3DAD9]/50 md:right-12 md:top-10">
                  {pad(i + 1)} / {pad(list.length)}
                </span>

                <div className="relative grid gap-8 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-5">
                    <p className={`${DISPLAY} font-extrabold leading-none tracking-[-0.04em] bg-[linear-gradient(180deg,#D3DAD9,rgba(211,218,217,0.15))] bg-clip-text text-transparent ${c.year.length > 4 ? "text-5xl md:text-6xl" : "text-7xl md:text-[104px]"}`}>{c.year}</p>
                    <p className="mt-5 flex items-center gap-3 text-[#D3DAD9]/80">
                      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[#715A5A] ring-4 ring-[#715A5A]/30" />
                      {c.place}
                    </p>
                    <span className={`mt-4 inline-block rounded-full px-3.5 py-1 text-xs font-semibold ${c.kind === "edu" ? "bg-[#D3DAD9] text-[#37353E]" : "border border-[#D3DAD9]/40"}`}>{KIND_LABEL[c.kind]}</span>
                  </div>

                  <div className="md:col-span-7">
                    <h3 className={`${DISPLAY} text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-4xl`}>{c.title}</h3>
                    <p className="mt-4 max-w-prose text-base leading-relaxed text-[#D3DAD9]/75 md:text-lg">{c.story}</p>
                    <p className={`${DISPLAY} mt-6 rounded-2xl bg-[#D3DAD9]/[0.06] p-5 text-lg font-light leading-snug md:text-xl`}>{c.quote}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {c.tags.map((t) => (
                        <li key={t} className="rounded-full border border-[#D3DAD9]/20 px-3.5 py-1 text-sm text-[#D3DAD9]/85">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <span aria-hidden="true" className="jn-shade pointer-events-none absolute inset-0 rounded-[32px] bg-[#2a2830] opacity-0" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}