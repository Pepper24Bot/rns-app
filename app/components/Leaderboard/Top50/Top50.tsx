import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import useAllNames from "@/hooks/useAllNames";

export const Top50: React.FC = () => {
  const { domains, isFetched, isFetching } = useAllNames();

  useEffect(() => {
    if (isFetched) {
      console.log("domains:: ", domains);
    }
  }, [isFetched]);

  return <Grid></Grid>;
};

export default Top50;
