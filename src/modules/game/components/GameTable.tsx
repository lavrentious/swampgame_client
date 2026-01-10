import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { PiArrowsClockwiseThin } from "react-icons/pi";
import { Player } from "src/modules/lobbies/api/types";
import { polarToCartesian } from "../utils/table";
import PlayerSeat from "./PlayerSeat";

const GameTable: React.FC<
  {
    players: Player[];
    iconRotation?: number;
  } & React.HTMLAttributes<HTMLDivElement>
> = ({ players, iconRotation = 0, className, ...props }) => {
  const radius = Math.min(42, 50 - players.length * 0.5);
  const center = 50;
  const totalSpots = players.length + 1;

  const gapAngle = 180;

  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSize, setTableSize] = useState(0);

  useEffect(() => {
    if (!tableRef.current) return;

    const resize = () => {
      setTableSize(tableRef.current!.offsetWidth);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      ref={tableRef}
      className={clsx(
        "relative mx-auto w-[80vw] max-w-md aspect-square",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full bg-white/5" />

      <PiArrowsClockwiseThin
        className="absolute top-1/2 left-1/2 text-white/25 text-6xl transition-transform duration-300"
        style={{
          transform: `
            translate(-50%, -50%)
            rotate(${iconRotation}deg)
          `,
        }}
      />

      {players.map((player, index) => {
        const slotIndex = (index + 1) % totalSpots;
        const angle = (360 / totalSpots) * slotIndex;
        const rotatedAngle = (angle + gapAngle) % 360;

        const { x, y } = polarToCartesian(center, center, radius, rotatedAngle);

        const scale = Math.max(0.7, Math.min(1.3, 9 / players.length));

        const seatPx = {
          x: (x / 125) * tableSize,
          y: (y / 125) * tableSize,
        };

        const centerPx = {
          x: (center / 125) * tableSize,
          y: (center / 125) * tableSize,
        };

        const foldVector =
          player.foldOrderNumber != null
            ? {
                x: centerPx.x - seatPx.x,
                y: centerPx.y - seatPx.y,
              }
            : undefined;

        const foldRotation =
          player.foldOrderNumber != null && foldVector
            ? Math.atan2(foldVector.y, foldVector.x) * (180 / Math.PI) + 90
            : 0;

        return (
          <div
            key={player.userId}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <PlayerSeat
              player={player}
              foldVector={foldVector}
              foldRotation={foldRotation}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameTable;
