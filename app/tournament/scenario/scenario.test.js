import { normaliseScore } from "./scenario";

describe("normalise score", () => {
  test("if sum is less than 7, players score their totals", () => {
    expect(normaliseScore(1, 1)).toBe(1);
    expect(normaliseScore(2, 1)).toBe(2);
    expect(normaliseScore(6, 1)).toBe(6);
  });

  test("if sum is greater than 7, scores are normalised", () => {
    expect(normaliseScore(4, 4)).toBe(3);
    expect(normaliseScore(7, 0)).toBe(7);
    expect(normaliseScore(7, 1)).toBe(6);
    expect(normaliseScore(5, 4)).toBe(4);
    expect(normaliseScore(3, 10)).toBe(1);
    expect(normaliseScore(3, 6)).toBe(2);
    expect(normaliseScore(4, 6)).toBe(3);
    expect(normaliseScore(8, 0)).toBe(7);
    expect(normaliseScore(0, 9)).toBe(0);
  });
});
