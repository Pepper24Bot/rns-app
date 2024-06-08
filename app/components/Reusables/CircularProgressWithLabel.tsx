import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, styled } from "@mui/material";

const BoxContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  marginLeft: "8px",
}));

const Countdown = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Progress = styled(CircularProgress)(({ theme }) => ({
  borderRadius: "50%",
  boxShadow: `inset 0 0 0 ${(1 / 44) * 150}px rgba(84,6,36, 0.25)`,
}));

export interface ProgressProps {
  isVisible?: boolean;
  max?: number;
  countdown?: boolean;
  isSuccess?: boolean;
}

export const CircularProgressWithLabel: React.FC<ProgressProps> = (
  props: ProgressProps
) => {
  const { isVisible, max = 100, countdown, isSuccess } = props;

  const initial = countdown ? max : 0;
  const [progress, setProgress] = useState<number>(initial);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        if (countdown) {
          setProgress((prevProgress) => {
            return prevProgress === 0 ? prevProgress : prevProgress - 1;
          });
        } else {
          setProgress((prevProgress) => {
            return prevProgress === max ? prevProgress : prevProgress + 1;
          });
        }
      }, 600);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (isSuccess) {
      if (countdown) {
        setProgress(0);
      } else {
        setProgress(max);
      }
    }
  }, [isSuccess]);

  return (
    <BoxContainer>
      <Progress variant="determinate" value={progress} size={50} />
      <Countdown>
        <Typography variant="caption" component="div" color="text.secondary">
          {Math.trunc((progress * 600) / 1000)}s
        </Typography>
      </Countdown>
    </BoxContainer>
  );
};

export default CircularProgressWithLabel;
