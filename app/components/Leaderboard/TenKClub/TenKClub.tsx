import React from "react";
import { Grid, styled } from "@mui/material";
import { ClubRanking } from "@/redux/leaderboard/leaderboardSlice";

const Container = styled(Grid)(({ theme }) => ({}));

export const TenKClub: React.FC<{ ranking: ClubRanking[] }> = (props: {
  ranking: ClubRanking[];
}) => {
  return <Grid>9999 CLUB HERE</Grid>;
};

export default TenKClub;
