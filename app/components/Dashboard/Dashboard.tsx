"use client";

import React, { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { debounce as _debounce } from "lodash";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import Content from "../Reusables/Content";
import Toolbar from "../Reusables/Toolbar";
import Names from "./Tab/Names";
import FrequentlyAsked from "./Tab/Faq/Faq";
import Holders from "../Leaderboard/Holders";

export interface DashboardProps {
  children?: React.ReactNode;
  hasMounted?: boolean;
  tab: number;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { children, tab: pageTab, hasMounted } = props;

  const { status } = useAccount();

  const router = useRouter();
  const pathName = usePathname();

  const getSelectedTab = () => {
    switch (pathName) {
      case "/identities":
        return 0;
      case "/leaderboard/top-50":
        return 1;
      case "/faq":
        return 2;
      default:
        return 0;
    }
  };

  const isDashboardVisible = status === "connected" || false;
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
        return <Holders tab={0} />;
      case 2:
        return <FrequentlyAsked />;
      default:
        return <Names hasMounted={hasMounted} />;
    }
  }, [tab, hasMounted]);

  return (
    <Content
      title={getTabTitle()}
      // isVisible={tab === 0 ? isDashboardVisible : true}
      isVisible={true}
      tabs={DASHBOARD_TAB_ITEMS}
      content={content}
      activeTab={tab || 0}
      onTabChange={setPathNameFromTab}
      toolbar={<Toolbar />}
    />
  );
};

export default Dashboard;
