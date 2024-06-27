import React from "react";
import {
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
} from "@mui/material";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";
import {
  Flex,
  FlexCenter,
  FlexJustified,
  SecondaryLabel,
} from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({}));

const TopContainer = styled(FlexCenter)(({ theme }) => ({
  padding: "16px",
  borderRadius: "60px",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
  filter: `drop-shadow(0px 5px 10px ${theme.palette.background.paper})`,
}));

const TopTotalCount = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "30px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const TopHolder = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  color: alpha(theme.palette.text.primary, 0.75),
}));

const Header = styled(FlexJustified)(({ theme }) => ({
  padding: "16px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.05),
  border: `solid 1px ${darken(theme.palette.primary.main, 0.4)}`,
}));

const ColumnTitle = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
}));

const ColumnContainer = styled(Grid)(({ theme }) => ({
  borderRadius: "4px",
  margin: "16px 8px",
}));

const ColumnContent = styled(Grid)(({ theme }) => ({}));

const Row = styled(FlexJustified)(({ theme }) => ({
  alignItems: "center",
  padding: "20px 8px",
  margin: "8px 0",
  borderRadius: "4px",
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,
}));

const RowText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  color: alpha(theme.palette.text.primary, 0.6),
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "24px 0",
  borderColor: theme.palette.primary.dark,
}));

export const Top50: React.FC = () => {
  const { useTopRanking } = useLeaderboardState();
  const ranking = useTopRanking();

  const top3 = ranking?.slice(0, 3);
  const ranks = [ranking?.slice(3, 27), ranking?.slice(27, 50)];

  return (
    <Grid>
      <FlexCenter container p={2} my={6}>
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
            <Grid key={`column-${columnIndex}`} container xs={12} md={6} lg={6}>
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
                        <Flex item xs={4}>
                          <RowText>{holder.total}</RowText>
                        </Flex>
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
