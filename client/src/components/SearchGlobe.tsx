"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function SearchGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    if (!canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 480 * 2,
      height: 480 * 2,
      phi: 0,
      theta: 0.18,
      dark: 0,
      diffuse: 1.0,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.97, 0.98, 0.99], // Matches #F8FAFC page background
      markerColor: [0.21, 0.52, 1],
      glowColor: [0.95, 0.97, 1],
      scale: 0.9, // Prevents top arcs from clipping
      markers: [
        { location: [37.0902, -95.7129], size: 0.05, id: "US" }, // US
        { location: [56.1304, -106.3468], size: 0.05, id: "CA" }, // Canada
        { location: [55.3781, -3.436], size: 0.05, id: "GB" }, // UK
        { location: [51.1657, 10.4515], size: 0.05, id: "DE" }, // Germany
        { location: [-25.2744, 133.7751], size: 0.05, id: "AU" }, // Australia
        { location: [53.4129, -8.2439], size: 0.05, id: "IE" }, // Ireland
        { location: [35.9375, 14.3754], size: 0.05, id: "MT" }, // Malta
      ],
      arcs: [
        { from: [37.0902, -95.7129], to: [55.3781, -3.436] }, // US -> UK
        { from: [56.1304, -106.3468], to: [51.1657, 10.4515] }, // CA -> DE
        { from: [55.3781, -3.436], to: [-25.2744, 133.7751] }, // UK -> AU
        { from: [53.4129, -8.2439], to: [35.9375, 14.3754] }, // IE -> MT
      ],
      arcColor: [0.21, 0.52, 1],
      arcWidth: 0.8,
      arcHeight: 0.35,
    });

    let animationId: number;
    const update = () => {
      phi += 0.003;
      globe.update({ phi });
      animationId = requestAnimationFrame(update);
    };
    update();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      globe.destroy();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[480px] aspect-square flex items-center justify-center pointer-events-none select-none">
      {/* Background glow behind globe */}
      <div className="absolute inset-0 m-auto w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1",
        }}
      />
    </div>
  );
}
