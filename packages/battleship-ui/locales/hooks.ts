import { getLocalizedText } from "./text";

export type Translate = (key: string) => string;

export const useTranslate = (): Translate => (key: string) =>
  getLocalizedText(key);
