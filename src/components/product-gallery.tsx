"use client";

import Image from "next/image";
import { useState } from "react";

import type { DisplayImage } from "@/features/catalog/example-images";

import { IllustrativeTag } from "./illustrative-tag";

/** Foto principal e, quando houver mais de uma, miniaturas para trocar. */
export function ProductGallery({ images }: { images: DisplayImage[] }) {
  const [current, setCurrent] = useState(0);
  const image = images[current];
  // Segue o formato da foto, entre 4:5 (vertical) e 1:1, para não cortar o frasco.
  const ratio = Math.min(1, Math.max(4 / 5, image.width / image.height));

  return (
    <div>
      <div
        className="bg-surface-raised relative overflow-hidden"
        style={{ aspectRatio: ratio }}
      >
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={current === 0}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        {image.illustrative && <IllustrativeTag />}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
                aria-current={i === current}
                className={`bg-surface-raised relative block aspect-square w-full overflow-hidden outline-offset-2 ${
                  i === current
                    ? "outline-brand outline-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
