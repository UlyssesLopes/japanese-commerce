import type { Coupon } from "@/types/coupon";
import type { Product, ProductImage } from "@/types/product";

/** Formatos da API do backend (japanese-commerce-backend) no backoffice. */

export type AdminProduct = Product;

export type KitItem = {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  quantity: number;
  priceCents?: number;
  availableQuantity: number;
  image?: ProductImage;
};

export type AdminKit = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images: ProductImage[];
  priceCents?: number;
  /** Quantos kits completos o estoque dos produtos permite. */
  availableQuantity: number;
  /** Soma dos preços avulsos; ausente se algum item está sem preço. */
  itemsTotalCents?: number;
  publicationStatus: Product["publicationStatus"];
  purchaseEnabled: boolean;
  featured: boolean;
  items: KitItem[];
};

export type AdminCoupon = Coupon;

/** Resultado das ações do backoffice para os formulários. */
export type ActionState = { error?: string; saved?: boolean };
