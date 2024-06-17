import React from "react";
import {
  Container,
  Content,
  DashboardContainer,
  TabItem,
  Tabs,
  Title,
} from "./StyledDashboard";
import { FlexJustified } from "../Theme/StyledGlobal";
import { Grid } from "@mui/material";
import SkeletonNames from "./Tab/Names/SkeletonNames";
import Toolbar from "./Toolbar";

export const SkeletonDashboard: React.FC = () => {
  return (
    <Container>
      <DashboardContainer>
        <FlexJustified container>
          <Grid>
            <Title>My Dashboard</Title>
          </Grid>
          <Grid item md={6} lg={5}>
            <Toolbar />
          </Grid>
        </FlexJustified>
        <Content>
          <Grid>
            <Tabs value={0}>
              <TabItem label="IDENTITIES" />
              <TabItem label="FAQ" />
              {/* TODO: Make sure to add the rest here */}
            </Tabs>
            <Grid id="Tab-Content">
              <SkeletonNames count={2} />
            </Grid>
          </Grid>
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default SkeletonDashboard;
