import { useState } from "react";

export function PropertyGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const slides = images.length > 0 ? images : [];

  if (slides.length === 0) {
    return (
      <div className="flex aspect-16/10 items-center justify-center rounded-t-[12px] border border-[#E5E7EB] bg-[#F3F4F6] text-sm text-[#6B7280]">
        No images uploaded
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-t-[12px] border-b-2 border-[#E55B13] bg-[#F3F4F6]">
        <img
          src={slides[active]}
          alt=""
          className="aspect-16/10 w-full object-cover"
        />
      </div>

      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show image ${index + 1}`}
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
        <div className="mt-3 grid grid-cols-3 gap-3">
          {slides.slice(0, 3).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className="overflow-hidden rounded-[10px] border-2 border-[#E55B13]"
            >
              <img
                src={src}
                alt=""
                className="aspect-4/3 w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
