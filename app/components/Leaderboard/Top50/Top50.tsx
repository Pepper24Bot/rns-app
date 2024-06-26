import React from "react";
import { Grid } from "@mui/material";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { getMaskedAddress } from "@/utils/common";

export const Top50: React.FC = () => {
  const { useTopRanking } = useLeaderboardState();
  const ranking = useTopRanking();

  return (
    <Grid>
      {ranking?.map((rank, index) => {
        return (
          <Grid container key={`${rank.owner}-${index}`}>
            <Grid item xs={2}>
              {index + 1}
            </Grid>
            <Grid item xs={5}>
              {getMaskedAddress(rank.owner || "")}
            </Grid>
            <Grid item xs={4}>
              {rank.total}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Top50;
