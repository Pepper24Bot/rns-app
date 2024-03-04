import React from "react";
import {
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
} from "@mui/material";
import { NameWrapped } from "@/redux/graphql/hooks";
import { green, grey } from "@mui/material/colors";

import Image from "next/image";
import { CheckCircle, MoreVert } from "@mui/icons-material";
import { Flex, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { useAccount } from "wagmi";
import {
  convertNumToDate,
  getMaskedAddress,
  getRemainingDays,
} from "@/services/utils";

export interface Name {
  item: NameWrapped;
}

const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  borderRadius: "8px",
  boxShadow: `0px 0px 15px 0px ${theme.palette.background.paper}`,
}));

const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: "25px",
}));

const Details = styled(Grid)(({ theme }) => ({
  padding: "20px 30px",
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.primary.main, 0.5),
}));

const NameLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: 700,
}));

const DetailLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: 400,
  color: alpha(theme.palette.primary.contrastText, 0.6),
  fontSize: "14px",
}));

const MoreIcon = styled(MoreVert)(({ theme }) => ({}));
const CheckedIcon = styled(CheckCircle)(({ theme }) => ({
  color: green[500],
  width: "16px",
  height: "16px",
  marginLeft: "20px",
}));

export const NameCard: React.FC<Name> = (props: Name) => {
  const { item } = props;
  const { address } = useAccount();

  // Check if name is linked to the wallet address
  const hasChecked = address === item.owner.id;

  return (
    <Grid item xs={12} sm={6} md={4} key={item.name}>
      <ItemContainer>
        <ImageContainer>
          <Image
            src="/images/rns-image-placeholder.svg"
            alt="Wallet Icon"
            width={290}
            height={200}
            style={{
              width: "-webkit-fill-available",
              height: "-webkit-fill-available",
              border: `solid 1px ${alpha(grey[50], 0.25)}`,
              borderRadius: "4px",
              boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,
            }}
          />
        </ImageContainer>
        <Divider flexItem />
        <Details container>
          <Grid item xs={7}>
            <Flex>
              <NameLabel>{item.name}</NameLabel>
              {hasChecked && <CheckedIcon />}
            </Flex>
            <DetailLabel>
              {`Linked to ${getMaskedAddress(String(address), 4)}`}
            </DetailLabel>
          </Grid>
          <Grid item xs>
            <DetailLabel>
              {`Expiry ${convertNumToDate(item.expiryDate)}`}
            </DetailLabel>
            <DetailLabel>
              {`In ${getRemainingDays(item.expiryDate)}`}
            </DetailLabel>
          </Grid>
          <Grid item xs={0.5}>
            <MoreIcon />
          </Grid>
        </Details>
      </ItemContainer>
    </Grid>
  );
};

export default NameCard;
