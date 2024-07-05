import React from "react";
import {
  Container,
  GridContainer,
  ContentContainer,
  TabItem,
  Tabs,
  Title,
} from "./../Reusables/Content";
import { FlexJustified } from "../Theme/StyledGlobal";
import { Grid } from "@mui/material";
import { DASHBOARD_TAB_ITEMS } from "@/constants/components";
import SkeletonNames from "./Tab/Names/SkeletonNames";
import Toolbar from "../Reusables/Toolbar";

export const SkeletonDashboard: React.FC = () => {
  return (
    <GridContainer>
      <Container>
        <FlexJustified container>
          <Grid>
            <Title>My Dashboard</Title>
          </Grid>
          <Grid item md={6} lg={5}>
            <Toolbar />
          </Grid>
        </FlexJustified>
        <ContentContainer>
          <Grid>
            <Tabs value={0}>
              {DASHBOARD_TAB_ITEMS?.map((label) => {
                return <TabItem label={label} key={label} />;
              })}
            </Tabs>
            <Grid id="Tab-Content">
              <SkeletonNames count={2} />
            </Grid>
          </Grid>
        </ContentContainer>
      </Container>
    </GridContainer>
  );
};

export default SkeletonDashboard;
