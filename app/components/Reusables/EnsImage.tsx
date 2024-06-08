import React, { useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { namehash } from "viem";
import { SkeletonRectangular } from "../Theme/StyledGlobal";

import useNetworkConfig from "@/hooks/useNetworkConfig";
import useContractDetails from "@/hooks/useContractDetails";

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

const StyledImage = styled("img")(({ theme }) => ({
  maxWidth: "300px",
  height: "-webkit-fill-available",
  boxShadow: `0px 0px 20px 0px ${darken(grey[900], 1)}`,

  minWidth: "200px",
  width: "-webkit-fill-available",
  border: `solid 1px ${alpha(grey[700], 0.2)}`,
  borderRadius: "4px",

  [theme.breakpoints.between("sm", "md")]: {
    width: "25vw",
  },

  [theme.breakpoints.down("sm")]: {
    width: "35vw",
  },

  "@supports (-moz-appearance:none)": {
    width: "-moz-available",
    height: "-moz-available",
  },
}));

const ImageSkeleton = styled(SkeletonRectangular)(({ theme }) => ({
  width: "calc(100% - 30px)",
  height: "calc(100% - 20px)",
  position: "absolute",
  WebkitTransformOrigin: "top",
  transform: "scale(1)",
}));

export interface EnsImage {
  path?: string;
  name?: string;
}

export const EnsImage: React.FC<EnsImage> = (props: EnsImage) => {
  const { name = "" } = props;
  const { name: networkName } = useNetworkConfig();
  const { address: contractAddr } = useContractDetails({
    action: "NameWrapper",
  });

  const [isImageLoading, setImageLoading] = useState<boolean>(true);
  const nameHash = namehash(name);

  return (
    <ImageContainer item>
      <ImageSkeleton isloading={isImageLoading} />
      <StyledImage
        src={`https://rns-metadata.fly.dev/${networkName}/${contractAddr}/${nameHash}/image`}
        alt="RNS Name"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        width={200}
        height={200}
        onLoad={() => {
          setImageLoading(false);
        }}
      />
    </ImageContainer>
  );
};

export default EnsImage;
