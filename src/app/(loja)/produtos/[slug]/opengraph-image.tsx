import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { displayImage } from "@/features/catalog/example-images";
import { getProductBySlug } from "@/features/catalog/queries";
import { stockBadge } from "@/features/catalog/stock-badge";
import { formatPrice } from "@/lib/currency";
import { asJpeg, ogColors as c, ogFonts, ogPhoto, ogSize } from "@/lib/og";

export const alt = "Produto da ZIVORA";
export const size = ogSize;
export const contentType = "image/jpeg";

/** Prévia do link de um produto: foto, marca, nome e preço. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = await getProductBySlug((await params).slug);
  const image = product ? displayImage(product) : null;
  // Foto ilustrativa não entra na prévia: ela não mostra o produto.
  const photo = image && !image.illustrative ? await ogPhoto(image.src) : null;
  const badge = product ? stockBadge(product) : null;
  const details = product
    ? [product.subtitle, product.volume].filter(Boolean).join(" · ")
    : "";

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
            position: "relative",
            width: 630,
            height: 630,
            background: c.surfaceRaised,
          }}
        >
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element -- imagem gerada, não é página
            <img
              src={photo}
              alt=""
              width={630}
              height={630}
              style={{ objectFit: "cover" }}
            />
          )}
          {badge && (
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                background: c.brand,
                color: c.brandInk,
                fontSize: 24,
                fontWeight: 600,
                padding: "8px 16px",
              }}
            >
              {badge}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 570,
            padding: "56px 56px 52px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, color: c.inkMuted, fontWeight: 600 }}>
              {product?.brand ?? siteConfig.name}
            </div>
            <div
              style={{
                fontFamily: "Display",
                fontSize: (product?.name.length ?? 0) > 34 ? 48 : 60,
                lineHeight: 1.05,
                color: c.ink,
                marginTop: 10,
              }}
            >
              {product?.name ?? siteConfig.description}
            </div>
            {details && (
              <div style={{ fontSize: 26, color: c.inkMuted, marginTop: 14 }}>
                {details}
              </div>
            )}
            {product && (
              <div
                style={{
                  fontSize: product.priceCents === null ? 28 : 44,
                  fontWeight: 600,
                  color: product.priceCents === null ? c.inkMuted : c.ink,
                  marginTop: 28,
                }}
              >
                {formatPrice(product.priceCents)}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: "Display",
                fontSize: 40,
                letterSpacing: 6,
                color: c.ink,
              }}
            >
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 18, color: c.inkMuted }}>
              Pedido pelo WhatsApp
            </div>
          </div>
        </div>
      </div>,
      { ...size, fonts: await ogFonts() },
    ),
  );
}
