import React, { memo } from "react";
import { Grid, darken, styled } from "@mui/material";
import { SingleRanking } from "@/redux/leaderboard/leaderboardSlice";
import {
  ColumnContainer,
  ColumnContent,
  ColumnTitle,
  Header,
  HighlightValue,
  Row as StyledRow,
  RowText as StyledRowText,
} from "../StyledLeaderboard";
import { getMaskedAddress } from "@/utils/common";
import {
  FlexCenter,
  Relative,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import { isEmpty } from "lodash";
import { EMPTY_ADDRESS } from "@/constants/components";

const ContentContainer = styled(ColumnContent)(({ theme }) => ({
  height: "600px",
  border: "none",
  padding: 0, // override columncontent
  paddingRight: "8px",
}));

const Title = styled(ColumnTitle)(({ theme }) => ({
  textAlign: "center",
}));

const RowText = styled(StyledRowText)(({ theme }) => ({
  textAlign: "center",
}));

const Row = styled(StyledRow)(({ theme }) => ({
  padding: "8px",
  margin: "4px 0",

  "&:hover": {
    border: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,
  },
}));

const RelativeCenter = styled(FlexCenter)(({ theme }) => ({
  position: "relative",
}));

interface RankingProps {
  leaderboard: SingleRanking;
}

export const Ranking: React.FC<RankingProps> = (props: RankingProps) => {
  const {
    leaderboard: { isFetched, ranking = [] },
  } = props;

  return (
    <Grid mt={8}>
      <ColumnContainer xs={12}>
        <Grid container>
          <Grid item xs={0.5} />
          <Header container item xs>
            <Grid item xs={5}>
              <Title>Holder</Title>
            </Grid>
            <Grid item xs={3}>
              <Title>Identity</Title>
            </Grid>
            <Grid item xs={3} pr={1}>
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
                <Row container item xs>
                  <Relative item xs={5}>
                    <SkeletonTypography isloading={!isFetched} />
                    <RowText isloading={!isFetched} isPrimary={!!rank?.primary}>
                      {rank?.primary ||
                        getMaskedAddress(rank?.owner || EMPTY_ADDRESS)}
                    </RowText>
                  </Relative>
                  <RelativeCenter item xs={3}>
                    <SkeletonTypography isloading={!isFetched} width="50%" />
                    <HighlightValue isloading={!isFetched}>
                      {rank?.label || "00"}
                    </HighlightValue>
                  </RelativeCenter>
                  <RelativeCenter item xs={3}>
                    <SkeletonTypography isloading={!isFetched} width="50%" />
                    <RowText isloading={!isFetched}>
                      In {rank?.expiryDate}
                    </RowText>
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
