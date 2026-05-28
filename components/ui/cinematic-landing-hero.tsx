"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { PromptingIsAllYouNeed } from "./animated-hero-section";
import { CinematicParticles } from "./cinematic-particles";
import { LiquidButton } from "./liquid-glass-button";
import { DottedSurface } from "./dotted-surface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */
  
  /* OUTSIDE THE CARD: High-contrast white text formatted for black background */
  .text-3d-matte {
      color: #FFFFFF;
      text-shadow: 
          0 10px 30px rgba(255, 255, 255, 0.15), 
          0 2px 4px rgba(255, 255, 255, 0.1);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(200, 200, 220, 0.6) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0); /* Hardware acceleration to prevent WebKit clipping bug */
      filter: 
          drop-shadow(0px 10px 20px rgba(255, 255, 255, 0.1)) 
          drop-shadow(0px 2px 4px rgba(255, 255, 255, 0.05));
  }

  /* INSIDE THE CARD: Hardcoded Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #070914 0%, #030408 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.08),
          inset 0 -2px 4px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic Android Mockup Hardware (Google Pixel style) */
  .android-bezel {
      background-color: #0c0d12;
      box-shadow: 
          inset 0 0 0 2px #4b4e5a, 
          inset 0 0 0 6px #000, 
          0 40px 80px -15px rgba(0,0,0,0.95),
          0 15px 25px -5px rgba(0,0,0,0.85);
      border-radius: 2.75rem;
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #374151 0%, #1f2937 100%);
      box-shadow: 
          -1px 0 3px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.1),
          inset 1px 0 1px rgba(0,0,0,0.8);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(15, 22, 42, 0.95) 0%, rgba(8, 10, 21, 0.98) 100%);
      backdrop-filter: blur(16px); 
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 
          0 0 0 1.5px rgba(255, 255, 255, 0.18),
          0 20px 40px rgba(0, 0, 0, 0.95),
          inset 0 1px 1.5px rgba(255, 255, 255, 0.2),
          inset 0 -1px 1px rgba(0, 0, 0, 0.7);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  className?: string;
}

