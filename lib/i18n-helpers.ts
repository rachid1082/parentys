export function resolveField(item: Record<string, any>, base: string, lang: string): string {
  return item[`${base}_${lang}`] || item[`${base}_fr`] || item[`${base}_en`] || item[base] || ""
}

export function isRTL(lang: string): boolean {
  return lang === "ar"
}
