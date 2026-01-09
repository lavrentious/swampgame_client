import { Card, CardSuit, CardValue } from "../components/cards/types";

export function parsePlainCard(s: string): Card {
  const [valueString, suitString] = s.split(" of ");
  const value = Object.values(CardValue).find(
    (v) => v === valueString.toUpperCase(),
  ) as CardValue;
  const suit = Object.values(CardSuit).find(
    (s) => s === suitString.toUpperCase(),
  ) as CardSuit;

  return { value, suit };
}
