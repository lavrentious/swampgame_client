import clsx from "clsx";
import React from "react";
import { FiImage } from "react-icons/fi";
import { Button } from "src/ui/components/Button";

type ShopCardProps = {
  title: string;
  price: number | string;
  imageSrc?: string;
  onBuy?: () => void;
  className?: string;
};

export const ShopCard: React.FC<ShopCardProps> = ({
  title,
  price,
  imageSrc,
  onBuy,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-surface-alt rounded-2xl p-4 flex flex-col justify-between",
        "min-h-70",
        className,
      )}
    >
      <div>
        {/* Image / placeholder */}
        <div
          className="
            h-32 mb-4 rounded-xl
            bg-black/20
            flex items-center justify-center
            overflow-hidden
          "
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <FiImage className="text-white/40 text-4xl" />
          )}
        </div>

        <div className="h-0.5 w-full bg-white/90 mb-4 rounded" />

        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-xl font-bold text-white">{price} $</span>

        <Button size="sm" rounded variant="secondary" onClick={onBuy}>
          Buy
        </Button>
      </div>
    </div>
  );
};
