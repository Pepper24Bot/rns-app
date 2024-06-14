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

export const SkeletonDashboard: React.FC = () => {
  return (
    <Container>
      <DashboardContainer>
        <FlexJustified>
          <Grid>
            <Relative>
              <SkeletonTypography isloading={true} />
              <Title isloading={true}>My Dashboard</Title>
            </Relative>
          </Grid>
          <Flex>
            <Relative>
              <SkeletonTypography isloading={true} />
              <Title isloading={true}>Toolbar: Search Field Here</Title>
            </Relative>
            <Relative ml={2}>
              <SkeletonTypography isloading={true} />
              <Title isloading={true}>Filter</Title>
            </Relative>
          </Flex>
        </FlexJustified>
        <Content>
          <Grid>
            <Tabs>
              <TabItem
                label={
                  <Relative>
                    <SkeletonTypography isloading={true} />
                    <Title isloading={true}>Identities</Title>
                  </Relative>
                }
              />
              <TabItem
                label={
                  <Relative>
                    <SkeletonTypography isloading={true} />
                    <Title isloading={true}>Faq</Title>
                  </Relative>
                }
              />
              {/* TODO: Make sure to add the rest here */}
            </Tabs>
          </Grid>
        </Content>
      </DashboardContainer>
    </Container>
  );
};

export default SkeletonDashboard;
