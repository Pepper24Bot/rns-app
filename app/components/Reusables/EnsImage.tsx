import React from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

import Image from "next/image";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",

  [theme.breakpoints.down("sm")]: {
    paddingRight: "0",
    paddingBottom: "20px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

const StyledImage = styled(Image)(({ theme }) => ({
  minWidth: "200px",
  height: "fit-content",
  border: `solid 1px ${alpha(grey[50], 0.25)}`,
  borderRadius: "4px",
  boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,

  [theme.breakpoints.between("sm", "md")]: {
    width: "25vw",
  },

  [theme.breakpoints.down("sm")]: {
    width: "35vw",
  },
}));

export interface EnsImage {
  path?: string;
}

export const EnsImage: React.FC<EnsImage> = (props: EnsImage) => {
  const { path = "/images/rns-image-placeholder.svg" } = props;

  return (
    <ImageContainer item>
      <StyledImage src={path} alt="ENS Image" width={290} height={200} />
    </ImageContainer>
  );
};

export default EnsImage;
