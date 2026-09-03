import { useEffect, useRef, useState } from "react";

const SLIDE_MS = 4000;

export function PropertyGallery({ images }: { images: string[] }) {
  const slides = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setActive(0);
  }, [slides.length, slides[0]]);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setActive((current) => (current + 1) % slides.length);
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [slides.length, paused, active]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[active];
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  if (slides.length === 0) {
    return (
      <div className="flex aspect-16/10 items-center justify-center rounded-t-[12px] border border-[#E5E7EB] bg-[#F3F4F6] text-sm text-[#6B7280]">
        No images uploaded
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-t-[12px] border-b-2 border-[#E55B13] bg-[#F3F4F6]">
        <div className="relative aspect-16/10 w-full">
          {slides.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              className={[
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                index === active ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={[
                "rounded-full transition-all",
                index === active
                  ? "h-1.5 w-5 bg-[#E55B13]"
                  : "size-1.5 bg-[#D1D5DB]",
              ].join(" ")}
            />
          ))}
        </div>
      ) : null}

      {slides.length > 1 ? (
        <div
          ref={stripRef}
          className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]"
        >
          {slides.map((src, index) => (
            <button
              key={`${src}-${index}`}
              ref={(node) => {
                thumbRefs.current[index] = node;
              }}
              type="button"
              aria-label={`Select image ${index + 1}`}
              onClick={() => setActive(index)}
              className={[
                "w-[31%] shrink-0 snap-start overflow-hidden rounded-[10px] border-2 transition-colors",
                index === active ? "border-[#E55B13]" : "border-transparent",
              ].join(" ")}
            >
              <img src={src} alt="" className="aspect-4/3 w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
