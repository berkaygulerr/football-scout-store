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
  const todayUTC = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));

  const birth = new Date(birthTimestamp * 1000);
  const birthUTC = new Date(Date.UTC(
    birth.getUTCFullYear(),
    birth.getUTCMonth(),
    birth.getUTCDate()
  ));

  let age = todayUTC.getUTCFullYear() - birthUTC.getUTCFullYear();

  if (
    todayUTC.getUTCMonth() < birthUTC.getUTCMonth() ||
    (todayUTC.getUTCMonth() === birthUTC.getUTCMonth() &&
     todayUTC.getUTCDate() < birthUTC.getUTCDate())
  ) {
    age--;
  }

  return age;
}


