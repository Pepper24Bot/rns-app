"use client";

import React from "react";
import { Collapse, Grid } from "@mui/material";
import { useAccount } from "wagmi";
import { debounce as _debounce } from "lodash";
import { FlexJustified } from "../Theme/StyledGlobal";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
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

import useFeatureToggle from "@/hooks/useFeatureToggle";
import Toolbar from "./Toolbar";

export interface DashboardProps {
  children?: React.ReactNode;
}

export const Dashboard: React.FC<DashboardProps> = (props: DashboardProps) => {
  const { children } = props;

  const { status } = useAccount();
  const { isFeatureEnabled } = useFeatureToggle();

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
                value={getSelectedTab()}
                onChange={(_, value) => {
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
            <Grid id="Tab-Content">{children}</Grid>
          </Content>
        </DashboardContainer>
      </Container>
    </Collapse>
  );
};

export default Dashboard;
