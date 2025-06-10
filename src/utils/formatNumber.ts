const BILLION = 1_000_000_000;
const MILLION = 1_000_000;
const THOUSAND = 1_000;

interface FormatOptions {
  decimals?: number;
  suffix?: boolean;
}

/**
 * Sayıyı formatlar (1M, 1B gibi)
 */
export function formatNumber(num: number, options: FormatOptions = {}): string {
  const { decimals = 1, suffix = true } = options;

  const format = (n: number, div: number, unit: string): string => {
    const value = n / div;
    const formatted =
      value % 1 === 0 ? value.toString() : value.toFixed(decimals);

    return suffix ? `${formatted}${unit}` : formatted;
  };

  if (Math.abs(num) >= BILLION) {
    return format(num, BILLION, "B");
  }

  if (Math.abs(num) >= MILLION) {
    return format(num, MILLION, "M");
  }

  if (Math.abs(num) >= THOUSAND) {
    return format(num, THOUSAND, "K");
  }

  return num.toString();
}

/**
 * Para birimini formatlar (€1M gibi)
 */
export function formatCurrency(amount: number, currency: string = "€"): string {
  return `${currency}${formatNumber(amount)}`;
}

/**
 * Yaşı formatlar
 */
export function formatAge(birthTimestamp: number): number {
  const now = new Date();
  const birth = new Date(birthTimestamp * 1000); // Bu da local Date olur

  let age = now.getFullYear() - birth.getFullYear();

  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}