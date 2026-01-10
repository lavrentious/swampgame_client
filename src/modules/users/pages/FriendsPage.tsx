import { useState } from "react";
import { FaPeopleArrows, FaUser } from "react-icons/fa";
import IconButton from "src/modules/common/components/IconButton";
import MainLayout from "src/modules/common/components/MainLayout";
import FriendsTab from "../components/FriendsTab";
import FriendshipsTab from "../components/FriendshipsTab";

const FriendsPage = () => {
  const [showFriendshipsTab, setShowFriendshipsTab] = useState(false);

  return (
    <MainLayout
      title={showFriendshipsTab ? "Friend Requests" : "Friends"}
      showBackButton
      showUserPfp
      rightSlot={
        <IconButton
          icon={showFriendshipsTab ? <FaUser /> : <FaPeopleArrows />}
          onClick={() => setShowFriendshipsTab((p) => !p)}
        />
      }
    >
      {showFriendshipsTab ? <FriendshipsTab /> : <FriendsTab />}
    </MainLayout>
  );
};

export default FriendsPage;
