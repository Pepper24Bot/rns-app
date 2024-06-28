import React from "react";
import { Grid, styled } from "@mui/material";
import { SingleRanking } from "@/redux/leaderboard/leaderboardSlice";

const Container = styled(Grid)(({ theme }) => ({}));

export const SingleCharacter: React.FC<{ ranking: SingleRanking[] }> = (props: {
  ranking: SingleRanking[];
}) => {
  const { ranking } = props;

  return <Grid>SINGLE CHARACTERS HERE</Grid>;
};

export default SingleCharacter;
