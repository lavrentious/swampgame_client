import { useLaunchParams } from "@telegram-apps/sdk-react";
import clsx from "clsx";
import React from "react";

type UserPfpProps = {
  size?: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const UserPfp: React.FC<UserPfpProps> = ({
  size = 40,
  className,
  ...props
}) => {
  const { tgWebAppData: data } = useLaunchParams();
  const photoUrl = data?.user?.photo_url;
  // const photoUrl = "https://dota2.ru/img/items/aether_lens.jpg";

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
        {data?.user?.first_name?.[0] || "?"}?
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={data?.user?.first_name || "User"}
      // alt="User"
      className={clsx("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
};

export default UserPfp;
