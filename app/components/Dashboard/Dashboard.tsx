import React, { useEffect, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import { useAccount } from "wagmi";
import { debounce as _debounce } from "lodash";
import { FlexJustified } from "../Theme/StyledGlobal";
import { Notifications } from "@mui/icons-material";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import {
  Container,
  Content,
  DashboardContainer,
  TabItem,
  Title,
  Tabs,
} from "./StyledDashboard";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import useFeatureToggle, { FeatureList } from "@/hooks/useFeatureToggle";
import FeatureToggle from "../Reusables/FeatureToggle";
import FrequentlyAsked from "./Tab/Faq/Faq";
import Favorites from "./Tab/Favorites";
import LoyaltyPoints from "./Tab/Loyalty";
import Names from "./Tab/Names";
import Toolbar from "./Toolbar";

export interface DashboardProps {
  children?: React.ReactNode;
  hasMounted?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { hasMounted } = props;

  const { status } = useAccount();
  const { isFeatureEnabled } = useFeatureToggle();
  const { useRootNetwork } = useRootNetworkState();
  const {
    data: { address },
  } = useRootNetwork();

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

  const [activeTab, setActiveTab] = useState<number>(getSelectedTab()); // tab-index
  const [isDashboardVisible, setIsDashboardVisible] = useState<boolean>(true); // show by default

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

  useEffect(() => {
    if (status === "connected" && address) {
      setIsDashboardVisible(true);
    } else if (status === "disconnected" && !address) {
      setIsDashboardVisible(false);
    }
  }, [address, status, hasMounted]);

  return (
    <Collapse in={isDashboardVisible}>
      <Container id="Dashboard-Container">
        <DashboardContainer>
          <FlexJustified container>
            <Grid>
              <Title id="my-dashboard">My Dashboard</Title>
            </Grid>
            <Grid item md={6} lg={5}>
              <Toolbar />
            </Grid>
          </FlexJustified>
          <Content>
            <Grid>
              <Tabs
                value={activeTab}
                onChange={(_, value) => {
                  setActiveTab(value);
                  setPathNameFromTab(value);
                }}
              >
                {DASHBOARD_TAB_ITEMS.map((item, index) => {
                  return (
                    isFeatureEnabled(item) && (
                      <TabItem key={item} label={item.toUpperCase()} />
                    )
                  );
                })}
              </Tabs>
            </Grid>
            <Grid id="Tab-Content">
              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 0 && <Names hasMounted={hasMounted} />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.FAQ}>
                {activeTab === 1 && <FrequentlyAsked />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 2 && <Favorites />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 3 && <LoyaltyPoints />}
              </FeatureToggle>

              <FeatureToggle feature={FeatureList.Identities}>
                {activeTab === 4 && <Notifications />}
              </FeatureToggle>
            </Grid>
          </Content>
        </DashboardContainer>
      </Container>
    </Collapse>
  );
};

export default Dashboard;
