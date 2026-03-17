"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Client-side wrapper to handle GSAP animations for the Auth layout.
 * By using this wrapper, we can keep the rest of the AuthLayout as a Server Component.
 */
const AuthAnimationWrapper = ({ children }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Panel Entrance
      tl.fromTo(
        ".left-panel",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
      ).fromTo(
        ".right-panel",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "<",
      );

      // Content Stagger
      tl.fromTo(
        ".stagger-in",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden font-sans">
      {children}
    </div>
  );
};

export default AuthAnimationWrapper;
