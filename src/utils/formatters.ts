import dayjs from 'dayjs';
import type { LocalizedString } from '@/types';

export function localized(
  value: LocalizedString | null | undefined,
  lang: 'fa' | 'en' = 'fa',
): string {
  if (!value) return '';
  return value[lang] || value[lang === 'fa' ? 'en' : 'fa'] || '';
}

export function formatDate(date: string | Date, format: string = 'YYYY/MM/DD'): string {
  return dayjs(date).format(format);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + '...';
}
