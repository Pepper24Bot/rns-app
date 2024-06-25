"use client";

import React from "react";
import { useAccount } from "wagmi";
import { debounce as _debounce } from "lodash";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import Content from "../Reusables/Content";

export interface DashboardProps {
  children?: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { children } = props;

  const { status } = useAccount();

  const router = useRouter();
  const pathName = usePathname();

  const getSelectedTab = () => {
    switch (pathName) {
      case "/identities":
        return 0;
      case "/faq":
        return 1;
      default:
        return 0;
    }
  };

  const isDashboardVisible = status === "connected" || false;

  const setPathNameFromTab = (tab: number) => {
    switch (tab) {
      case 0:
        return router.replace("/identities", { scroll: false });
      case 1:
        return router.replace("/faq", { scroll: false });
      default:
        return router.replace("/", { scroll: false });
    }
  };

  return (
    <Content
      title="My Dashboard"
      isVisible={isDashboardVisible}
      tabs={DASHBOARD_TAB_ITEMS}
      content={children}
      activeTab={getSelectedTab()}
      onTabChange={setPathNameFromTab}
    />
  );
};

export default Dashboard;
