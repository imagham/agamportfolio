import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/*
  Font (tambahkan sekali di index.html / CSS global):
  <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  KONSEP: layar tertutup "rambut" (ribuan helai di canvas). Mesin clipper menyapu dua kali dan
  mencukur area judul, lalu kursormu berubah jadi bingkai fokus kamera: gerakkan untuk mencukur,
  klik untuk memotret (flash). Barber + Photographer + Engineer dalam satu interaksi.
*/
const DISPLAY = "font-['Unbounded',system-ui,sans-serif]";
const BODY = "font-['Plus_Jakarta_Sans',system-ui,sans-serif]";
const TEXT = "A Software Engineer, Barber, and Photographer driven by curiosity and the passion to create meaningful things.";
const ROLES = ["Engineer", "Barber", "Photographer"];

const COL = 5; // lebar satu helai (px)
const ROW = 18; // tinggi satu baris helai (px)
const SHADES = ["#25232a", "#2b2830", "#312e37"];
const USER_R = 64; // radius cukur kursor (px)
const REGROW = 14; // detik sampai rambut tumbuh penuh lagi
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const root = heroRef.current;

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hair, .cursor, .hint, .flash", { display: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const canvas = root.querySelector(".hair");
        const ctx = canvas.getContext("2d");
        const cursor = root.querySelector(".cursor");
        let W, H, cols, rows, h, shade, lock;
        let dirty = true;
        let live = false;
        let last = null;

        /* ---------- 1. Ladang rambut: satu helai = satu sel di grid ---------- */
        const build = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          W = root.clientWidth;
          H = root.clientHeight;
          canvas.width = W * dpr;
          canvas.height = H * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          cols = Math.ceil(W / COL);
          rows = Math.ceil(H / ROW);
          h = new Float32Array(cols * rows).fill(1);
          lock = new Uint8Array(cols * rows);
          shade = new Uint8Array(cols * rows).map(() => (Math.random() * 3) | 0);
          dirty = true;
        };

        const shave = (x, y, R) => {
          const c0 = Math.max(0, ((x - R) / COL) | 0);
          const c1 = Math.min(cols - 1, ((x + R) / COL) | 0);
          const r0 = Math.max(0, ((y - R) / ROW) | 0);
          const r1 = Math.min(rows - 1, ((y + R) / ROW) | 0);
          for (let r = r0; r <= r1; r++) {
            for (let c = c0; c <= c1; c++) {
              const d = Math.hypot(c * COL + COL / 2 - x, r * ROW + ROW / 2 - y);
              const f = smooth(R * 0.5, R, d); // tepi lembut = efek fade
              const k = r * cols + c;
              if (f < h[k]) {
                h[k] = f;
                dirty = true;
              }
            }
          }
        };

        // Isi celah saat kursor bergerak cepat
        const move = (x, y, R) => {
          if (last) {
            const dx = x - last.x;
            const dy = y - last.y;
            const n = Math.ceil(Math.hypot(dx, dy) / (R * 0.35));
            for (let i = 1; i <= n; i++) shave(last.x + (dx * i) / n, last.y + (dy * i) / n, R);
          } else shave(x, y, R);
          last = { x, y };
        };

        const draw = () => {
          ctx.clearRect(0, 0, W, H);
          for (let s = 0; s < 3; s++) {
            ctx.fillStyle = SHADES[s];
            ctx.beginPath();
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const k = r * cols + c;
                if (shade[k] !== s || h[k] < 0.02) continue;
                ctx.rect(c * COL - 0.25, r * ROW - 0.25, COL + 0.5, h[k] * ROW + (h[k] > 0.98 ? 0.5 : 0));
              }
            }
            ctx.fill();
          }
        };

        // Rambut tumbuh lagi pelan, kecuali area judul yang sudah dikunci
        const tick = (_, dt) => {
          const g = dt / 1000 / REGROW;
          for (let k = 0; k < h.length; k++) {
            if (!lock[k] && h[k] < 1) {
              h[k] = Math.min(1, h[k] + g);
              dirty = true;
            }
          }
          if (dirty) {
            draw();
            dirty = false;
          }
        };

        const headRect = () => {
          const rr = root.getBoundingClientRect();
          const hl = root.querySelector(".headline").getBoundingClientRect();
          return { L: hl.left - rr.left, T: hl.top - rr.top, R: hl.right - rr.left, B: hl.bottom - rr.top, ox: rr.left, oy: rr.top };
        };

        // Kunci sel di area judul yang sudah bersih supaya teks tetap terbaca
        const lockHeadline = (all) => {
          const { L, T, R, B } = headRect();
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = c * COL + COL / 2;
              const y = r * ROW + ROW / 2;
              const k = r * cols + c;
              if (x > L - 8 && x < R + 8 && y > T - 8 && y < B + 8 && (all || h[k] < 0.35)) {
                h[k] = 0;
                lock[k] = 1;
              }
            }
          }
          dirty = true;
        };

        build();
        gsap.ticker.add(tick);

        /* ---------- 2. UI masuk setelah sapuan pertama ---------- */
        gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
        const hero = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        hero.from(".ui-in", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: "transform,opacity" });
        gsap.from(".navbar", { y: -30, opacity: 0, duration: 0.9, delay: 0.2, ease: "power3.out" });

        /* ---------- 3. Sapuan clipper otomatis: dua jalur melewati judul ---------- */
        let seen = false;
        try {
          seen = sessionStorage.getItem("intro-seen") === "1";
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          /* storage tidak tersedia, abaikan */
        }

        const { L, T, R: right, B, ox, oy } = headRect();
        const lh = (B - T) / 2;
        const R = lh * 1.1;
        const p = { x: L - R, y: T + lh * 0.5 };
        const sweep = gsap.timeline({
          onUpdate: () => {
            move(p.x, p.y, R);
            gsap.set(cursor, { x: p.x + ox, y: p.y + oy, width: R * 2, height: R * 2, opacity: 1 });
          },
          onComplete: () => {
            lockHeadline(false);
            last = null;
            live = true;
            gsap.to(cursor, { opacity: 0, width: USER_R * 2, height: USER_R * 2, duration: 0.4 });
          },
        });
        sweep
          .to(p, { x: right + R, duration: 1.5, ease: "power2.inOut" })
          .to(p, { y: T + lh * 1.5, duration: 0.35, ease: "power2.inOut" })
          .to(p, { x: L - R, duration: 1.5, ease: "power2.inOut" })
          .add(() => hero.play(), 1.6);
        if (seen) sweep.timeScale(6);

        /* ---------- 4. Kursor = bingkai fokus kamera yang mencukur ---------- */
        const cx = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3.out" });
        const cy = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3.out" });
        let hinted = false;

        const onMove = (e) => {
          if (!live) return;
          const rr = root.getBoundingClientRect();
          const x = e.clientX - rr.left;
          const y = e.clientY - rr.top;
          if (y < 0 || y > rr.height) {
            last = null;
            gsap.to(cursor, { opacity: 0, duration: 0.2 });
            return;
          }
          move(x, y, USER_R);
          cx(e.clientX);
          cy(e.clientY);
          gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: "auto" });
          if (!hinted) {
            hinted = true;
            gsap.to(".hint", { opacity: 0, duration: 0.6 });
          }
        };

        // Klik = potret: flash, bingkai menciut, cukuran lebih lebar
        const onDown = (e) => {
          if (!live || e.target.closest("a, button")) return;
          const rr = root.getBoundingClientRect();
          shave(e.clientX - rr.left, e.clientY - rr.top, USER_R * 2.2);
          gsap.fromTo(".flash", { opacity: 0.35 }, { opacity: 0, duration: 0.45, ease: "power2.out" });
          gsap.fromTo(cursor, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
        };
        const onLeave = () => {
          last = null;
          gsap.to(cursor, { opacity: 0, duration: 0.2 });
        };

        let rt;
        const onResize = () => {
          clearTimeout(rt);
          rt = setTimeout(() => {
            build();
            lockHeadline(true);
          }, 150);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("resize", onResize);
        document.addEventListener("pointerleave", onLeave);

        return () => {
          gsap.ticker.remove(tick);
          clearTimeout(rt);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerdown", onDown);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: heroRef },
  );

  const corner = "absolute size-3 border-[#D3DAD9]";

  return (
    <main ref={heroRef} className={`relative flex min-h-screen touch-pan-y flex-col overflow-hidden bg-[radial-gradient(ellipse_at_30%_40%,#5a5a66_0%,#44444E_35%,#2f2d35_100%)] px-6 pb-16 pt-7 text-[#D3DAD9] md:h-screen md:px-12 md:pb-0 lg:px-20 ${BODY}`}>
      <nav className="navbar relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-[#D3DAD9]/15 bg-[#2a2830]/70 px-6 py-3.5 backdrop-blur-xl">
        <a href="#" className={`${DISPLAY} text-base font-bold`}>imagham</a>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#D3DAD9]/70 md:flex lg:gap-12">
          <a href="#about" className="transition hover:text-[#D3DAD9]">About</a>
          <a href="#works" className="transition hover:text-[#D3DAD9]">Works</a>
          <a href="#gallery" className="transition hover:text-[#D3DAD9]">Gallery</a>
        </div>
        <a href="#contact" className="rounded-full bg-[#D3DAD9] px-5 py-2.5 text-sm font-semibold text-[#37353E] transition hover:bg-white">Let's Talk</a>
      </nav>

      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center py-12 md:py-0">
        {/* Judul ada di bawah rambut: baru terbaca setelah dicukur */}
        <h1 className={`headline relative z-0 ${DISPLAY} text-[clamp(1.9rem,5.4vw,5.5rem)] font-bold leading-[1.1] tracking-[-0.04em]`}>
          <span className="block">Where Technology</span>
          <span className="block text-transparent [-webkit-text-stroke:1.5px_#D3DAD9]">Meets Creativity.</span>
        </h1>

        <div className="relative z-10 mt-8 max-w-xl">
          <ul className="ui-in flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold" aria-label="Peran">
            {ROLES.map((r, i) => (
              <li key={r} className={i ? "border-l border-[#D3DAD9]/30 pl-6" : ""}>{r}</li>
            ))}
          </ul>
          <p className="ui-in mt-5 text-base leading-relaxed text-[#D3DAD9]/80 md:text-lg">{TEXT}</p>
          <div className="ui-in mt-7 flex flex-wrap gap-4">
            <a href="#about" className="rounded-full bg-[#D3DAD9] px-8 py-3.5 font-semibold text-[#37353E] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9]">Get Started</a>
            <a href="#works" className="rounded-full border border-[#D3DAD9]/40 bg-[#2a2830]/60 px-8 py-3.5 font-semibold backdrop-blur transition hover:border-[#D3DAD9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9]">View Works</a>
          </div>
        </div>
      </section>

      {/* Lapisan rambut di atas judul, di bawah UI */}
      <canvas aria-hidden="true" className="hair pointer-events-none absolute inset-0 z-[1] h-full w-full" />

      <p className="hint ui-in pointer-events-none absolute bottom-6 right-6 z-10 hidden text-xs text-[#D3DAD9]/60 md:block">Move to shave. Click to shoot.</p>

      {/* Kursor: bingkai fokus kamera */}
      <div aria-hidden="true" className="cursor pointer-events-none fixed left-0 top-0 z-[60] size-32 opacity-0 [@media(hover:none)]:hidden">
        <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
        <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D3DAD9]" />
      </div>
      <div aria-hidden="true" className="flash pointer-events-none fixed inset-0 z-[70] bg-white opacity-0" />
    </main>
  );
}