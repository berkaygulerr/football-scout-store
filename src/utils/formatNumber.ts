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
export function formatAgeByTurkishDate(birthTimestamp: number): number {
  const timeZone = "Europe/Istanbul";

  const birthDate = new Date(birthTimestamp * 1000);
  const birth = new Intl.DateTimeFormat("tr-TR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(birthDate);

  const now = new Date();
  const today = new Intl.DateTimeFormat("tr-TR", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const birthYear = Number(birth.find(p => p.type === "year")?.value);
  const birthMonth = Number(birth.find(p => p.type === "month")?.value);
  const birthDay = Number(birth.find(p => p.type === "day")?.value);

  const todayYear = Number(today.find(p => p.type === "year")?.value);
  const todayMonth = Number(today.find(p => p.type === "month")?.value);
  const todayDay = Number(today.find(p => p.type === "day")?.value);

  let age = todayYear - birthYear;

  if (
    todayMonth < birthMonth ||
    (todayMonth === birthMonth && todayDay < birthDay)
  ) {
    age--;
  }

  return age;
}
