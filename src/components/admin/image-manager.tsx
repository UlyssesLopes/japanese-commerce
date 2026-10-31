"use client";

import { useRef, useState } from "react";

import { uploadImage } from "@/app/admin/actions";
import type { ProductImage } from "@/types/product";

import { buttonClass, ErrorNote, inputClass } from "./ui";

const MAX_SIDE = 2000;

/** Reduz a foto no navegador (lado maior até 2000 px, JPEG) antes de enviar. */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob"))),
      "image/jpeg",
      0.86,
    ),
  );
}

/**
 * Fotos de um produto ou kit. A primeira é a principal. O valor vai para o
 * formulário num campo oculto `images` (JSON).
 */
export function ImageManager({
  initial,
  slug,
  defaultAlt,
  emptyHint,
}: {
  initial: ProductImage[];
  slug: string;
  defaultAlt: string;
  emptyHint?: string;
}) {
  const [images, setImages] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    setError(undefined);
    setUploading(files.length);
    for (const file of Array.from(files)) {
      try {
        const data = new FormData();
        data.set("file", await shrink(file), "foto.jpg");
        if (slug) data.set("slug", slug);
        const result = await uploadImage(data);
        if (result.error || !result.image) {
          setError(result.error ?? "Não consegui enviar a foto.");
        } else {
          const image = { ...result.image, alt: defaultAlt || "Foto" };
          setImages((list) => [...list, image]);
        }
      } catch {
        setError(`Não consegui ler a foto ${file.name}.`);
      }
      setUploading((n) => n - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  function move(index: number, by: number) {
    setImages((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item);
      return next;
    });
  }

  return (
    <div className="grid gap-4">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {images.length === 0 ? (
        <p className="border-line text-ink-muted rounded-lg border border-dashed px-4 py-3 text-sm">
          {emptyHint ?? "Nenhuma foto ainda."}
        </p>
      ) : (
        <ol className="grid gap-3">
          {images.map((image, i) => (
            <li
              key={`${image.src}-${i}`}
              className="border-line flex flex-wrap items-center gap-4 rounded-lg border p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- prévia de foto enviada */}
              <img
                src={image.src}
                alt=""
                className="bg-placeholder size-20 flex-none rounded-md object-cover"
              />
              <div className="grid min-w-48 flex-1 gap-1.5">
                <label
                  htmlFor={`alt-${i}`}
                  className="text-ink-muted text-[0.8125rem]"
                >
                  {i === 0 ? "Foto principal · " : ""}Descrição da foto (para
                  leitores de tela)
                </label>
                <input
                  id={`alt-${i}`}
                  value={image.alt}
                  onChange={(e) =>
                    setImages((list) =>
                      list.map((img, j) =>
                        j === i ? { ...img, alt: e.target.value } : img,
                      ),
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Mover para antes"
                  className="text-ink-muted hover:text-ink size-9 rounded-md disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="Mover para depois"
                  className="text-ink-muted hover:text-ink size-9 rounded-md disabled:opacity-30"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImages((list) => list.filter((_, j) => j !== i))
                  }
                  className="text-negative h-9 rounded-md px-2 text-sm"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {error && <ErrorNote>{error}</ErrorNote>}

      <div className="flex items-center gap-3">
        <label className={`${buttonClass.secondary} cursor-pointer`}>
          {uploading > 0 ? "Enviando…" : "Enviar fotos"}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading > 0}
            onChange={(e) => e.target.files?.length && upload(e.target.files)}
            className="sr-only"
          />
        </label>
        <span className="text-ink-muted text-[0.8125rem]">
          JPG, PNG ou WebP. A primeira foto é a da vitrine.
        </span>
      </div>
    </div>
  );
}
