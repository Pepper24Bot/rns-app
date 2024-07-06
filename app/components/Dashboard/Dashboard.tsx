"use client";

import React, { useMemo, useState } from "react";
import { debounce as _debounce } from "lodash";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import { useRouter } from "next/navigation";

import Content from "../Reusables/Content";
import Toolbar from "../Reusables/Toolbar";
import Names from "./Tab/Names";
import FrequentlyAsked from "./Tab/Faq/Faq";
import Holders from "./Tab/Leaderboard/Holders";
import SearchBar from "./Tab/Leaderboard/SearchBar";

export interface DashboardProps {
  children?: React.ReactNode;
  hasMounted?: boolean;
  tab: number;
  holderTab?: number;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { tab: pageTab, holderTab, hasMounted } = props;

  const router = useRouter();

  const [tab, setTab] = useState<number>(pageTab);

  const setPathNameFromTab = (tab: number) => {
    setTab(tab);

    switch (tab) {
      case 0:
        return router.replace("/identities", { scroll: false });
      case 1:
        return router.replace("/leaderboard/top-50", { scroll: false });
      case 2:
        return router.replace("/faq", { scroll: false });
      default:
        return router.replace("/", { scroll: false });
    }
  };

  const getTabTitle = () => {
    switch (tab) {
      case 0:
        return "My Dashboard";
      case 1:
        return "Holders";
      case 2:
        return "Frequently Asked Questions";
      default:
        return "";
    }
  };

  const content = useMemo(() => {
    switch (tab) {
      case 0:
        return <Names hasMounted={hasMounted} />;
      case 1:
        return <Holders tab={holderTab || 0} />;
      case 2:
        return <FrequentlyAsked />;
      default:
        return <Names hasMounted={hasMounted} />;
    }
  }, [tab, hasMounted]);

  const toolbar = useMemo(() => {
    switch (tab) {
      case 0:
        return <Toolbar />;
      case 1:
        // TODO: Implement search bar here
        return <SearchBar />;
      case 2:
        return <></>;
      default:
        return <></>;
    }
  }, [tab, hasMounted]);

  return (
    <Content
      title={getTabTitle()}
      tabs={DASHBOARD_TAB_ITEMS}
      content={content}
      activeTab={tab || 0}
      onTabChange={setPathNameFromTab}
      toolbar={toolbar}
    />
  );
};

export default Dashboard;
