import Image from "next/image";

import goyo from "../../public/editorial/goyo-mulher-se-maquiando.jpg";

import { Container } from "./container";

export function Hero() {
  return (
    <section className="bg-brand text-brand-ink">
      <Container className="grid gap-10 py-12 md:grid-cols-12 md:items-center md:gap-8 md:py-16 lg:py-20">
        <div className="md:col-span-7">
          <h1 className="font-display text-display tracking-[-0.02em] text-balance">
            Trazidos do Japão
            <br />
            <em className="text-brand-soft">na nossa mala.</em>
          </h1>
          <p className="text-lead mt-8 max-w-[34ch]">
            Skincare, cabelos e maquiagem de marcas japonesas e coreanas,
            escolhidos um a um numa viagem. Monte sua sacola e finalize a compra
            pelo WhatsApp.
          </p>
          <a
            href="#produtos"
            className="bg-brand-ink text-brand hover:bg-brand-soft mt-10 inline-flex h-12 items-center px-7 font-medium transition-colors"
          >
            Ver os produtos
          </a>
        </div>

        <figure className="md:col-span-5">
          <div className="overflow-hidden">
            <Image
              src={goyo}
              alt="Gravura japonesa: uma mulher de quimono vermelho segura um espelho e passa pó no colo."
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              // Recorte que esconde a moldura do museu em volta da gravura.
              className="aspect-[4/3] w-full scale-[1.18] object-cover object-[50%_32%] md:aspect-[4/5] md:object-[50%_45%]"
              placeholder="blur"
            />
          </div>
          <figcaption className="text-small text-brand-ink/80 mt-3">
            Hashiguchi Goyō, <cite>Mulher se maquiando</cite>, 1918.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
