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
import {
  CheckCircle,
  MoreVert,
  AccessTime,
  Link,
  CropOriginal,
  SwapHoriz,
} from "@mui/icons-material";
import { Flex, SecondaryLabel } from "@/components/Theme/StyledGlobal";
import { useAccount } from "wagmi";
import { getExpiration, getMaskedAddress } from "@/services/utils";
import { useModalState } from "@/redux/modal/modalSlice";
import { useDomainState } from "@/redux/domain/domainSlice";
import { FONT_WEIGHT } from "@/components/Theme/Global";

import DropDownMenu from "@/components/Reusables/DropDownMenu";
import Image from "next/image";
import EnsImage from "@/components/Reusables/EnsImage";

const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  borderRadius: "8px",
  boxShadow: `0px 0px 15px 0px ${theme.palette.background.paper}`,
}));

const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: "25px",
}));

const Expiration = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    paddingTop: "10px",
  },
}));

const Details = styled(Grid)(({ theme }) => ({
  padding: "20px 30px",
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.primary.main, 0.5),
}));

const NameLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const DetailLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.6),
  fontSize: "14px",
}));

const MoreIcon = styled(MoreVert)(({ theme }) => ({}));

const CheckedIcon = styled(CheckCircle)(({ theme }) => ({
  color: green[500],
  width: "16px",
  height: "16px",
  marginLeft: "20px",
}));

const ClockIcon = styled(AccessTime)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
}));

const LinkIcon = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
  transform: "rotate(-40deg)",
}));

const PhotoIcon = styled(CropOriginal)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
}));

const TransferIcon = styled(SwapHoriz)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "20px",
  height: "20px",
  marginRight: "6px",
}));

export interface Name {
  item: NameWrapped;
}

export const NameCard: React.FC<Name> = (props: Name) => {
  const { item } = props;
  const { address } = useAccount();
  const { toggleModal } = useModalState();

  // Check if name is linked to the wallet address
  const hasChecked = address === item.owner.id;

  const handleMenuSelect = (menuOption: string) => {
    toggleModal({
      id: menuOption,
      title: menuOption,
      data: {
        domain: item.domain,
        owner: item.owner,
      },
    });
  };

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
          <Grid item xs={12} lg={7}>
            <Flex>
              <NameLabel>{item.name}</NameLabel>
              {hasChecked && <CheckedIcon />}
            </Flex>
            <DetailLabel>
              {`Linked to ${getMaskedAddress(String(item.owner.id), 4)}`}
            </DetailLabel>
          </Grid>
          <Expiration item xs={11} lg={4.5}>
            <DetailLabel>
              {`Expiry ${
                getExpiration(item.domain.createdAt, item.domain.expiryDate)
                  .expiration
              }`}
            </DetailLabel>
            <DetailLabel>
              {`In ${
                getExpiration(item.domain.createdAt, item.domain.expiryDate)
                  .distanceToExpiration
              }`}
            </DetailLabel>
          </Expiration>
          <Grid item xs={0.5}>
            <DropDownMenu
              handleSelect={handleMenuSelect}
              options={[
                { label: "Extend Expiry", icon: <ClockIcon /> },
                { label: "Link Name", icon: <LinkIcon /> },
                // { label: "Update Image", icon: <PhotoIcon /> },
                // { label: "Transfer", icon: <TransferIcon /> },
              ]}
              hasButton
              iconButton={<MoreIcon />}
              type="Menu"
            />
          </Grid>
        </Details>
      </ItemContainer>
    </Grid>
  );
};

export default NameCard;
