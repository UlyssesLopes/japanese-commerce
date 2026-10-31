"use client";

import { useActionState, useState } from "react";

import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { categories } from "@/features/catalog/categories";
import { formatMoneyInput, parseMoney } from "@/features/admin/money";
import { missingForSale } from "@/features/admin/readiness";
import { slugify } from "@/features/admin/slug";
import type { AdminProduct } from "@/features/admin/types";
import type { Product } from "@/types/product";

import { DeleteZone, SaveBar } from "./form-parts";
import { ImageManager } from "./image-manager";
import { Check, Field, inputClass, textareaClass, Pill, Section } from "./ui";

const statusOptions: {
  value: Product["publicationStatus"];
  label: string;
  description: string;
}[] = [
  { value: "draft", label: "Rascunho", description: "Não aparece no site." },
  {
    value: "preview",
    label: "Prévia",
    description: "Aparece no site, sem botão de compra.",
  },
  {
    value: "published",
    label: "Publicado",
    description: "Aparece no site e pode ser vendido. Precisa de foto.",
  },
];

export function ProductForm({ product }: { product?: AdminProduct }) {
  const id = product?.id ?? null;
  const [state, action, pending] = useActionState(
    saveProduct.bind(null, id),
    {},
  );

  const [brand, setBrand] = useState(product?.brand ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [price, setPrice] = useState(formatMoneyInput(product?.priceCents));
  const [inventory, setInventory] = useState(
    String(product?.inventoryQuantity ?? 1),
  );
  const [available, setAvailable] = useState(
    String(product?.availableQuantity ?? 1),
  );
  const [status, setStatus] = useState<Product["publicationStatus"]>(
    product?.publicationStatus ?? "draft",
  );
  const [purchaseEnabled, setPurchaseEnabled] = useState(
    product?.purchaseEnabled ?? false,
  );

  const autoSlug = slugify(`${brand} ${name}`);
  const currentSlug = slugTouched ? slug : autoSlug;
  const parsedPrice = parseMoney(price);

  // Prévia do que o site fará com estes valores (a regra é a do site).
  const missing = missingForSale({
    ...(product ?? ({ images: [] } as unknown as Product)),
    priceCents: parsedPrice.ok ? parsedPrice.cents : null,
    inventoryQuantity: Number(inventory) || 0,
    availableQuantity: Number(available) || 0,
    publicationStatus: status,
    purchaseEnabled,
  });

  return (
    <form action={action}>
      <Section
        title="Identificação"
        description="Como o produto aparece na vitrine e na busca."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marca" htmlFor="brand">
            <input
              id="brand"
              name="brand"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Nome" htmlFor="name">
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Variante ou subtítulo"
            htmlFor="subtitle"
            hint="Ex.: Refil, 350 ml, Cor 02."
          >
            <input
              id="subtitle"
              name="subtitle"
              defaultValue={product?.subtitle}
              className={inputClass}
            />
          </Field>
          <Field label="Categoria" htmlFor="category">
            <select
              id="category"
              name="category"
              defaultValue={product?.category ?? "skincare"}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Endereço da página"
            htmlFor="slug"
            hint={`zivora…/produtos/${currentSlug || "…"}`}
          >
            <input
              id="slug"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              value={currentSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value) || e.target.value);
              }}
              className={`${inputClass} font-mono text-sm`}
            />
          </Field>
          <Field label="SKU" htmlFor="sku" hint="Código interno do estoque.">
            <input
              id="sku"
              name="sku"
              required
              defaultValue={product?.sku}
              className={`${inputClass} font-mono text-sm`}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Preço e estoque"
        description="Preço vazio aparece como “Preço em definição”. Disponível é o que pode ir para a sacola."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Preço (R$)" htmlFor="price">
            <input
              id="price"
              name="price"
              inputMode="decimal"
              placeholder="249,90"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              aria-invalid={!parsedPrice.ok}
              className={`${inputClass} tabular-nums ${
                parsedPrice.ok ? "" : "border-negative"
              }`}
            />
          </Field>
          <Field label="Estoque físico" htmlFor="inventoryQuantity">
            <input
              id="inventoryQuantity"
              name="inventoryQuantity"
              type="number"
              min={0}
              required
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </Field>
          <Field label="Disponível para venda" htmlFor="availableQuantity">
            <input
              id="availableQuantity"
              name="availableQuantity"
              type="number"
              min={0}
              max={Number(inventory) || 0}
              required
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              className={`${inputClass} tabular-nums`}
            />
          </Field>
        </div>
        <Field
          label="Observação junto do preço"
          htmlFor="note"
          hint="Ex.: Última unidade. Aparece na página do produto."
        >
          <input
            id="note"
            name="note"
            defaultValue={product?.note}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section
        title="Fotos"
        description="Use fotos do próprio produto. A primeira aparece na vitrine."
      >
        <ImageManager
          initial={product?.images ?? []}
          slug={currentSlug}
          defaultAlt={[brand, name].filter(Boolean).join(" ")}
        />
      </Section>

      <Section
        title="Conteúdo da página"
        description="Só o que está na embalagem. Campo vazio não aparece no site."
      >
        <Field label="Descrição" htmlFor="description">
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={product?.description}
            className={textareaClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Volume ou peso" htmlFor="volume" hint="Ex.: 180 ml.">
            <input
              id="volume"
              name="volume"
              defaultValue={product?.volume}
              className={inputClass}
            />
          </Field>
          <Field label="Indicação" htmlFor="indication" hint="Para quem é.">
            <input
              id="indication"
              name="indication"
              defaultValue={product?.indication}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Benefícios" htmlFor="benefits" hint="Um por linha.">
          <textarea
            id="benefits"
            name="benefits"
            rows={4}
            defaultValue={product?.benefits?.join("\n")}
            className={textareaClass}
          />
        </Field>
        <Field
          label="Como usar"
          htmlFor="usageInstructions"
          hint="Separe os parágrafos com uma linha em branco."
        >
          <textarea
            id="usageInstructions"
            name="usageInstructions"
            rows={4}
            defaultValue={product?.usageInstructions}
            className={textareaClass}
          />
        </Field>
        <Field label="Diferencial" htmlFor="highlight">
          <textarea
            id="highlight"
            name="highlight"
            rows={2}
            defaultValue={product?.highlight}
            className={textareaClass}
          />
        </Field>
        <Field label="Precauções" htmlFor="precautions" hint="Uma por linha.">
          <textarea
            id="precautions"
            name="precautions"
            rows={3}
            defaultValue={product?.precautions?.join("\n")}
            className={textareaClass}
          />
        </Field>
        <Field label="Ingredientes" htmlFor="ingredients" hint="Um por linha.">
          <textarea
            id="ingredients"
            name="ingredients"
            rows={3}
            defaultValue={product?.ingredients?.join("\n")}
            className={textareaClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="País de origem" htmlFor="countryOfOrigin">
            <input
              id="countryOfOrigin"
              name="countryOfOrigin"
              defaultValue={product?.countryOfOrigin}
              className={inputClass}
            />
          </Field>
          <Field
            label="Validade"
            htmlFor="expirationDate"
            hint="Como está na embalagem."
          >
            <input
              id="expirationDate"
              name="expirationDate"
              defaultValue={product?.expirationDate}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Publicação e venda"
        description="Liberar a venda coloca o botão de sacola, se tudo estiver completo."
      >
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">No site</legend>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${
                status === option.value ? "border-ink" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="publicationStatus"
                value={option.value}
                checked={status === option.value}
                onChange={() => setStatus(option.value)}
                className="accent-brand mt-1"
              />
              <span>
                <span className="block text-sm font-medium">
                  {option.label}
                </span>
                <span className="text-ink-muted block text-[0.8125rem]">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="grid gap-3 pt-2">
          <Check
            name="purchaseEnabled"
            label="Liberar venda"
            description="Mostra o botão de adicionar à sacola."
            checked={purchaseEnabled}
            onChange={setPurchaseEnabled}
          />
          <Check
            name="contentVerified"
            label="Conteúdo conferido com a embalagem"
            defaultChecked={product?.contentVerified}
          />
          <Check
            name="featured"
            label="Destaque na vitrine"
            defaultChecked={product?.featured}
          />
          <Check
            name="lowStockBadge"
            label="Aviso de últimas unidades na foto"
            description="Mostra “Última unidade” (ou “Últimas unidades”, se tiver mais de uma) sobre a foto, onde o produto aparecer. Some sozinho se o produto esgotar."
            defaultChecked={product?.lowStockBadge}
          />
        </div>
        <div className="bg-surface rounded-lg px-4 py-3 text-sm">
          {missing.length === 0 ? (
            <span className="flex items-center gap-2">
              <Pill tone="positive">À venda</Pill> Vai aparecer com o botão de
              sacola.
            </span>
          ) : (
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1">Para entrar na sacola falta:</span>
              {missing.map((m) => (
                <Pill key={m} tone="neutral">
                  {m}
                </Pill>
              ))}
            </span>
          )}
        </div>
      </Section>

      <SaveBar
        state={state}
        pending={pending}
        label={product ? "Salvar alterações" : "Criar produto"}
      />

      {product && (
        <DeleteZone
          what="este produto"
          consequence="Some do site e do backoffice. Produtos que estão em kit não podem ser apagados."
          action={deleteProduct.bind(null, product.id)}
        />
      )}
    </form>
  );
}
