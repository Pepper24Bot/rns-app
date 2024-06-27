import React from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";
import { FlexJustified, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";

const Container = styled(Grid)(({ theme }) => ({}));

const Header = styled(FlexJustified)(({ theme }) => ({
  padding: "12px 24px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px 4px 0 0",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.4)}`,
}));

const ColumnTitle = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const ColumnContainer = styled(Grid)(({ theme }) => ({
  borderRadius: "4px",
  margin: "16px 8px",
}));

const Content = styled(Grid)(({ theme }) => ({}));

const ColumnContent = styled(Grid)(({ theme }) => ({}));

const Row = styled(FlexJustified)(({ theme }) => ({
  padding: "8px",
  margin: "8px 0",
  borderRadius: "4px",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,
}));

const RowText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.8),
}));

export const Top50: React.FC = () => {
  const { useTopRanking } = useLeaderboardState();
  const ranking = useTopRanking();

  const ranks = [ranking.slice(0, 25), ranking.slice(25, 50)];
  console.log("ranks:: ", ranks);

  return (
    <Container container>
      {ranks?.map((rank, columnIndex) => {
        return (
          <Grid key={`column-${columnIndex}`} container xs={12} md={6} lg={6}>
            <ColumnContainer item xs={12}>
              <Header>
                <Grid item xs={2}>
                  <ColumnTitle>Rank</ColumnTitle>
                </Grid>
                <Grid item xs={5}>
                  <ColumnTitle>Holder</ColumnTitle>
                </Grid>
                <Grid item xs={4}>
                  <ColumnTitle> RNS Identities Help</ColumnTitle>
                </Grid>
              </Header>
              <ColumnContent>
                {rank.map((holder, index) => {
                  return (
                    <Row container key={`${holder.owner}-${index}`}>
                      <Grid item xs={2} pl={4}>
                        <RowText>
                          {columnIndex ? index + 26 : index + 1}
                        </RowText>
                      </Grid>
                      <Grid item xs={5} pl={2}>
                        <RowText>
                          {getMaskedAddress(holder.owner || "")}
                        </RowText>
                      </Grid>
                      <Grid item xs={4}>
                        <RowText>{holder.total}</RowText>
                      </Grid>
                    </Row>
                  );
                })}
              </ColumnContent>
            </ColumnContainer>
          </Grid>
        );
      })}
    </Container>
  );
};

export default Top50;
