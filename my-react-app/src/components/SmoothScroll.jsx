import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const lenisRef = useRef(null);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Setiap Lenis scroll, beri tahu ScrollTrigger
  useLenis(() => ScrollTrigger.update());

  // Lenis ikut ticker GSAP, supaya keduanya satu ritme
  useEffect(() => {
    const raf = (time) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(raf);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: !reduce }}
    />
  );
}