export function CinematicHero({ 
  brandName = "TrocShop",
  tagline1 = "TrocShop, le premier réseau de troc et de vente à Yamoussoukro",
  tagline2 = "Faites du troc local simplement.",
  cardHeading = "Installer l'application en 3 étapes simples :",
  cardDescription = "",
  metricValue = 1850,
  metricLabel = "Troc & Vente Actifs",
  ctaHeading = "Rejoignez le réseau.",
  ctaDescription = "Prenez part à la plus grande communauté d'échange et de troc direct à Yamoussoukro.",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  // 1. High-Performance Mouse Interaction Logic (Using requestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 12,
            rotationX: -yVal * 12,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Complex Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3500",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
        )
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "-=1.5")
        .to({}, { duration: 12.0 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 }) 
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        // Responsive card pullback sizing
        .to(".main-card", { 
          width: isMobile ? "92vw" : "85vw", 
          height: isMobile ? "92vh" : "85vh", 
          borderRadius: isMobile ? "32px" : "40px", 
          ease: "expo.inOut", 
          duration: 1.8 
        }, "pullback") 
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]); 

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-black text-foreground font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />
      <CinematicParticles />

      {/* BACKGROUND LAYER: Hero Texts */}
      <div className="hero-text-wrapper absolute inset-0 z-10 flex flex-col items-center justify-center text-center w-screen px-4 will-change-transform transform-style-3d select-none">
        <div className="text-track text-days gsap-reveal w-full max-w-5xl h-full flex flex-col items-center justify-center">
          <PromptingIsAllYouNeed />
        </div>
      </div>

      {/* BACKGROUND LAYER 2: Tactile CTA Buttons */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-silver-matte">
          {ctaHeading}
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center z-30">
          <LiquidButton asChild size="xl">
            <a href="#" aria-label="Download Android App APK" className="flex items-center justify-center gap-3 px-6 py-3 min-w-[280px]">
              {/* Authentic Google Play Store Solid Logo SVG */}
              <svg className="w-6 h-6 text-[#ff4500] transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]" fill="currentColor" viewBox="0 0 512 512" aria-hidden="true">
                 <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <div className="text-left text-white">
                <div className="text-[9px] font-extrabold tracking-widest text-[#ff4500] uppercase mb-[1px]">Télécharger pour</div>
                <div className="text-[15px] font-black leading-none tracking-wide text-zinc-100">Android (Fichier APK)</div>
              </div>
            </a>
          </LiquidButton>
        </div>
      </div>

      {/* FOREGROUND LAYER: The Physical Deep Blue Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />
          <DottedSurface className="absolute inset-0 z-1 opacity-80 pointer-events-none mix-blend-screen" />

          {/* DYNAMIC RESPONSIVE GRID: Flex-col on mobile to force order, Grid on desktop */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-12 items-center lg:gap-8 z-10 py-4 lg:py-0">
            
            {/* 1. BRAND NAME & LOCAL HIGHLIGHTS */}
            <div className="card-right-text gsap-reveal order-1 lg:order-2 lg:col-span-12 flex flex-col justify-center items-center z-20 w-full text-center px-4 mb-2">
              <h2 className="text-4xl md:text-[4.5rem] lg:text-[5.5rem] font-black uppercase tracking-tighter text-card-silver-matte leading-none mb-3 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.95)]">
                {brandName}
              </h2>
              <p className="text-white text-base md:text-lg lg:text-xl max-w-2xl font-semibold tracking-wide leading-relaxed filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                Profitez d'un design premium et d'une application légère, épurée et moderne.
              </p>
            </div>

            {/* 2. MIDDLE (Mobile) / CENTER (Desktop): ANDROID MOCKUP */}
            <div className="mockup-scroll-wrapper order-2 lg:order-1 lg:col-span-12 relative w-full h-[300px] lg:h-[460px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              
              {/* Inner wrapper for safe CSS scaling that doesn't conflict with GSAP */}
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.5] md:scale-70 lg:scale-[0.78]">
                
                {/* The Android Bezel (Pixel Style) */}
                <div
                  ref={mockupRef}
                  className="relative w-[285px] h-[585px] rounded-[2.75rem] android-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Physical Hardware Buttons (Android Style: Volume & Power right-aligned) */}
                  <div className="absolute top-[120px] -right-[3px] w-[3px] h-[45px] hardware-btn rounded-r-sm z-0" aria-hidden="true" />
                  <div className="absolute top-[180px] -right-[3px] w-[3px] h-[80px] hardware-btn rounded-r-sm z-0" aria-hidden="true" />

                  {/* Inner Screen Container */}
                  <div className="absolute inset-[6px] bg-[#f4f5f8] rounded-[2.45rem] overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.4)] text-[#1f2937] z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Android Status Bar */}
                    <div className="absolute top-0 inset-x-0 h-7 px-5 flex items-center justify-between z-50 text-[10px] text-zinc-600 font-bold bg-white/70 backdrop-blur-md">
                      <span>13:39</span>
                      {/* Android Punch-Hole Selfie Camera Unit */}
                      <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-zinc-900" />
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        {/* Android Wifi Icon */}
                        <svg className="w-3.5 h-3.5 text-zinc-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 21l-12-12c3.5-3.5 8.5-5.5 12-5.5s8.5 2 12 5.5l-12 12z" />
                        </svg>
                        {/* Android Battery Icon */}
                        <div className="w-4.5 h-2.5 border border-zinc-400 rounded-2xs p-[1px] flex items-center">
                          <div className="h-full w-[88%] bg-green-600 rounded-3xs" />
                        </div>
                      </div>
                    </div>

                    {/* App Interface */}
                    <div className="relative w-full h-full pt-8 px-3 pb-3 flex flex-col justify-between">
                      <div className="flex-1 flex flex-col pt-2">
                        {/* TrocShop Mockup Brand Header */}
                        <div className="phone-widget flex justify-between items-center mb-2.5 bg-white rounded-[1.25rem] px-3 py-1.5 text-black shadow-[0_5px_15px_-3px_rgba(0,0,0,0.06)] border border-zinc-100">
                          <div className="flex items-center gap-1">
                            {/* Orange TS icon */}
                            <div className="w-6 h-6 rounded-md bg-[#ff4500] flex items-center justify-center text-white font-extrabold text-[10px] tracking-tighter">
                              TS
                            </div>
                            <span className="text-xs font-black italic tracking-tight text-neutral-900">
                              TrocShop.
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Notification Bell */}
                            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                            </div>
                            {/* Profile with a completely black photo and online green dot */}
                            <div className="relative">
                              <div className="w-6.5 h-6.5 rounded-full bg-black border border-zinc-400 shadow-sm flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-black" />
                              </div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white" />
                            </div>
                          </div>
                        </div>

                        {/* Slide/Banner Card (VOS OBJETS ONT DE LA VALEUR) */}
                        <div className="relative rounded-[1.25rem] p-3 overflow-hidden flex flex-col justify-between items-start min-h-[125px] text-left shadow-md border border-amber-900/10 bg-gradient-to-br from-[#f97316]/5 via-[#fafafb] to-[#fee2e2]">
                          {/* Hands & box vector representation */}
                          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none w-20 h-20">
                            <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#f97316]">
                              <rect x="25" y="45" width="50" height="35" rx="5" />
                              <path d="M50 20L20 45h60z" />
                            </svg>
                          </div>
                          <div className="z-10">
                            <h4 className="text-[12px] font-black tracking-tight text-neutral-900 leading-tight">
                              VOS OBJETS ONT DE LA VALEUR.
                            </h4>
                            <p className="text-[8.5px] text-zinc-600 leading-normal mt-0.5 max-w-[85%] font-medium">
                              Troquez ou vendez vos articles en un clin d'œil.
                            </p>
                          </div>
                          <button className="z-10 mt-2 px-4 py-1.5 rounded-full bg-[#ff4500] text-white text-[8px] font-black tracking-wider uppercase shadow-sm">
                            COMMENCER
                          </button>
                        </div>

                        {/* Categories List */}
                        <div className="phone-widget mt-2.5 mb-2 flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                          <span className="shrink-0 px-2.5 py-1 bg-white hover:bg-zinc-50 text-neutral-800 border border-zinc-200 rounded-full text-[7.5px] font-extrabold tracking-tight">
                            ÉLECTRONIQUE / INFORMATIQUE
                          </span>
                          <span className="shrink-0 px-2.5 py-1 bg-zinc-200/50 text-neutral-600 border border-zinc-200/20 rounded-full text-[7.5px] font-extrabold tracking-tight">
                            MODE & BEAUTÉ
                          </span>
                        </div>

                        {/* "À la une" Section */}
                        <div className="phone-widget flex-1 flex flex-col justify-between mt-1">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10.5px] font-black text-neutral-800 tracking-tight">À la une</span>
                            <span className="text-[8px] font-extrabold text-[#ff4500] flex items-center gap-0.5">
                              VOIR PLUS <span className="text-[6.5px]">▶</span>
                            </span>
                          </div>
                          
                          {/* Live grid of objects in mockup */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <div className="bg-white rounded-[0.75rem] border border-zinc-100 p-1.5 flex flex-col justify-between shadow-xs">
                              <div className="h-12 bg-zinc-50 rounded-md overflow-hidden relative mb-1 flex items-center justify-center">
                                <span className="text-base">🎮</span>
                                <span className="absolute top-1 left-1 bg-[#ff4500] text-white text-[5px] font-bold px-1 py-0.2 rounded-2xs">TROC</span>
                              </div>
                              <div className="text-[7.5px] font-bold text-neutral-800 truncate">PS5 Slim 1To</div>
                              <div className="text-[6.5px] text-zinc-400 truncate">Sopim, Yakro</div>
                            </div>
                            
                            <div className="bg-white rounded-[0.75rem] border border-zinc-100 p-1.5 flex flex-col justify-between shadow-xs">
                              <div className="h-12 bg-zinc-50 rounded-md overflow-hidden relative mb-1 flex items-center justify-center">
                                <span className="text-base">🏍️</span>
                                <span className="absolute top-1 left-1 bg-green-500 text-white text-[5px] font-bold px-1 py-0.2 rounded-2xs">VENTE</span>
                              </div>
                              <div className="text-[7.5px] font-bold text-[#ff4500] truncate">KTM Duke 200</div>
                              <div className="text-[6.5px] text-zinc-400 truncate">Assabou, Yakro</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation white card layout with floating Orange + */}
                      <div className="phone-widget bg-white rounded-[1.2rem] p-1 flex items-center justify-between text-neutral-600 shadow-md border border-zinc-100 relative mt-2 z-20">
                        {/* Active Home with warm background */}
                        <div className="w-7.5 h-7.5 rounded-full bg-[#fff5f2] flex items-center justify-center text-[#ff4500]">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        {/* Search icon */}
                        <div className="w-7 h-7 flex items-center justify-center text-zinc-400">
                          <svg className="w-4 h-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {/* Floating rounded Orange plus button */}
                        <div className="relative -top-4">
                          <div className="w-9 h-9 rounded-full bg-[#ff4500] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#ff4500]/30 border-2 border-white scale-105">
                            +
                          </div>
                        </div>
                        {/* Handshake Deals icon */}
                        <div className="w-7 h-7 flex items-center justify-center text-zinc-400">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        {/* Chat icon */}
                        <div className="w-7 h-7 flex items-center justify-center text-zinc-400">
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>

                      {/* Android Bottom Navigation Gesture Bar */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-[3.5px] bg-[#cbcdd0] rounded-full z-40" />
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badges */}
                <div className="floating-badge absolute flex top-6 lg:top-12 left-[-15px] lg:left-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-amber-500/20 to-amber-900/10 flex items-center justify-center border border-amber-400/30 shadow-inner">
                    <span className="text-base lg:text-xl drop-shadow-lg" aria-hidden="true">🔄</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Troc validé !</p>
                    <p className="text-amber-200/50 text-[10px] lg:text-xs font-medium">Objet échangé à Yamoussoukro</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-12 lg:bottom-20 right-[-15px] lg:right-[-80px] floating-ui-badge rounded-xl lg:rounded-2xl p-3 lg:p-4 items-center gap-3 lg:gap-4 z-30">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                    <span className="text-base lg:text-lg drop-shadow-lg" aria-hidden="true">💬</span>
                  </div>
                  <div>
                    <p className="text-white text-xs lg:text-sm font-bold tracking-tight">Koffi A.</p>
                    <p className="text-emerald-200/50 text-[10px] lg:text-xs font-medium">« Dispo au quartier 220 Logements »</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Explanatory custom block for installation under the mockup phone */}
            <div className="order-3 lg:col-span-12 w-full max-w-3xl mx-auto text-center px-4 mb-6 select-none flex flex-col items-center relative z-25">
              <h4 className="text-card-silver-matte font-black text-sm md:text-base tracking-widest uppercase mb-2 text-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)]">
                GUIDE D'INSTALLATION
              </h4>
              <p className="text-white text-xs md:text-sm leading-relaxed font-semibold text-center filter drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]">
                Pour installer l'application, commencez par télécharger le fichier APK sécurisé depuis notre bouton d'installation. Ensuite, ouvrez les paramètres de votre téléphone Android afin d'autoriser l'installation provenant de sources inconnues. Ouvrez enfin le fichier téléchargé et appuyez sur "Installer" pour finaliser l'opération. Lancez l'application pour profiter du premier réseau de troc sécurisé à Yamoussoukro !
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
