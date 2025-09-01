export function formatDate(input?: string | Date, locale: string = 'tr-TR'): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(date);
}

export function formatShortDate(input?: string | Date): string {
  if (!input) return '';
  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return '';
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Bugün
  if (inputDate.getTime() === today.getTime()) {
    return 'Bugün';
  }
  
  // Dün
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (inputDate.getTime() === yesterday.getTime()) {
    return 'Dün';
  }
  
  // Son 7 gün içinde
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6);
  if (inputDate >= oneWeekAgo) {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[date.getDay()];
  }
  
  // Bu yıl içinde
  if (date.getFullYear() === now.getFullYear()) {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
  
  // Önceki yıllar
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().slice(2)}`;
}