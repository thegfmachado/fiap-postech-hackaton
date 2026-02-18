import type { Priority } from "@mindease/models";

export type PriorityStyle = {
  label: string;
  bg: string;
  text: string;
  border: string;
};

const lightPriorityConfig: Record<Priority, PriorityStyle> = {
  low: { label: "Baixa", bg: "#D8FAF0", text: "#0A344E", border: "#B3F5E7" },
  medium: { label: "Média", bg: "#FEF4D0", text: "#D48211", border: "#FAC050" },
  high: { label: "Alta", bg: "#FFE7D7", text: "#DB5141", border: "#FFA282" },
};

const darkPriorityConfig: Record<Priority, PriorityStyle> = {
  low: { label: "Baixa", bg: "#0D3B2F", text: "#6EE7B7", border: "#1A5C49" },
  medium: { label: "Média", bg: "#3B2F0D", text: "#FAC050", border: "#5C4A1A" },
  high: { label: "Alta", bg: "#3B1A14", text: "#FFA282", border: "#5C2E22" },
};

export function getPriorityConfig(isDark: boolean): Record<Priority, PriorityStyle> {
  return isDark ? darkPriorityConfig : lightPriorityConfig;
}
