import React, { memo } from "react";
import { Grid, styled } from "@mui/material";
import {
  SingleRanking,
  useLeaderboardState,
} from "@/redux/leaderboard/leaderboardSlice";
import {
  ColumnContainer,
  ColumnContent,
  ColumnTitle,
  Header,
  HighlightValue,
  Row as StyledRow,
  RowText as StyledRowText,
} from "../StyledLeaderboard";
import { getMaskedAddress, scrollIntoElement } from "@/utils/common";
import {
  Flex,
  FlexCenter,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import { isEmpty } from "lodash";
import { EMPTY_ADDRESS } from "@/constants/components";
import { amber } from "@mui/material/colors";

const ContentContainer = styled(ColumnContent)(({ theme }) => ({
  height: "600px",
}));

const Title = styled(ColumnTitle)(({ theme }) => ({}));

const RowText = styled(StyledRowText)(({ theme }) => ({
  padding: "0 8px",
}));

const Row = styled(StyledRow)(({ theme }) => ({
  padding: "8px",
  margin: "4px 0",
  cursor: "pointer",
  alignItems: "center",
}));

const RelativeCenter = styled(Flex)(({ theme }) => ({
  position: "relative",
}));

interface RankingProps {
  leaderboard: SingleRanking;
}

export const Ranking: React.FC<RankingProps> = (props: RankingProps) => {
  const {
    leaderboard: { isFetched, ranking = [] },
  } = props;

  const { updateSearchNameOrAddr } = useLeaderboardState();

  return (
    <Grid mt={8}>
      <ColumnContainer xs={12}>
        <Grid container>
          <Grid item xs={0.5} />
          <Header container item xs>
            <Grid item xs={5}>
              <Title>Holder</Title>
            </Grid>
            <Grid item xs={2}>
              <Title>Identity</Title>
            </Grid>
            <Grid item xs={3} />
            <Grid item xs={2} pr={1}>
              <Title>Expiry</Title>
            </Grid>
          </Header>
        </Grid>

        <ContentContainer>
          {[...(!isFetched ? Array(10) : ranking)]?.map((rank, index) => {
            return (
              <Grid key={`emoji-${rank?.owner}-${index}`} container>
                <FlexCenter item xs={0.5}>
                  <RowText>{index + 1}</RowText>
                </FlexCenter>
                <Row
                  container
                  item
                  xs
                  onClick={() => {
                    updateSearchNameOrAddr(rank?.owner || "");
                    scrollIntoElement("Holders-Container");
                  }}
                >
                  <RelativeCenter item xs={5}>
                    <SkeletonTypography isloading={!isFetched} />
                    <RowText isloading={!isFetched} isPrimary={!!rank?.primary}>
                      {rank?.primary ||
                        getMaskedAddress(rank?.owner || EMPTY_ADDRESS)}
                    </RowText>
                  </RelativeCenter>
                  <RelativeCenter item xs={2}>
                    <SkeletonTypography isloading={!isFetched} width="50%" />
                    <HighlightValue isloading={!isFetched}>
                      {rank?.label || "00"}
                    </HighlightValue>
                  </RelativeCenter>
                  <RelativeCenter item xs={3}>
                    <SkeletonTypography isloading={!isFetched} width="50%" />
                    <RowText isloading={!isFetched} sx={{ color: amber[500] }}>
                      {rank?.inGracePeriod && "Grace Period"}
                    </RowText>
                  </RelativeCenter>
                  <RelativeCenter item xs={2}>
                    <SkeletonTypography isloading={!isFetched} width="50%" />
                    <RowText isloading={!isFetched}>{rank?.expiryDate}</RowText>
                  </RelativeCenter>
                </Row>
              </Grid>
            );
          })}

          {isFetched && isEmpty(ranking) && (
            <RowText pt={3}>There is no name found under this category</RowText>
          )}
        </ContentContainer>
      </ColumnContainer>
    </Grid>
  );
};

const MemoizedRanking = memo((props: RankingProps) => {
  return <Ranking {...props} />;
});

export default MemoizedRanking;
