import React, { useMemo, useRef, useState } from "react";
import { LEADERBOARD_TAB_ITEMS } from "@/constants/components";
import { useRouter } from "next/navigation";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { Grid } from "@mui/material";

import Content from "../Reusables/Content";
import useAllNames from "@/hooks/useAllNames";
import Top50 from "./Top50/Top50";
import Ranking from "./Ranking/Ranking";

export interface HolderProps {
  children?: React.ReactNode;
  tab: number;
  isMounted?: boolean;
}

export const Holders: React.FC<HolderProps> = (props: HolderProps) => {
  const { tab: pageTab } = props;

  const refElement = useRef<HTMLDivElement | null>(null);

  // prefetch here
  const {} = useAllNames();
  const { useLeaderboard } = useLeaderboardState();
  const {
    top = { ranking: [] },
    singleEmoji = { ranking: [] },
    singleCharacter = { ranking: [] },
    oneKClub = { ranking: [] },
    tenKClub = { ranking: [] },
    totalCountNames: totalNames,
    isFetched,
  } = useLeaderboard();

  const router = useRouter();
  const [tab, setTab] = useState<number>(pageTab);

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

  const content = useMemo(() => {
    switch (tab) {
      case 0:
        return <Top50 leaderboard={top} totalNames={totalNames} />;
      case 1:
        return <Ranking leaderboard={singleEmoji} />;
      case 2:
        return <Ranking leaderboard={singleCharacter} />;
      case 3:
        return <Ranking leaderboard={oneKClub} />;
      case 4:
        return <Ranking leaderboard={tenKClub} />;
      default:
        return <Top50 leaderboard={top} totalNames={totalNames} />;
    }
  }, [tab, top.isFetched, isFetched]);

  return (
    <Grid ref={refElement}>
      <Content
        title=""
        isSubTabs={true}
        tabs={LEADERBOARD_TAB_ITEMS}
        content={content}
        activeTab={tab || 0}
        onTabChange={setPathNameFromTab}
        // TODO: Implement this
        toolbar={<></>}
        orientation={
          (refElement.current?.clientWidth || 0) < 500
            ? "horizontal"
            : "vertical"
        }
      />
    </Grid>
  );
};

export default Holders;
