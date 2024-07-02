import React, { useState } from "react";
import { LEADERBOARD_TAB_ITEMS } from "@/constants/components";
import { usePathname, useRouter } from "next/navigation";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";

import Content from "../Reusables/Content";
import useAllNames from "@/hooks/useAllNames";
import Top50 from "./Top50/Top50";
import Ranking from "./Ranking/Ranking";

export interface HolderProps {
  children?: React.ReactNode;
}

export const Holders: React.FC<HolderProps> = (props: HolderProps) => {
  const { children } = props;

  // prefetch here
  const { isFetching } = useAllNames();
  const { useLeaderboard } = useLeaderboardState();
  const {
    top = [],
    singleEmoji = [],
    singleCharacter = [],
    oneKClub = [],
    tenKClub = [],
    isFetched,
    totalNames,
  } = useLeaderboard();

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

  const [tab, setTab] = useState<number>(getSelectedTab());

  const setPathNameFromTab = (tab: number) => {
    setTab(tab);

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

  const getContent = () => {
    switch (tab) {
      case 0:
        return (
          <Top50 ranking={top} isFetched={isFetched} totalNames={totalNames} />
        );
      case 1:
        return <Ranking ranking={singleEmoji} isFetched={isFetched} />;
      case 2:
        return <Ranking ranking={singleCharacter} isFetched={isFetched} />;
      case 3:
        return <Ranking ranking={oneKClub} isFetched={isFetched} />;
      case 4:
        return <Ranking ranking={tenKClub} isFetched={isFetched} />;
      default:
        return (
          <Top50 ranking={top} isFetched={isFetched} totalNames={totalNames} />
        );
    }
  };

  // TODO: Add skeleton loading here
  return (
    <Content
      title="Holders"
      isVisible={true}
      tabs={LEADERBOARD_TAB_ITEMS}
      content={getContent()}
      activeTab={tab}
      onTabChange={setPathNameFromTab}
    />
  );
};

export default Holders;
