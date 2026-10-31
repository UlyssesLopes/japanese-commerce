import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Peças das imagens de compartilhamento (prévia do link no WhatsApp,
 * Instagram etc.). Mesmas fontes e cores do site; o gerador (`next/og`) não
 * lê woff2 nem variáveis CSS, por isso as fontes e os hex ficam aqui.
 */

export const ogSize = { width: 1200, height: 630 };

/** Cores de `globals.css` (o gerador não lê os tokens). */
export const ogColors = {
  surface: "#faf6f0",
  surfaceRaised: "#efe6da",
  ink: "#24231f",
  inkMuted: "#6c665b",
  brand: "#3b3e2c",
  brandInk: "#f4ece0",
};

const font = (file: string) =>
  readFile(join(process.cwd(), "assets/fonts", file));

export async function ogFonts() {
  const [display, body, bodyBold] = await Promise.all([
    font("cormorant-garamond-latin-500-normal.woff"),
    font("instrument-sans-latin-400-normal.woff"),
    font("instrument-sans-latin-600-normal.woff"),
  ]);
  return [
    { name: "Display", data: display, weight: 500 as const },
    { name: "Body", data: body, weight: 400 as const },
    { name: "Body", data: bodyBold, weight: 600 as const },
  ];
}

/**
 * Foto do produto como data URL: as do site vêm de `public/`, as enviadas
 * pelo backoffice vêm da API. Sem foto ou com erro, devolve null.
 */
export async function ogPhoto(src: string | undefined): Promise<string | null> {
  if (!src) return null;
  try {
    if (src.startsWith("/")) {
      const data = await readFile(join(process.cwd(), "public", src));
      const type = src.endsWith(".png") ? "image/png" : "image/jpeg";
      return `data:${type};base64,${data.toString("base64")}`;
    }
    const res = await fetch(src);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const data = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Converte a imagem gerada (PNG, ~1 MB com fotos) em JPEG leve: o WhatsApp só
 * mostra a prévia com imagens pequenas (cerca de 300 KB).
 */
export async function asJpeg(image: Response): Promise<Response> {
  const { default: sharp } = await import("sharp");
  const jpeg = await sharp(Buffer.from(await image.arrayBuffer()))
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control":
        image.headers.get("Cache-Control") ?? "public, max-age=3600",
    },
  });
}
