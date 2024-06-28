import React, { useEffect } from "react";
import { Grid, styled } from "@mui/material";
import { SingleRanking } from "@/redux/leaderboard/leaderboardSlice";
import {
  ColumnContainer,
  ColumnTitle,
  Header,
  HighlightValue,
  Row as StyledRow,
  RowText as StyledRowText,
} from "../StyledLeaderboard";
import { getMaskedAddress } from "@/utils/common";
import { FlexCenter } from "@/components/Theme/StyledGlobal";

const ContentContainer = styled(Grid)(({ theme }) => ({
  height: "700px",
  overflow: "overlay",

  // "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
  //   width: "0",
  //   height: "0",
  // },
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
}));

export const Ranking: React.FC<{ ranking: SingleRanking[] }> = (props: {
  ranking: SingleRanking[];
}) => {
  const { ranking } = props;

  return (
    <Grid mt={2}>
      <ColumnContainer xs={12}>
        <Grid container>
          <Grid item xs={0.5} />
          <Header container item xs>
            <Grid item xs={5}>
              <Title>Holder</Title>
            </Grid>
            <Grid item xs={3}>
              <Title>Name</Title>
            </Grid>
            <Grid item xs={3}>
              <Title>Expiry</Title>
            </Grid>
          </Header>
        </Grid>

        <ContentContainer>
          {ranking?.map((rank, index) => {
            return (
              <Grid key={`emoji-${rank.owner}-${index}`} container>
                <FlexCenter item xs={0.5}>
                  <RowText>{index + 1}</RowText>
                </FlexCenter>
                <Row container item xs>
                  <Grid item xs={5}>
                    <RowText>{getMaskedAddress(rank.owner || "")}</RowText>
                  </Grid>
                  <FlexCenter item xs={3}>
                    <HighlightValue>{rank.label}</HighlightValue>
                  </FlexCenter>
                  <FlexCenter item xs={3}>
                    <RowText>In {rank.expiryDate}</RowText>
                  </FlexCenter>
                </Row>
              </Grid>
            );
          })}
        </ContentContainer>
      </ColumnContainer>
    </Grid>
  );
};

export default Ranking;
