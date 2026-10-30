import type { ComponentProps } from "react";

/** Largura máxima e margens laterais iguais da página (DESIGN.md §4). */
export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-[1360px] px-4 sm:px-8 lg:px-12 ${className}`}
      {...props}
    />
  );
}
