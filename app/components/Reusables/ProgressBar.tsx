import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import { FONT_WEIGHT } from "../Theme/Global";
import { green, red } from "@mui/material/colors";

export interface ProgressBar extends LinearProgressProps {
  // value: number;
  isError?: boolean;
  isPaused?: boolean;
  isVisible?: boolean;
}

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: FONT_WEIGHT.Regular,
  textAlign: "center",
  color: alpha(theme.palette.text.primary, 0.5),
}));

export const ProgressBar: React.FC<ProgressBar> = (props: ProgressBar) => {
  const { isError, isPaused, isVisible = true, ...progressProps } = props;

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress === 100 || isPaused
            ? prevProgress
            : prevProgress + 1;
        });
      }, 1600);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isPaused, isVisible]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        {isError ? (
          <LoadingText>Transaction failed, please try again.</LoadingText>
        ) : (
          <LoadingText>{`${Math.round(progress)}% completed`}</LoadingText>
        )}
        <LinearProgress
          {...progressProps}
          variant="determinate"
          value={progress}
          sx={{
            marginY: 1,
            backgroundColor:
              progress === 100
                ? green[700]
                : isError
                ? red[900]
                : "primary.main",
          }}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
