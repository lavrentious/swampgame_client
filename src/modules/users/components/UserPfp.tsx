import clsx from "clsx";
import React from "react";

type UserPfpProps = {
  size?: number;
  photoUrl?: string;
  label?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const UserPfp: React.FC<UserPfpProps> = ({
  photoUrl,
  label,
  size = 40,
  className,
  ...props
}) => {
  if (!photoUrl) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold",
          className,
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        {label}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={label}
      // alt="User"
      className={clsx("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
};

export default UserPfp;
