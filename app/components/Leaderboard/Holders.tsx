import React from "react";
import { LEADERBOARD_TAB_ITEMS } from "@/constants/components";
import { usePathname, useRouter } from "next/navigation";
import Content from "../Reusables/Content";

export interface HolderProps {
  children?: React.ReactNode;
}

export const Holders: React.FC<HolderProps> = (props: HolderProps) => {
  const { children } = props;

  const router = useRouter();
  const pathName = usePathname();

  const getSelectedTab = () => {
    switch (pathName) {
      case "/leaderboard/top-50":
        return 0;
      case "/leaderboard/single-emoji":
        return 1;
      case "/leaderboard/single-character":
        return 2;
      case "/leaderboard/999-club":
        return 3;
      case "/leaderboard/10k-club":
        return 4;
      default:
        return 0;
    }
  };

  const setPathNameFromTab = (tab: number) => {
    switch (tab) {
      case 0:
        return router.replace("/leaderboard/top-50", { scroll: false });
      case 1:
        return router.replace("/leaderboard/single-emoji", { scroll: false });
      case 2:
        return router.replace("/leaderboard/single-character", {
          scroll: false,
        });
      case 3:
        return router.replace("/leaderboard/999-club", { scroll: false });
      case 4:
        return router.replace("/leaderboard/10k-club", { scroll: false });
      default:
        return router.replace("/", { scroll: false });
    }
  };

  // TODO: Add skeleton loading here
  return (
    <Content
      title="Holders"
      isVisible={true}
      tabs={LEADERBOARD_TAB_ITEMS}
      content={children}
      activeTab={getSelectedTab()}
      onTabChange={setPathNameFromTab}
    />
  );
};

export default Holders;
