/**
 * Returns a random integer `n` such that `min <= n < max`.
 * @param [min=0] Start of random range (inclusive).
 * @param max End of random range (exclusive).
 */
export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(arg1: number, arg2?: number): number {
  const min = Math.ceil(arg2 === undefined ? 0 : arg1);
  const max = Math.floor(arg2 == undefined ? arg1 : arg2);
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Returns a random boolean value.
 */
export const randomBoolean = () => randomInt(2) === 0;

/**
 * Returns a shuffled array of values using the Durstenfeld shuffle algorithm.
 * @param array Array of values.
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
