import clsx from "clsx";
import SuitIcon from "./SuitIcon";
import { CardStyle, CardSuit, Card as CardType } from "./types";
import ValueIcon from "./ValueIcon";

function suitColor(suit?: CardSuit | null, deckColors?: 2 | 4): string {
  switch (suit) {
    case CardSuit.CLUBS:
      return deckColors === 4 ? "#17b717" : "black";
    case CardSuit.DIAMONDS:
      return deckColors === 4 ? "#4747ea" : "red";
    case CardSuit.HEARTS:
      return "red";
    case CardSuit.SPADES:
      return "black";
    default:
      return "gray";
  }
}

export interface PlayingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: CardType | null;
  size?: "xs" | "sm" | "lg";
  clickable?: boolean;
  cardDisabled?: boolean;
  required?: boolean;
}

const dimensionsMap = {
  xs: { width: "40px", height: "60px", fontSize: "1rem" },
  sm: { width: "60px", height: "90px", fontSize: "1.5rem" },
  lg: { width: "100px", height: "140px", fontSize: "2rem" },
};

const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  size = "sm",
  style,
  className,
  clickable,
  cardDisabled,
  required,
  ...props
}) => {
  const cardStyle: CardStyle = CardStyle.MIRRORED;
  const deckColors: 2 | 4 = 2;
  const color = suitColor(card?.suit, deckColors);

  const dimensions = dimensionsMap[size];

  return (
    <div
      style={{
        ...dimensions,
        ...style,
        color: color,
      }}
      className={clsx(
        "flex flex-col p-1 bg-background-playing-card rounded border border-primary items-center",
        className,
        {
          clickable: !cardDisabled && clickable,
          disabled: cardDisabled,
          required: required ?? true,
          "justify-center": !card,
          "justify-between": !!card,
        },
      )}
      {...props}
    >
      {cardStyle === CardStyle.MIRRORED && (
        <>
          {card && (
            <ValueIcon
              value={card.value}
              underlineAmbigous
              textAlign="left"
              className="self-start"
              style={{ fontSize: dimensions.fontSize }}
            />
          )}

          <SuitIcon suit={card?.suit} />

          {card && (
            <ValueIcon
              value={card.value}
              underlineAmbigous
              textAlign="left"
              flipped
              className="self-end"
              style={{ fontSize: dimensions.fontSize }}
            />
          )}
        </>
      )}

      {/* @ts-expect-error FIXME */}
      {cardStyle === CardStyle.SIMPLE && (
        <>
          {card && (
            <ValueIcon
              value={card.value}
              style={{ fontSize: dimensions.fontSize }}
            />
          )}
          <span style={{ fontSize: dimensions.fontSize }}>
            <SuitIcon suit={card?.suit} />
          </span>
        </>
      )}
    </div>
  );
};

export default PlayingCard;
