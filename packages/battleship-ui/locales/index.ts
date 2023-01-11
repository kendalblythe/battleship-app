import defaultLocaleMessages from './en.json';

export type Translate = (key: string) => string;

/**
 * React hook that returns the getLocalizedText function.
 * @returns The getLocalizedText function
 */
export const useTranslate = (): Translate => (key: string) => getLocalizedText(key);

/**
 * Returns localized text for the message key.
 * @param key Message key
 * @returns Localized text
 */
export const getLocalizedText = (key: string): string => {
  const messages = getMessagesForCurrentLocale();
  const value = messages[key];
  return value || key;
};

// always return default locale (en) for now
export const getMessagesForCurrentLocale = (): Record<string, string> => defaultLocaleMessages;
