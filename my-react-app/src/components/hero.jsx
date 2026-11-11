import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/*
  Font (tambahkan sekali di index.html / CSS global):
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,500;12..96,800&display=swap" rel="stylesheet">
*/
const DISPLAY = "font-['Bricolage_Grotesque',system-ui,sans-serif]";
const TEXT =
  "A Software Engineer, Barber, and Photographer driven by curiosity and the passion to create meaningful things.";
const BLADES = [0, 60, 120, 180, 240, 300];
const GLYPHS = "01<>/{}[]*#=+";
const WORD = `intro-word absolute opacity-0 ${DISPLAY} text-6xl font-extrabold leading-none tracking-[-0.03em] md:text-8xl lg:text-9xl`;

// Efek "decode": huruf teracak lalu terkunci satu per satu dari kiri
function scramble(el, text, duration = 1.1) {
  const o = { p: 0 };
  return gsap.to(o, {
    p: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const n = Math.floor(o.p * text.length);
      const rest = Array.from(text.slice(n), (c) =>
        c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0],
      ).join("");
      el.textContent = text.slice(0, n) + rest;
    },
    onComplete: () => (el.textContent = text),
  });
}

export default function Hero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const root = heroRef.current;

      // Tanpa animasi: sembunyikan intro, langsung tampil
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".intro", { display: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- 1. HERO (dimainkan saat iris terbuka) ---------- */
        const hero = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });
        const techEl = root.querySelector(".scramble");

        hero
          .from(".hero-glow", {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            stagger: 0.2,
          })
          .fromTo(
            ".navbar",
            { scaleX: 0, opacity: 0, transformOrigin: "50% 50%" },
            {
              scaleX: 1,
              opacity: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.55)",
            },
            0.1,
          )
          .from(
            ".nav-item",
            {
              y: -15,
              opacity: 0,
              duration: 0.5,
              stagger: 0.1,
              clearProps: "transform,opacity",
            },
            0.4,
          )
          .from(
            ".hero-heading-line",
            {
              yPercent: 120,
              opacity: 0,
              rotateX: -15,
              duration: 1.2,
              stagger: 0.2,
              ease: "power4.out",
            },
            0.5,
          )
          .add(scramble(techEl, "Technology"), 0.7)
          .from(
            ".word",
            {
              yPercent: 120,
              skewY: 8,
              rotate: 4,
              opacity: 0,
              duration: 1.1,
              stagger: 0.045,
            },
            1.1,
          )
          .from(
            ".hero-button",
            {
              scale: 0,
              opacity: 0,
              duration: 1.2,
              ease: "elastic.out(1, 0.5)",
            },
            1.7,
          );

        /* ---------- 2. INTRO: Engineer, Barber, Photographer ---------- */
        let seen = false;
        try {
          seen = sessionStorage.getItem("intro-seen") === "1";
          sessionStorage.setItem("intro-seen", "1");
        } catch {
          /* storage tidak tersedia, abaikan */
        }

        const unlock = () => (document.body.style.overflow = "");
        const barberText = root.querySelector(".w-bar span");
        const stripe = { o: 0 };
        barberText.style.backgroundImage =
          "repeating-linear-gradient(45deg, #D3DAD9 0 8px, #715A5A 8px 16px)";
        barberText.style.backgroundSize = "32px 32px";
        const paint = () => {
          barberText.style.backgroundPositionX = `${stripe.o}px`;
        };
        let skipBtn, onSkip;
        if (seen) {
          gsap.set(".intro", { display: "none" });

          // Background turun dari atas (animasi lama)
          gsap.fromTo(
            ".hero-bg",
            { clipPath: "inset(0% 0% 100% 0% round 0% 0% 20% 20%)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0% 0% 20% 20%)",
              duration: 1.3,
              ease: "power4.inOut",
            },
          );

          hero.delay(0.6).play(); // teks dan navbar masuk setelah background mulai turun
        } else {
          const intro = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              gsap.set(".intro", { display: "none" });
              unlock();
            },
          });

          intro
            .fromTo(
              ".intro-pre",
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.5 },
              0.1,
            )
            // 1. Engineer: diketik
            .set(".w-eng", { opacity: 1 }, 0.3)
            .fromTo(
              ".w-eng .ch",
              { opacity: 0 },
              { opacity: 1, duration: 0.01, stagger: 0.07, ease: "none" },
              0.3,
            )
            .to(
              ".intro-caret",
              {
                opacity: 0,
                duration: 0.12,
                repeat: 3,
                yoyo: true,
                ease: "none",
              },
              1.0,
            )
            .to(
              ".w-eng",
              { yPercent: -60, opacity: 0, duration: 0.35, ease: "power2.in" },
              1.6,
            )
            // 2. Barber: pita striped berputar seperti barber pole
            .fromTo(
              ".w-bar",
              { opacity: 0, yPercent: 60 },
              { opacity: 1, yPercent: 0, duration: 0.5 },
              1.75,
            )
            .to(
              stripe,
              {
                o: 28,
                duration: 0.55,
                ease: "none",
                repeat: 1,
                onUpdate: paint,
              },
              1.75,
            )
            .to(
              ".w-bar",
              { yPercent: -60, opacity: 0, duration: 0.35, ease: "power2.in" },
              2.9,
            )
            // 3. Photographer: fokus menajam, lalu shutter klik
            .fromTo(
              ".w-pho",
              { opacity: 0, filter: "blur(26px)" },
              {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power2.out",
              },
              3.05,
            )
            .fromTo(
              ".intro-flash",
              { opacity: 0.9 },
              { opacity: 0, duration: 0.5 },
              3.85,
            )
            .to(
              [".w-pho", ".intro-pre"],
              { opacity: 0, scale: 1.08, duration: 0.35, ease: "power2.in" },
              3.95,
            )
            // Iris membuka, hero muncul di baliknya
            .addLabel("open", 4.1)
            .to(
              ".ap-blade",
              { y: 0, duration: 1.3, ease: "power3.inOut" },
              "open",
            )
            .to(
              ".ap-iris",
              { rotate: 70, duration: 1.3, ease: "power3.inOut" },
              "open",
            )
            .add(() => hero.play(), "open+=0.55");

          skipBtn = root.querySelector(".intro-skip");
          onSkip = () => intro.timeScale(6);
          skipBtn.addEventListener("click", onSkip);
        }

        /* ---------- 3. LOOP ---------- */
        gsap.fromTo(
          ".shine",
          { xPercent: -150 },
          {
            xPercent: 350,
            duration: 1.1,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 2.5,
            delay: 7,
          },
        );
        gsap.to(".hero-glow-1", {
          x: -40,
          y: 30,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to(".hero-glow-2", {
          x: 40,
          y: -30,
          duration: 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        /* ---------- 4. PARALLAX MOUSE ---------- */
        const layers = gsap.utils.toArray(".parallax").map((el) => ({
          depth: Number(el.dataset.depth || 20),
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        }));
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth);
          });
        };
        window.addEventListener("mousemove", onMove);

        /* ---------- 5. TOMBOL MAGNETIK ---------- */
        const magnets = gsap.utils.toArray(".magnet").map((el) => {
          const label = el.querySelector(".label");
          const xTo = gsap.quickTo(el, "x", {
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
          const lblX = label
            ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3" })
            : null;
          const lblY = label
            ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3" })
            : null;

          const move = (e) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            xTo(dx * 0.35);
            yTo(dy * 0.35);
            if (lblX) {
              lblX(dx * 0.15);
              lblY(dy * 0.15);
            }
          };
          const leave = () => {
            xTo(0);
            yTo(0);
            if (lblX) {
              lblX(0);
              lblY(0);
            }
          };
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          return { el, move, leave };
        });

        return () => {
          unlock();
          if (skipBtn) skipBtn.removeEventListener("click", onSkip);
          window.removeEventListener("mousemove", onMove);
          magnets.forEach(({ el, move, leave }) => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
          });
        };
      });
    },
    { scope: heroRef },
  );

  return (
    <main
      ref={heroRef}
      className="relative min-h-screen overflow-hidden px-6 pt-7 text-[#D3DAD9] md:h-screen md:px-12 lg:px-20"
    >
      {/* ===== INTRO OVERLAY ===== */}
      <div className="intro fixed inset-0 z-50">
        {/* Iris: enam bilah, awalnya menutup penuh */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
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

        {/* Kata-kata di atas iris */}
        <div className="absolute inset-0 grid place-items-center">
          <p
            className={`intro-pre absolute top-[34%] text-lg text-[#D3DAD9]/70 opacity-0 md:text-2xl ${DISPLAY}`}
          >
            I'm a
          </p>

          <h2 className={`${WORD} w-eng`} aria-label="Software Engineer">
            {"Engineer".split("").map((c, i) => (
              <span key={i} className="ch inline-block">
                {c}
              </span>
            ))}
            <span className="intro-caret ml-1 inline-block h-[0.75em] w-[0.07em] bg-[#D3DAD9] align-baseline" />
          </h2>

          <h2 className={`${WORD} w-bar`}>
            <span className="bg-clip-text text-transparent">Barber</span>
          </h2>

          <h2 className={`${WORD} w-pho`}>Photographer</h2>
        </div>

        <div className="intro-flash pointer-events-none absolute inset-0 bg-[#D3DAD9] opacity-0" />

        <button
          type="button"
          className={`intro-skip absolute bottom-6 right-6 rounded-full border border-[#D3DAD9]/25 px-4 py-2 text-sm text-[#D3DAD9]/70 transition hover:text-[#D3DAD9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3DAD9] ${DISPLAY}`}
        >
          Skip intro
        </button>
      </div>

      {/* ===== HERO ===== */}
      <div className="hero-bg absolute inset-0 z-0 overflow-hidden rounded-b-[20%] bg-[#37353E]">
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#D3DAD9_1px,transparent_1px),linear-gradient(to_bottom,#D3DAD9_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="hero-glow hero-glow-1 pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#715A5A]/30 blur-[100px]" />
      <div className="hero-glow hero-glow-2 pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#D3DAD9]/10 blur-[100px]" />

      <nav className="navbar relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-[#D3DAD9]/20 bg-[#D3DAD9]/10 px-6 py-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <a
          href="#"
          className="nav-item text-xl font-bold tracking-tight text-[#D3DAD9]"
        >
          imagham
        </a>
        <div className="hidden items-center gap-8 text-sm text-[#D3DAD9]/75 md:flex lg:gap-12">
          <a href="#about" className="nav-item transition hover:text-[#D3DAD9]">
            About
          </a>
          <a href="#works" className="nav-item transition hover:text-[#D3DAD9]">
            Works
          </a>
          <a
            href="#gallery"
            className="nav-item transition hover:text-[#D3DAD9]"
          >
            Gallery
          </a>
        </div>
        <a
          href="#contact"
          className="nav-item rounded-full bg-[#715A5A] px-5 py-2.5 text-sm font-semibold text-[#D3DAD9] transition hover:bg-[#44444E]"
        >
          Let's Talk
        </a>
      </nav>

      <section className="relative z-10 mt-20 flex flex-col items-center justify-center text-center">
        <h1
          className={`parallax ${DISPLAY} text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-[#D3DAD9] md:text-5xl lg:text-[80px] xl:text-[100px]`}
          data-depth="14"
        >
          <span className="block overflow-hidden pb-2">
            <span className="hero-heading-line block">
              Where <span className="scramble">Technology</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-heading-line block font-light italic text-[#D3DAD9]/90">
              Meets Creativity.
            </span>
          </span>
        </h1>

        <div className="hero-content flex flex-col items-center">
          <p className="hero-description mt-10 max-w-2xl text-lg font-semibold text-[#D3DAD9]/80 md:text-xl">
            {TEXT.split(" ").map((word, i) => (
              <span
                key={i}
                className="mr-[0.28em] inline-block overflow-hidden align-bottom"
              >
                <span className="word inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </p>

          <a
            href="#about"
            className="hero-button magnet relative mt-8 inline-block overflow-hidden rounded-full bg-[#D3DAD9] px-8 py-3 text-lg font-semibold text-[#37353E] transition-colors hover:bg-white"
          >
            <span className="label relative z-10 inline-block">
              Get Started
            </span>
            <span className="shine pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[#37353E]/15 blur-sm" />
          </a>
        </div>
      </section>
    </main>
  );
}
