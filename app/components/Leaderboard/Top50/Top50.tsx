import React, { useEffect } from "react";
import { Grid, styled } from "@mui/material";
import { Ranking, TopRanking } from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";
import {
  Flex,
  FlexCenter,
  Relative,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
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
import { EMPTY_ADDRESS } from "@/constants/components";
import { isEmpty } from "lodash";
import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({}));

const ColumnContent = styled(StyledColumnContent)(({ theme }) => ({
  maxHeight: "500px",
}));

interface TopRankingProps {
  leaderboard: TopRanking;
  isFetched?: boolean;
  totalNames?: number;
}

export const Top50: React.FC<TopRankingProps> = (props: TopRankingProps) => {
  const {
    leaderboard: { ranking = [], isFetched },
    totalNames,
  } = props;

  const top3 = ranking?.slice(0, 3);
  const end = Math.floor(ranking?.length / 2 + 3) - 1;
  const ranks = [ranking?.slice(3, end), ranking?.slice(end, ranking?.length)];

  return (
    <Grid>
      <FlexCenter container p={2} mt={6} mb={4}>
        {[...Array(3)].map((_, index) => {
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
                <Relative>
                  <SkeletonTypography isloading={!isFetched} />
                  <TopTotalCount isloading={!isFetched}>
                    {top3[index]?.total || "0000"}
                  </TopTotalCount>
                </Relative>
                <Relative>
                  <SkeletonTypography isloading={!isFetched} />
                  <TopHolder
                    isloading={!isFetched}
                    isPrimary={!!top3[index]?.primary}
                  >
                    {/* Pass empty address for skeleton loading */}
                    {top3[index]?.primary ||
                      getMaskedAddress(top3[index]?.owner || EMPTY_ADDRESS)}
                  </TopHolder>
                </Relative>
              </Grid>
            </TopContainer>
          );
        })}
      </FlexCenter>
      <Divider textAlign="right">
        <Flex>
          <RowText pr={1}>Total Registered Identities:</RowText>
          <Relative>
            <SkeletonTypography isloading={!isFetched} />
            <HighlightValue isloading={!isFetched}>
              {Number(totalNames).toLocaleString() || 0}
            </HighlightValue>
          </Relative>
        </Flex>
      </Divider>
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
                  {[...(isEmpty(rank) ? Array(10) : rank)]?.map(
                    (holder: Ranking, index) => {
                      return (
                        <Row container key={`${holder?.owner}-${index}`}>
                          <Relative item xs={2}>
                            <RowText pl={4}>
                              {columnIndex ? index + end + 1 : index + 4}
                            </RowText>
                          </Relative>
                          <Relative item xs={5} pl={2}>
                            <SkeletonTypography
                              isloading={!isFetched}
                              width="85%"
                            />
                            <RowText
                              isloading={!isFetched}
                              isPrimary={!!holder?.primary}
                            >
                              {holder?.primary ||
                                getMaskedAddress(
                                  holder?.owner || EMPTY_ADDRESS
                                )}
                            </RowText>
                          </Relative>
                          <Relative
                            display="flex"
                            justifyContent="center"
                            item
                            xs={4}
                          >
                            <SkeletonTypography
                              isloading={!isFetched}
                              width="60%"
                            />
                            <HighlightValue isloading={!isFetched}>
                              {holder?.total || "000"}
                            </HighlightValue>
                          </Relative>
                        </Row>
                      );
                    }
                  )}
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
