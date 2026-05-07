import { useState, useCallback, useEffect } from 'react';
import fa from './fa.json';
import en from './en.json';

type Locale = 'fa' | 'en';
const translations: Record<Locale, Record<string, unknown>> = { fa, en };

let globalLocale: Locale = (localStorage.getItem('bo-locale') as Locale) || 'fa';
const listeners = new Set<() => void>();

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(globalLocale);

  useEffect(() => {
    const handler = () => setLocaleState(globalLocale);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const setLocale = useCallback((l: Locale) => {
    globalLocale = l;
    localStorage.setItem('bo-locale', l);
    listeners.forEach((fn) => fn());
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(globalLocale === 'fa' ? 'en' : 'fa');
  }, [setLocale]);

  const t = useCallback((key: string): string => {
    const value = getNestedValue(translations[globalLocale], key);
    if (typeof value === 'string') return value;
    return key;
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const tArray = useCallback((key: string): string[] => {
    const value = getNestedValue(translations[globalLocale], key);
    if (Array.isArray(value)) return value as string[];
    return [];
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return { t, tArray, locale, setLocale, toggleLocale };
}
