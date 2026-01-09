import { useState } from "react";
import Header from "src/modules/common/components/Header";
import PageLayout from "src/ui/components/PageLayout";
import { SideDrawer } from "src/ui/components/SideDrawer";
import { SideNav } from "./SideNav";

type Props = {
  title: string;
  header?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;

  backPath?: string;
  showBackButton?: boolean;

  showMenu?: boolean;
  showUserPfp?: boolean;

  children: React.ReactNode;
  footer?: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({
  title,
  header,
  leftSlot,
  rightSlot,
  backPath,
  children,
  footer,
  showBackButton = false,
  showMenu = false,
  showUserPfp = true,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageLayout>
        <PageLayout.Header>
          <Header
            title={title}
            backPath={backPath}
            showBackButton={showBackButton}
            showMenuButton={showMenu}
            showUserPfp={showUserPfp}
            onMenuClick={showMenu ? () => setDrawerOpen(true) : undefined}
            leftSlot={leftSlot}
            rightSlot={rightSlot}
          />
          {header}
        </PageLayout.Header>

        <PageLayout.Body>{children}</PageLayout.Body>

        {footer && <PageLayout.Footer>{footer}</PageLayout.Footer>}
      </PageLayout>

      {showMenu && (
        <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <SideNav onNavigate={() => setDrawerOpen(false)} />
        </SideDrawer>
      )}
    </>
  );
};

export default MainLayout;
