import { CardSuit, CardValue, CardValueCharacter, CardValueInt } from "./types";

export const SORTED_VALUES = [
  CardValue.TWO,
  CardValue.THREE,
  CardValue.FOUR,
  CardValue.FIVE,
  CardValue.SIX,
  CardValue.SEVEN,
  CardValue.EIGHT,
  CardValue.NINE,
  CardValue.TEN,
  CardValue.JACK,
  CardValue.QUEEN,
  CardValue.KING,
  CardValue.ACE,
];
export const REVERSED_VALUES = [...SORTED_VALUES].reverse();

export const SORTED_SUITS = [
  CardSuit.HEARTS,
  CardSuit.SPADES,
  CardSuit.DIAMONDS,
  CardSuit.CLUBS,
];

export function cardValueToInt(value: CardValue): CardValueInt {
  switch (value) {
    case CardValue.ACE:
      return 14;
    case CardValue.KING:
      return 13;
    case CardValue.QUEEN:
      return 12;
    case CardValue.JACK:
      return 11;
    case CardValue.TEN:
      return 10;
    case CardValue.NINE:
      return 9;
    case CardValue.EIGHT:
      return 8;
    case CardValue.SEVEN:
      return 7;
    case CardValue.SIX:
      return 6;
    case CardValue.FIVE:
      return 5;
    case CardValue.FOUR:
      return 4;
    case CardValue.THREE:
      return 3;
    case CardValue.TWO:
      return 2;
  }
}

export function intToCardValue(value: CardValueInt): CardValue {
  switch (value) {
    case 14:
      return CardValue.ACE;
    case 13:
      return CardValue.KING;
    case 12:
      return CardValue.QUEEN;
    case 11:
      return CardValue.JACK;
    case 10:
      return CardValue.TEN;
    case 9:
      return CardValue.NINE;
    case 8:
      return CardValue.EIGHT;
    case 7:
      return CardValue.SEVEN;
    case 6:
      return CardValue.SIX;
    case 5:
      return CardValue.FIVE;
    case 4:
      return CardValue.FOUR;
    case 3:
      return CardValue.THREE;
    case 2:
      return CardValue.TWO;
  }
}

export function valueToCharacter(
  value: CardValue,
  tenAsT: boolean = false,
): CardValueCharacter {
  switch (value) {
    case CardValue.ACE:
      return "A";
    case CardValue.KING:
      return "K";
    case CardValue.QUEEN:
      return "Q";
    case CardValue.JACK:
      return "J";
    case CardValue.TEN:
      return tenAsT ? "T" : "10";
    case CardValue.NINE:
      return "9";
    case CardValue.EIGHT:
      return "8";
    case CardValue.SEVEN:
      return "7";
    case CardValue.SIX:
      return "6";
    case CardValue.FIVE:
      return "5";
    case CardValue.FOUR:
      return "4";
    case CardValue.THREE:
      return "3";
    case CardValue.TWO:
      return "2";
  }
}
