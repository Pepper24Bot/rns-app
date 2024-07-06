import React, { memo, useRef } from "react";
import { Grid, darken, styled } from "@mui/material";
import { Ranking, TopRanking } from "@/redux/leaderboard/leaderboardSlice";
import { getExpiry, getMaskedAddress } from "@/utils/common";
import {
  Flex,
  FlexCenter,
  FlexJustified,
  InformationTip,
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
import { FONT_WEIGHT } from "@/components/Theme/Global";
import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up(600)]: {
    padding: "0 0 16px 16px",
  },
}));

const ColumnContent = styled(StyledColumnContent)(({ theme }) => ({}));

const TooltipHeader = styled(Grid)(({ theme }) => ({
  padding: "8px",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.4)}`,
  backgroundColor: `${darken(theme.palette.primary.main, 0.95)}`,
}));

const TooltipRows = styled(ColumnContent)(({ theme }) => ({
  borderBottom: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,
  borderLeft: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,
  maxHeight: "250px",
  minWidth: "250px",
  padding: "4px",
  overflowY: "scroll",
}));

const TooltipRow = styled(TooltipHeader)(({ theme }) => ({
  border: "none",
  padding: "0px 8px",
  backgroundColor: "transparent",
}));

const TooltipText = styled(RowText)(({ theme }) => ({
  fontSize: "12px",
  color: darken(theme.palette.text.primary, 0.5),
}));

const TooltipName = styled(TooltipText)(({ theme }) => ({
  color: theme.palette.text.primary,
  paddingRight: "8px",
  maxWidth: "150px",
}));

const TooltipHeadingText = styled(TooltipName)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "14px",
  fontWeight: FONT_WEIGHT.Bold,
  paddingRight: 0,
}));

interface TopRankingProps {
  leaderboard: TopRanking;
  isFetched?: boolean;
  totalNames?: number;
}

const TooltipContent = memo((item: Ranking) => {
  return (
    <Grid>
      <TooltipHeader>
        <FlexJustified>
          <TooltipHeadingText>Name</TooltipHeadingText>
          <TooltipHeadingText mr={1.5}>Expiry</TooltipHeadingText>
        </FlexJustified>
      </TooltipHeader>
      <TooltipRows>
        {item.names?.map((name, index) => {
          const { labelName, expiryDate } = name;
          return (
            <TooltipRow key={`tooltip-${labelName}-${index}`}>
              <FlexJustified>
                <TooltipName>{labelName}</TooltipName>
                <TooltipText>In {getExpiry(expiryDate).distance}</TooltipText>
              </FlexJustified>
            </TooltipRow>
          );
        })}
      </TooltipRows>
    </Grid>
  );
});

export const Top50: React.FC<TopRankingProps> = (props: TopRankingProps) => {
  const {
    leaderboard: { ranking = [], isFetched },
    totalNames,
  } = props;

  const top3 = ranking?.slice(0, 3);
  const end = Math.floor(ranking?.length / 2 + 3) - 1;

  // Enable this for 2 column ranks
  // const ranks = [ranking?.slice(3, end), ranking?.slice(end, ranking?.length)];

  const ranks = [ranking?.slice(3, ranking?.length)];

  return (
    <Grid>
      <FlexCenter container p={2} mt={6} mb={4}>
        {[...Array(3)].map((_, index) => {
          return (
            <InformationTip
              key={`top-${index + 1}`}
              arrow
              placement="bottom"
              title={
                !isEmpty(top3[index]) ? <TooltipContent {...top3[index]} /> : ""
              }
            >
              <TopContainer xs={12} sm={3} mx={1} container mb={1}>
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
            </InformationTip>
          );
        })}
      </FlexCenter>
      <Divider textAlign="left">
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
            <Grid key={`column-${columnIndex}`} container xs={12}>
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
                    xs={6}
                    sx={{ borderRight: `solid 1px #540624` }}
                    p={1}
                  >
                    <ColumnTitle>Holder</ColumnTitle>
                  </Grid>
                  <Grid item xs={3} p={1}>
                    <ColumnTitle> Identities Held</ColumnTitle>
                  </Grid>
                </Header>
                <ColumnContent>
                  {[...(isEmpty(rank) ? Array(10) : rank)]?.map(
                    (holder: Ranking, index) => {
                      return (
                        <InformationTip
                          arrow
                          key={`${holder?.owner}-${index}`}
                          placement="bottom-end"
                          title={
                            !isEmpty(holder) ? (
                              <TooltipContent {...holder} />
                            ) : (
                              ""
                            )
                          }
                        >
                          <Row container>
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
                        </InformationTip>
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

const MemoizedTop50 = memo((props: TopRankingProps) => {
  return <Top50 {...props} />;
});

export default MemoizedTop50;
