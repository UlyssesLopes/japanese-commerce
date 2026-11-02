/**
 * Vocabulário do "Descubra sua rotina". As etiquetas são marcadas pelo dono
 * no backoffice a partir do rótulo e do texto de indicação de cada produto:
 * o site nunca deduz para quem um produto serve.
 */

export type RoutineArea = "cabelo" | "pele";

export type Concern = {
  value: string;
  area: RoutineArea;
  /** Nome curto, para o backoffice e o resultado. */
  label: string;
};

export const concerns = [
  {
    value: "cabelo-ressecado",
    area: "cabelo",
    label: "Cabelo ressecado ou com frizz",
  },
  { value: "cabelo-danificado", area: "cabelo", label: "Cabelo danificado" },
  {
    value: "cabelo-sem-volume",
    area: "cabelo",
    label: "Cabelo fino, sem volume",
  },
  {
    value: "cabelo-sem-brilho",
    area: "cabelo",
    label: "Cabelo opaco, sem brilho",
  },
  { value: "pele-seca", area: "pele", label: "Pele seca" },
  { value: "pele-oleosa", area: "pele", label: "Pele oleosa ou mista" },
  { value: "pele-sensivel", area: "pele", label: "Pele sensível" },
  { value: "manchas", area: "pele", label: "Manchas ou tom irregular" },
  { value: "poros", area: "pele", label: "Poros e cravos" },
  { value: "vico", area: "pele", label: "Pele opaca, sem viço" },
  { value: "linhas-finas", area: "pele", label: "Linhas finas" },
] as const satisfies readonly Concern[];

export type ConcernValue = (typeof concerns)[number]["value"];

export function isConcern(value: string): value is ConcernValue {
  return concerns.some((c) => c.value === value);
}

const optionValues = (id: Question["id"]) =>
  new Set(questions.find((q) => q.id === id)!.options.map((o) => o.value));

/** Etiquetas agrupadas como no backoffice (mesmos grupos das perguntas). */
export function concernGroups(): { label: string; items: Concern[] }[] {
  return [
    { label: "Cabelo", id: "cabelo" as const },
    { label: "Tipo de pele", id: "pele" as const },
    { label: "Incômodo da pele", id: "foco" as const },
  ].map(({ label, id }) => {
    const values = optionValues(id);
    return { label, items: concerns.filter((c) => values.has(c.value)) };
  });
}

/** Passos na ordem de uso. O nome muda conforme a área. */
export const routineSteps = [
  {
    value: "limpeza",
    labels: { cabelo: "Lavar", pele: "Limpar" },
    admin: "Limpeza (shampoo, demaquilante)",
  },
  // Loção (tônico) da rotina japonesa: depois da limpeza, antes do sérum.
  {
    value: "preparo",
    labels: { cabelo: "Preparar", pele: "Preparar" },
    admin: "Preparo (loção, tônico)",
  },
  {
    value: "tratamento",
    labels: { cabelo: "Tratar", pele: "Tratar" },
    admin: "Tratamento (sérum, condicionador, máscara)",
  },
  {
    value: "hidratacao",
    labels: { cabelo: "Hidratar", pele: "Hidratar" },
    admin: "Hidratação (emulsão, creme)",
  },
  {
    value: "finalizacao",
    labels: { cabelo: "Finalizar", pele: "Finalizar" },
    admin: "Finalização (óleo, leave-in)",
  },
] as const;

export type RoutineStep = (typeof routineSteps)[number]["value"];

export function isRoutineStep(value: string | undefined): value is RoutineStep {
  return routineSteps.some((s) => s.value === value);
}

export type QuestionOption = { value: string; label: string };

export type Question = {
  id: "para" | "pele" | "foco" | "cabelo";
  /** Área a que a pergunta pertence (a primeira pergunta não tem). */
  area?: RoutineArea;
  title: string;
  options: QuestionOption[];
};

/** Opção de "foco" que não filtra nada: rotina básica para o tipo de pele. */
export const NO_FOCUS = "cuidar";

/**
 * Todas as perguntas e opções possíveis. O que aparece de fato depende do
 * estoque: ver `availableQuestions`.
 */
export const questions: Question[] = [
  {
    id: "para",
    title: "Para que você está procurando?",
    options: [
      { value: "pele", label: "Pele" },
      { value: "cabelo", label: "Cabelo" },
      { value: "os-dois", label: "Os dois" },
    ],
  },
  {
    id: "pele",
    area: "pele",
    title: "Como sua pele costuma ficar?",
    options: [
      { value: "pele-seca", label: "Seca, repuxando" },
      { value: "pele-oleosa", label: "Oleosa ou mista, com brilho" },
      { value: "pele-sensivel", label: "Sensível, irrita fácil" },
    ],
  },
  {
    id: "foco",
    area: "pele",
    title: "O que mais te incomoda?",
    options: [
      { value: "manchas", label: "Manchas ou tom irregular" },
      { value: "poros", label: "Poros e cravos" },
      { value: "vico", label: "Pele opaca, sem viço" },
      { value: "linhas-finas", label: "Linhas finas" },
      { value: NO_FOCUS, label: "Nada em especial, só quero cuidar" },
    ],
  },
  {
    id: "cabelo",
    area: "cabelo",
    title: "Como está seu cabelo?",
    options: [
      { value: "cabelo-ressecado", label: "Ressecado ou com frizz" },
      { value: "cabelo-danificado", label: "Danificado" },
      { value: "cabelo-sem-volume", label: "Fino, sem volume" },
      { value: "cabelo-sem-brilho", label: "Opaco, sem brilho" },
    ],
  },
];
