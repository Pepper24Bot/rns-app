import React from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { SecondaryLabel } from "../Theme/StyledGlobal";

import Image from "next/image";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",
  paddingBottom: "20px",
  display: "flex",
  justifyContent: "center",
  position: "relative",
  height: "fit-content",

  [theme.breakpoints.down("sm")]: {
    paddingRight: "0",
    width: "100%",
  },
}));

const StyledImage = styled(Image)(({ theme }) => ({
  minWidth: "200px",
  height: "fit-content",
  border: `solid 1px ${alpha(grey[700], 0.1)}`,
  borderRadius: "4px",
  boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,

  [theme.breakpoints.between("sm", "md")]: {
    width: "25vw",
  },

  [theme.breakpoints.down("sm")]: {
    width: "35vw",
  },
}));

const RnsName = styled(Grid)(({ theme }) => ({
  position: "absolute",
  bottom: "20px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),
  padding: "8px",
  width: "-webkit-fill-available",
}));

const RnsNameText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
  textAlign: "center",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

export interface EnsImage {
  path?: string;
  name?: string;
}

export const EnsImage: React.FC<EnsImage> = (props: EnsImage) => {
  const { path = "/images/rns-default.gif", name = "" } = props;

  return (
    <ImageContainer item>
      <StyledImage src={path} alt="ENS Image" width={290} height={200} />
      <RnsName>
        <RnsNameText>{name}</RnsNameText>
      </RnsName>
    </ImageContainer>
  );
};

export default EnsImage;
