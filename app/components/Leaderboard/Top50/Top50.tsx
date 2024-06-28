import React from "react";
import { Grid, styled } from "@mui/material";
import {
  TopRanking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";
import { Flex, FlexCenter } from "@/components/Theme/StyledGlobal";
import {
  TopContainer,
  TopTotalCount,
  TopHolder,
  ColumnContainer,
  Header,
  ColumnTitle,
  ColumnContent as StyledColumnContent,
  Row,
  RowText,
  Divider,
  HighlightValue,
} from "../StyledLeaderboard";
import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({
  // marginTop: "20px",
  // height: "500px",
  // overflow: "overlay",
}));

const ColumnContent = styled(StyledColumnContent)(({ theme }) => ({
  height: "500px",
  overflow: "overlay",
}));

export const Top50: React.FC<{ ranking: TopRanking[] }> = (props: {
  ranking: TopRanking[];
}) => {
  const { ranking } = props;

  const top3 = ranking?.slice(0, 3);
  const ranks = [ranking?.slice(3, 27), ranking?.slice(27, 50)];

  return (
    <Grid>
      <FlexCenter container p={2} mt={6} mb={4}>
        {top3?.map((rank, index) => {
          return (
            <TopContainer key={`top-${index + 1}`} xs={3} mx={1} container>
              <Flex mr={1}>
                <Image
                  src={`/icons/ranking/rank${index + 1}.svg`}
                  alt={`Badge-${index + 1}`}
                  height={60}
                  width={60}
                />
              </Flex>
              <Grid pb={1}>
                <Grid>
                  <TopTotalCount>{rank.total}</TopTotalCount>
                </Grid>
                <Grid>
                  <TopHolder>{getMaskedAddress(rank.owner || "")}</TopHolder>
                </Grid>
              </Grid>
            </TopContainer>
          );
        })}
      </FlexCenter>
      <Divider />
      <Container container>
        {ranks?.map((rank, columnIndex) => {
          return (
            <Grid key={`column-${columnIndex}`} container xs={12} md={6}>
              <ColumnContainer item xs={12}>
                <Header>
                  <Grid
                    item
                    xs={2}
                    sx={{ borderRight: `solid 1px #540624` }}
                    p={1}
                  >
                    <ColumnTitle>Rank</ColumnTitle>
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    sx={{ borderRight: `solid 1px #540624` }}
                    p={1}
                  >
                    <ColumnTitle>Holder</ColumnTitle>
                  </Grid>
                  <Grid item xs={4} p={1}>
                    <ColumnTitle> RNS Identities Help</ColumnTitle>
                  </Grid>
                </Header>
                <ColumnContent>
                  {rank?.map((holder, index) => {
                    return (
                      <Row container key={`${holder.owner}-${index}`}>
                        <Grid item xs={2}>
                          <RowText pl={4}>
                            {columnIndex ? index + 28 : index + 4}
                          </RowText>
                        </Grid>
                        <Grid item xs={5} pl={2}>
                          <RowText>
                            {getMaskedAddress(holder.owner || "")}
                          </RowText>
                        </Grid>
                        <FlexCenter item xs={4}>
                          <HighlightValue>{holder.total}</HighlightValue>
                        </FlexCenter>
                      </Row>
                    );
                  })}
                </ColumnContent>
              </ColumnContainer>
            </Grid>
          );
        })}
      </Container>
    </Grid>
  );
};

export default Top50;
