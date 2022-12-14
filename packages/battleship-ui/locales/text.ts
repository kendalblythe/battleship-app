import defaultLocaleMessages from "./en.json";

export const getLocalizedText = (key: string): string => {
  const value = (defaultLocaleMessages as Record<string, string>)[key];
  return value || key;
};
