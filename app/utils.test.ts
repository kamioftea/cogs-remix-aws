import { Predicate, validateEmail } from "./utils";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("n@")).toBe(false);
});

test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).toBe(true);
});

describe("Predicate", () => {
  test("can partition an array", () => {
    const predicate = new Predicate<number>((n) => n > 0);

    expect(predicate.partition([0, 1, 2, 3])).toEqual([[1, 2, 3], [0]]);
    expect(predicate.partition([0])).toEqual([[], [0]]);
    expect(predicate.partition([])).toEqual([[], []]);
  });
});
