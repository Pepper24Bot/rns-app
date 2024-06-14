import React from "react";
import {
  Container,
  Content,
  DashboardContainer,
  TabItem,
  Tabs,
  Title,
} from "./StyledDashboard";
import {
  Flex,
  FlexJustified,
  Relative,
  SkeletonTypography,
} from "../Theme/StyledGlobal";
import { Grid } from "@mui/material";
import SkeletonNames from "./Tab/Names/SkeletonNames";

export const SkeletonDashboard: React.FC = () => {
  return (
    <Container>
      <DashboardContainer>
        <FlexJustified>
          <Grid>
            <Relative>
              <SkeletonTypography variant="rectangular" isloading={true} />
              <Title isloading={true}>My Dashboard</Title>
            </Relative>
          </Grid>
          <Flex>
            <Relative>
              <SkeletonTypography variant="rectangular" isloading={true} />
              <Title isloading={true}>Toolbar: Search Field Here</Title>
            </Relative>
            <Relative ml={1}>
              <SkeletonTypography variant="rectangular" isloading={true} />
              <Title isloading={true}>Filter</Title>
            </Relative>
          </Flex>
        </FlexJustified>
        <Content>
          <Grid>
            <Tabs value={0}>
              <TabItem
                sx={{
                  "&.MuiTab-root": {
                    padding: "4px 8px",
                    height: "fit-content",
                  },
                }}
                label={
                  <Relative>
                    <SkeletonTypography isloading={true} />
                    <Title sx={{ lineHeight: "normal" }} isloading={true}>
                      IDENTITIES
                    </Title>
                  </Relative>
                }
              />
              <TabItem
                sx={{
                  "&.MuiTab-root": {
                    padding: "4px 8px",
                    height: "fit-content",
                  },
                }}
                label={
                  <Relative>
                    <SkeletonTypography isloading={true} />
                    <Title sx={{ lineHeight: "normal" }} isloading={true}>
                      FAQ
                    </Title>
                  </Relative>
                }
              />
              {/* TODO: Make sure to add the rest here */}
            </Tabs>
            <Grid id="Tab-Content">
              <SkeletonNames />
            </Grid>
          </Grid>
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default SkeletonDashboard;
