import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React from "react";
import { FONT_WEIGHT } from "../Theme/Global";

export interface ProgressBar extends LinearProgressProps {
  value: number;
  isError?: boolean;
}

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: FONT_WEIGHT.Regular,
  marginBottom: "10px",
  textAlign: "center",
  color: alpha(theme.palette.text.primary, 0.5),
}));

export const ProgressBar: React.FC<ProgressBar> = (props: ProgressBar) => {
  const { value, isError } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        {isError ? (
          <LoadingText>Transaction failed, please try again.</LoadingText>
        ) : (
          <LoadingText>{`${Math.round(value)}% completed`}</LoadingText>
        )}
        <LinearProgress
          variant="determinate"
          {...props}
          color={value === 100 ? "success" : isError ? "error" : "primary"}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
