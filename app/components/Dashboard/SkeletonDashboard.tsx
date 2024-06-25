import React from "react";
import {
  Container,
  GridContainer,
  Content,
  ContentContainer,
  TabItem,
  Tabs,
  Title,
} from "./../Reusables/Content";
import { FlexJustified } from "../Theme/StyledGlobal";
import { Grid } from "@mui/material";
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
              <TabItem label="IDENTITIES" />
              <TabItem label="FAQ" />
              {/* TODO: Make sure to add the rest here */}
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
