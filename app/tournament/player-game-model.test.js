import { getRoutedBonus } from "./player-game-model";

describe("getRoutedBonus", () => {
  test("returns correct routed bonus based on 2300pts", () => {
    expect(getRoutedBonus(2300)).toBe(3);
    expect(getRoutedBonus(1695)).toBe(3);
    expect(getRoutedBonus(1690)).toBe(2);
    expect(getRoutedBonus(1110)).toBe(2);
    expect(getRoutedBonus(1105)).toBe(1);
    expect(getRoutedBonus(500)).toBe(1);
    expect(getRoutedBonus(495)).toBe(0);
    expect(getRoutedBonus(0)).toBe(0);
  });

  test("returns correct routed bonus based on 1000pts", () => {
    const bands = [
      [850, 3],
      [550, 2],
      [250, 1],
    ];

    expect(getRoutedBonus(1000, bands)).toBe(3);
    expect(getRoutedBonus(850, bands)).toBe(3);
    expect(getRoutedBonus(845, bands)).toBe(2);
    expect(getRoutedBonus(550, bands)).toBe(2);
    expect(getRoutedBonus(545, bands)).toBe(1);
    expect(getRoutedBonus(250, bands)).toBe(1);
    expect(getRoutedBonus(245, bands)).toBe(0);
    expect(getRoutedBonus(0, bands)).toBe(0);
  });
});
