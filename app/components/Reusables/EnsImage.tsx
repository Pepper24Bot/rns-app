import React from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { namehash } from "viem";

import Image from "next/image";
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
  minWidth: "200px",
  height: "fit-content",
  width: "-webkit-fill-available",
  border: `solid 1px ${alpha(grey[700], 0.2)}`,
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
  name?: string;
}

export const EnsImage: React.FC<EnsImage> = (props: EnsImage) => {
  const { name = "" } = props;
  const { name: networkName } = useNetworkConfig();
  const { address: contractAddr } = useContractDetails({
    action: "NameWrapper",
  });

  const nameHash = namehash(name);

  return (
    <ImageContainer item>
      <StyledImage
        src={`https://rns-metadata.fly.dev/${networkName}/${contractAddr}/${nameHash}/image`}
        alt="RNS Name"
        width={200}
        height={200}
      />
    </ImageContainer>
  );
};

export default EnsImage;
