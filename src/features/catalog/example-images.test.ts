import { describe, expect, it } from "vitest";

import { displayImage, displayImages, exampleImages } from "./example-images";
import { fixtureProduct } from "./fixtures";

describe("displayImage", () => {
  it("usa a foto própria quando existe", () => {
    const own = {
      src: "/produtos/x.jpg",
      alt: "Frasco",
      width: 800,
      height: 800,
    };
    expect(displayImage({ ...fixtureProduct, images: [own] })).toEqual({
      ...own,
      illustrative: false,
    });
  });

  it("sem foto, usa uma ilustrativa da categoria e marca como tal", () => {
    const image = displayImage({ ...fixtureProduct, category: "cabelos" });
    expect(image.illustrative).toBe(true);
    expect(exampleImages.cabelos.map((i) => i.src)).toContain(image.src);
  });

  it("escolhe sempre a mesma ilustrativa para o mesmo produto", () => {
    expect(displayImage(fixtureProduct).src).toBe(
      displayImage(fixtureProduct).src,
    );
  });
});

describe("displayImages", () => {
  it("devolve todas as fotos próprias, sem ilustrativa", () => {
    const photos = [1, 2, 3].map((n) => ({
      src: `/produtos/x-${n}.jpg`,
      alt: "Foto",
      width: 800,
      height: 800,
    }));
    const images = displayImages({ ...fixtureProduct, images: photos });
    expect(images).toHaveLength(3);
    expect(images.every((i) => !i.illustrative)).toBe(true);
  });

  it("sem fotos, devolve só a ilustrativa", () => {
    const images = displayImages(fixtureProduct);
    expect(images).toHaveLength(1);
    expect(images[0].illustrative).toBe(true);
  });
});
