import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export interface ProgressProps {
  isVisible?: boolean;
  max?: number;
}

export const CircularProgressWithLabel: React.FC<ProgressProps> = (
  props: ProgressProps
) => {
  const { isVisible, max = 100 } = props;
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= max ? 0 : prevProgress + 1
        );
      }, 600);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isVisible]);

  console.log("time:: ", Math.trunc((progress * 600) / 1000));

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={50}
        sx={{
          borderRadius: "50%",
          boxShadow: `inset 0 0 0 ${(1 / 44) * 150}px rgba(84,6,36, 0.25)`,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {Math.trunc((progress * 600) / 1000)}s
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
