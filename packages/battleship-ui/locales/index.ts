import defaultLocaleMessages from "./en.json";

export type Translate = (key: string) => string;

export const useTranslate = (): Translate => (key: string) =>
  getLocalizedText(key);

export const getLocalizedText = (key: string): string => {
  const messages = getMessagesForCurrentLocale();
  const value = messages[key];
  return value || key;
};

export const getMessagesForCurrentLocale = (): Record<string, string> =>
  defaultLocaleMessages; // always return default locale (en) for now
