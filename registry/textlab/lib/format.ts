/**
 * Number formatting that renders the same on the server and the client.
 * The locale defaults to en-US instead of the runtime default, which can differ between the two.
 */
const cache = new Map<string, Intl.NumberFormat>();

export function numberFormat(locale = "en-US", options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, options);
    cache.set(key, fmt);
  }
  return fmt;
}

export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions) {
  return numberFormat(locale, options).format(value);
}

export const isDigit = (char: string) => char >= "0" && char <= "9";
