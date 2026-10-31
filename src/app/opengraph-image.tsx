import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { getVisibleProducts } from "@/features/catalog/queries";
import { asJpeg, ogColors as c, ogFonts, ogPhoto, ogSize } from "@/lib/og";

export const alt = `${siteConfig.name} · ${siteConfig.description}`;
export const size = ogSize;
export const contentType = "image/jpeg";

/** Prévia do link da loja: marca à esquerda, quatro fotos reais à direita. */
export default async function Image() {
  const products = (await getVisibleProducts()).filter(
    (p) => p.images.length > 0 && p.category !== "kits",
  );
  // Prefere os destaques; completa com os primeiros da vitrine.
  const chosen = [
    ...products.filter((p) => p.featured),
    ...products.filter((p) => !p.featured),
  ].slice(0, 4);
  const photos = (
    await Promise.all(chosen.map((p) => ogPhoto(p.images[0]?.src)))
  ).filter((p): p is string => p !== null);

  return asJpeg(
    new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: c.surface,
          fontFamily: "Body",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 560,
            padding: "64px 56px 56px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Display",
                fontSize: 64,
                letterSpacing: 9,
                color: c.ink,
                lineHeight: 1,
              }}
            >
              {siteConfig.name}
            </div>
            <div
              style={{
                fontSize: 15,
                letterSpacing: 6,
                color: c.inkMuted,
                marginTop: 12,
                textTransform: "uppercase",
              }}
            >
              {siteConfig.tagline}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Display",
                fontSize: 58,
                lineHeight: 1.05,
                color: c.ink,
              }}
            >
              Cosméticos japoneses e coreanos
            </div>
            <div
              style={{
                fontSize: 24,
                color: c.inkMuted,
                marginTop: 20,
                lineHeight: 1.35,
              }}
            >
              Skincare, cabelos e maquiagem. Poucas unidades, pedido pelo
              WhatsApp.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 640,
            height: 630,
            background: c.surfaceRaised,
          }}
        >
          {photos.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element -- imagem gerada, não é página
            <img
              key={src.slice(-32)}
              src={src}
              alt=""
              width={320}
              height={315}
              style={{ objectFit: "cover" }}
            />
          ))}
        </div>
      </div>,
      { ...size, fonts: await ogFonts() },
    ),
  );
}
