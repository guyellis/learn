import { generateAnswerChoices, shuffle } from '../../../../src/learn/math/drill/answer-choices.js';
import helper from '../../../../src/learn/math/drill/helper.js';
import type { DrillTask } from '../../../../src/learn/math/drill/types.js';

describe('answer-choices', () => {
  const verifyInvariants = (task: DrillTask, choices: number[]) => {
    const [, , , expected] = task;
    // Exactly 9 values
    expect(choices).toHaveLength(9);

    // All unique
    const unique = new Set(choices);
    expect(unique.size).toBe(9);

    // Exactly one equals the expected answer
    const matchCount = choices.filter((c) => c === expected).length;
    expect(matchCount).toBe(1);

    // Distractors do not equal expected
    const distractors = choices.filter((c) => c !== expected);
    expect(distractors).toHaveLength(8);
    expect(distractors.includes(expected)).toBe(false);

    // Non-negative / negative invariant
    if (expected >= 0) {
      expect(choices.every((c) => c >= 0)).toBe(true);
    } else {
      expect(choices.every((c) => c <= 0)).toBe(true);
    }
  };

  test('should satisfy invariants for expected answer 0', () => {
    const task: DrillTask = [5, 5, 1, 0]; // 5 - 5 = 0
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
  });

  test('should satisfy invariants for tiny expected answer 1', () => {
    const task: DrillTask = [6, 5, 1, 1]; // 6 - 5 = 1
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
  });

  test('should satisfy invariants for tiny expected answer 2', () => {
    const task: DrillTask = [1, 1, 0, 2]; // 1 + 1 = 2
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
  });

  test('should satisfy invariants and include transposition/slips for a two-digit answer', () => {
    const task: DrillTask = [6, 7, 2, 42]; // 6 x 7 = 42
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
    // Two-digit transposition of 42 is 24, which should be among choices
    expect(choices.includes(24)).toBe(true);
  });

  test('should ignore transposition when it equals the expected answer', () => {
    const task: DrillTask = [11, 1, 2, 11]; // 11 x 1 = 11; transposition is 11
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
  });

  test('should satisfy invariants for a negative expected answer', () => {
    const task: DrillTask = [3, 8, 1, -5]; // 3 - 8 = -5
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
    expect(choices.every((c) => c <= 0)).toBe(true);
  });

  test('should satisfy invariants and transpose digits for a negative two-digit answer', () => {
    const task: DrillTask = [2, 44, 1, -42]; // 2 - 44 = -42
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
    expect(choices.every((c) => c <= 0)).toBe(true);
    expect(choices.includes(-24)).toBe(true);
  });

  test('should include subtraction slip (left + right) when valid', () => {
    const task: DrillTask = [8, 3, 1, 5]; // 8 - 3 = 5; slip: 8 + 3 = 11
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
    expect(choices.includes(11)).toBe(true);
  });

  test('should include multiplication slip candidates', () => {
    const task: DrillTask = [4, 5, 2, 20]; // 4 x 5 = 20; slips: 4*6=24, 4*4=16, 5*5=25, 3*5=15
    const choices = generateAnswerChoices(task);
    verifyInvariants(task, choices);
    const slipCandidates = [24, 16, 25, 15];
    const presentSlips = slipCandidates.filter((slip) => choices.includes(slip));
    expect(presentSlips.length).toBeGreaterThan(0);
  });

  test('should be re-exported by helper', () => {
    expect(helper.generateAnswerChoices).toBe(generateAnswerChoices);
  });

  test('shuffle should return a shuffled array containing the same elements', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort((a, b) => a - b)).toEqual(input);
  });

  test('shuffle should handle single element and empty arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle([42])).toEqual([42]);
  });
});
