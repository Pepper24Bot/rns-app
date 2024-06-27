import React, { useEffect } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";
import {
  Flex,
  FlexCenter,
  FlexJustified,
  SecondaryLabel,
} from "@/components/Theme/StyledGlobal";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { isEmpty } from "lodash";
import Image from "next/image";

const Container = styled(Grid)(({ theme }) => ({}));

const TopContainer = styled(FlexCenter)(({ theme }) => ({
  padding: "16px",
  borderRadius: "60px",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
  filter: `drop-shadow(0px 5px 5px ${theme.palette.background.paper})`,
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
  padding: "12px 24px",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,
}));

const ColumnTitle = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const ColumnContainer = styled(Grid)(({ theme }) => ({
  borderRadius: "4px",
  margin: "16px 8px",
}));

const ColumnContent = styled(Grid)(({ theme }) => ({}));

const Row = styled(FlexJustified)(({ theme }) => ({
  alignItems: "center",
  padding: "16px 8px",
  margin: "8px 0",
  backgroundColor: darken(theme.palette.background.darker, 0.5),
}));

const RowText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.8),
}));

export const Top50: React.FC = () => {
  const { useTopRanking } = useLeaderboardState();
  const ranking = useTopRanking();

  const top3 = ranking.slice(0, 3);
  console.log("top3:: ", top3);
  const ranks = [ranking.slice(3, 27), ranking.slice(27, 50)];

  //   const getPrimary = async (address: string) => {
  //     const ensName = await getEnsName(config, { address: address as Address });
  //     return ensName || getMaskedAddress(address);
  //   };

  useEffect(() => {
    if (!isEmpty(ranking)) {
    }
  }, [ranking]);

  return (
    <Grid>
      <FlexCenter container p={2} mt={2}>
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
