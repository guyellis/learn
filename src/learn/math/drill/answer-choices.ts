import type { DrillTask } from './types.js';

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

export function generateAnswerChoices(task: DrillTask): number[] {
  const [left, right, opIndex, expected] = task;
  const isNonNegative = expected >= 0;

  const distractors = new Set<number>();

  const isValidDistractor = (val: number): boolean => {
    if (val === expected) {
      return false;
    }
    if (isNonNegative ? val < 0 : val > 0) {
      return false;
    }
    return !distractors.has(val);
  };

  const addIfValid = (val: number) => {
    if (distractors.size < 8 && isValidDistractor(val)) {
      distractors.add(val);
    }
  };

  // 1. Operation-specific slips
  if (opIndex === 1) {
    // Subtraction slip: left + right
    addIfValid(left + right);
  } else if (opIndex === 2) {
    // Multiplication slips: left * (right ± 1) or (left ± 1) * right
    addIfValid(left * (right + 1));
    addIfValid(left * (right - 1));
    addIfValid((left + 1) * right);
    addIfValid((left - 1) * right);
  }

  // 2. Digit transposition of a two-digit expected answer
  const absExpected = Math.abs(expected);
  if (absExpected >= 10 && absExpected <= 99) {
    const tens = Math.floor(absExpected / 10);
    const units = absExpected % 10;
    const sign = expected < 0 ? -1 : 1;
    const transposed = (units * 10 + tens) * sign;
    addIfValid(transposed);
  }

  // 3. Small offsets: ±1, ±2, ±3, ±10
  const smallOffsets = [1, -1, 2, -2, 3, -3, 10, -10];
  for (const offset of smallOffsets) {
    addIfValid(expected + offset);
  }

  // 4. Widen offsets if we still have fewer than 8 distractors
  let delta = 4;
  while (distractors.size < 8) {
    if (isNonNegative) {
      addIfValid(expected + delta);
      addIfValid(expected - delta);
    } else {
      addIfValid(expected - delta);
      addIfValid(expected + delta);
    }
    delta += 1;
  }

  const choices = [expected, ...distractors];
  return shuffle(choices);
}

const answerChoices = {
  generateAnswerChoices,
  shuffle,
};

export default answerChoices;
