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
import { green, lightGreen, red } from "@mui/material/colors";

export interface ProgressBar extends LinearProgressProps {
  // value: number;
  isError?: boolean;
  isPaused?: boolean;
  isVisible?: boolean;
  isSuccess?: boolean;
  resetProgress?: boolean;
}

const LoadingText = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: FONT_WEIGHT.Regular,
  textAlign: "center",
  color: alpha(theme.palette.text.primary, 0.5),
}));

export const ProgressBar: React.FC<ProgressBar> = (props: ProgressBar) => {
  const {
    isSuccess,
    isError,
    isPaused,
    isVisible = true,
    resetProgress = false,
    ...progressProps
  } = props;

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          return prevProgress === 100 || isPaused
            ? prevProgress
            : prevProgress + 1;
        });
      }, 2000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isPaused, isVisible]);

  useEffect(() => {
    if (resetProgress) {
      setProgress(0);
    }
  }, [resetProgress]);

  useEffect(() => {
    if (isSuccess) {
      setProgress(100);
    }
  }, [isSuccess]);

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
            "&.MuiLinearProgress-root": {
              backgroundColor:
                progress === 100
                  ? alpha(green[900], 0.25)
                  : isError
                  ? alpha(red[900], 0.25)
                  : "primary.dark",
            },
            ".MuiLinearProgress-bar": {
              backgroundColor:
                progress === 100
                  ? lightGreen[900]
                  : isError
                  ? red.A700
                  : "primary.main",
            },
            marginY: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
