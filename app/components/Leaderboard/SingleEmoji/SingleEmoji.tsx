import React, { useEffect } from "react";
import { Grid, styled } from "@mui/material";
import { SingleRanking } from "@/redux/leaderboard/leaderboardSlice";
import {
  ColumnContainer,
  ColumnTitle,
  Header,
  Row as StyledRow,
  RowText as StyledRowText,
} from "../StyledLeaderboard";
import { getMaskedAddress } from "@/utils/common";
import { FlexCenter } from "@/components/Theme/StyledGlobal";

const Container = styled(Grid)(({ theme }) => ({}));

const Title = styled(ColumnTitle)(({ theme }) => ({
  textAlign: "center",
}));

const RowText = styled(StyledRowText)(({ theme }) => ({
  fontSize: "18px",
  color: theme.palette.text.primary,
  textAlign: "center",
}));

const Row = styled(StyledRow)(({ theme }) => ({
  padding: "16px",
  margin: "4px 0",
}));

export const SingleEmoji: React.FC<{ ranking: SingleRanking[] }> = (props: {
  ranking: SingleRanking[];
}) => {
  const { ranking } = props;

  useEffect(() => {
    console.log("ranking:: ", ranking);
  }, [ranking]);

  return (
    <Container>
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
                  <RowText>{rank.label}</RowText>
                </FlexCenter>
                <FlexCenter item xs={3}>
                  <RowText>In {rank.expiryDate}</RowText>
                </FlexCenter>
              </Row>
            </Grid>
          );
        })}
      </ColumnContainer>
    </Container>
  );
};

export default SingleEmoji;
