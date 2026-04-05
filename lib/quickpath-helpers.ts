export function t(obj: Record<string, any>, baseKey: string, lang: string): string {
  return obj[`${baseKey}_${lang}`] || obj[`${baseKey}_en`] || ""
}

// Keep the old name for backwards compatibility
export const resolveField = t

export function getQuickPathLang(): string {
  if (typeof window === "undefined") return "en"
  return localStorage.getItem("qp_lang") || "en"
}
