import { Link } from "react-router";
import Header from "src/modules/common/components/Header";
import UserPfp from "src/modules/common/components/UserPfp";
import List from "src/ui/components/List";
import ListItem from "src/ui/components/ListItem";
import PageLayout from "src/ui/components/PageLayout";

const ProfileProperty: React.FC<{
  title: string;
  value: React.ReactNode | string;
}> = ({ title, value }) => {
  return (
    <ListItem className="flex justify-between">
      <span>{title}</span>
      {typeof value === "string" ? <strong>{value}</strong> : value}
    </ListItem>
  );
};

const ProfilePage = () => {
  return (
    <PageLayout>
      <PageLayout.Header>
        <Header title="My Profile" backPath="/" showUserPfp={false} />
      </PageLayout.Header>

      <PageLayout.Body>
        <div className="mt-10 p-4">
          <UserPfp className="mx-auto mb-10" size={96} />
          <Link
            to="/test"
            className="block text-center text-2xl font-bold mb-5"
          >
            Test
          </Link>
          <List>
            <ProfileProperty title="Username" value="123" />
            <ProfileProperty title="Level" value="15" />
          </List>
        </div>
      </PageLayout.Body>
    </PageLayout>
  );
};

export default ProfilePage;
