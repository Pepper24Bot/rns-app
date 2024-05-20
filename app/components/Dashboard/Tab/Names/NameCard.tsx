import React, { useEffect, useRef, useState } from "react";
import {
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
  Chip,
} from "@mui/material";
import { Account, Domain, NameWrapped } from "@/redux/graphql/hooks";
import { amber, green, grey, pink, red, yellow } from "@mui/material/colors";
import {
  CheckCircle,
  MoreVert,
  AccessTime,
  Link,
  CropOriginal,
  SwapHoriz,
  X,
  Key,
} from "@mui/icons-material";
import {
  ButtonLabel,
  Flex,
  FlexJustified,
  InformationTip,
  SecondaryLabel,
  ShareButton,
  SkeletonRectangular,
} from "@/components/Theme/StyledGlobal";
import { getExpiration, getMaskedAddress, parseCookie } from "@/utils/common";
import { useModalState } from "@/redux/modal/modalSlice";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { EMPTY_ADDRESS } from "@/constants/components";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { useEnsAddress, useEnsName } from "wagmi";
import { namehash, Address } from "viem";

import FeatureToggle from "@/components/Reusables/FeatureToggle";
import DropDownMenu, { Option } from "@/components/Reusables/DropDownMenu";
import Image from "next/image";
import EnsImage from "@/components/Reusables/EnsImage";
import useNetworkConfig from "@/hooks/useNetworkConfig";
import useContractDetails from "@/hooks/useContractDetails";

const Container = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(180deg, #0C0C0C 50%, rgba(194,24,91,0.75) 100%)",
  borderRadius: "8px",
  padding: "1px",
}));

const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: `0px 0px 25px 0px ${darken(grey[900], 1)}`,
}));

const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: "20px",
}));

const RnsName = styled(Grid)(({ theme }) => ({
  position: "relative",
  bottom: "40px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),
  padding: "8px",
}));

const RnsNameText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
  textAlign: "center",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

const Summary = styled(Grid)(({ theme }) => ({
  padding: "20px 15px 20px 25px",
}));

const SubContainer = styled(Summary)(({ theme }) => ({
  padding: "10px 20px 20px 20px",
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.primary.main, 0.2),
}));

const NameDetails = styled(Grid)(({ theme }) => ({
  paddingTop: "12px",
}));

const NameContainer = styled(Grid)(({ theme }) => ({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontSize: "18px",
}));

const Detail = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.85),
  fontSize: "14px",
  paddingTop: "2px",
}));

const Label = styled("span")(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.25),
  paddingRight: "8px",
}));

const TooltipText = styled("span")(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.5),
}));

const MoreIcon = styled(MoreVert)(({ theme }) => ({}));

const CheckedIcon = styled(CheckCircle, {
  shouldForwardProp: (prop) => prop !== "hidden",
})<{ hidden?: boolean }>(({ hidden, theme }) => ({
  color: green[500],
  width: "16px",
  height: "16px",
  visibility: hidden ? "hidden" : "visible",
  margin: "0 4px",
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

const PrimaryIcon = styled(Key)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
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

const ShareLabel = styled(SecondaryLabel)(({ theme }) => ({
  padding: "6px 10px",
  textTransform: "uppercase",
  fontWeight: FONT_WEIGHT.Bold,
}));

const Verifying = styled(ButtonLabel)(({ theme }) => ({
  padding: "8px 12px",
  color: yellow[800],
}));

const Verified = styled(Verifying)(({ theme }) => ({
  color: green[800],
}));

const Failed = styled(Verifying)(({ theme }) => ({
  color: red[600],
}));

const TwitterIcon = styled(X)(({ theme }) => ({
  margin: "6px 8px",
  fontSize: "16px",
}));

const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const PrimaryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: amber[500],
  color: theme.palette.background.paper,
}));

export interface NameProps {
  item: NameWrapped;
  activeAddress: Address;
}

export interface CardProps {
  domain: Partial<Domain>;
  owner: Partial<Account>;
  refetchEnsName?: () => void;
  ensName?: string;
  ensAddr?: string;
  activeAddress?: Address;
}

export const NameCard: React.FC<NameProps> = (props: NameProps) => {
  const { item, activeAddress } = props;
  const { toggleModal } = useModalState();
  const { name: networkName } = useNetworkConfig();

  const { address: contractAddr } = useContractDetails({
    action: "NameWrapper",
  });

  const nameHash = namehash(item.name ?? "");
  const nameRef = useRef<HTMLDivElement | null>(null);

  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);
  const [isImageLoading, setImageLoading] = useState<boolean>(true);

  const { data: ensName } = useEnsName({
    address: activeAddress,
  });

  const { data: ensAddr } = useEnsAddress({
    name: item.domain.name || "",
  });

  const hasLinkedAddr = ensAddr && ensAddr !== EMPTY_ADDRESS;
  const isTweetVerified = parseCookie("isTweetVerified") === "true";

  const { expiration, distanceToExpiration } = getExpiration(
    item.domain.createdAt,
    item.domain.expiryDate
  );

  const handleMenuSelect = (menuOption: Option) => {
    const data: CardProps = {
      domain: item.domain,
      owner: item.owner,
      ensName: ensName || "",
      activeAddress,
    };

    toggleModal({
      id: menuOption.label,
      title: menuOption.title || menuOption.label,
      data,
      isCloseDisabled: true,
      isXDisabled: true,
    });
  };

  useEffect(() => {
    const scrollWidth = nameRef?.current?.scrollWidth || 0;
    const clientWidth = nameRef?.current?.clientWidth || 0;

    if (scrollWidth > clientWidth) {
      setIsShowTooltip(true);
    }
  }, []);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
      <Container>
        <ItemContainer>
          <ImageContainer sx={{ position: "relative" }}>
            <SkeletonRectangular
              isloading={isImageLoading}
              style={{
                width: "calc(100% - 40px)",
                height: "calc(100% - 45px)",
                position: "absolute",
                WebkitTransformOrigin: "top",
                transform: "scale(1)",
              }}
            />
            <img
              src={`https://rns-metadata.fly.dev/${networkName}/${contractAddr}/${nameHash}/image`}
              alt="RNS Name"
              width={200}
              height={200}
              onLoadStart={() => {
                console.log("loading start...");
              }}
              onLoad={() => {
                setImageLoading(false);
              }}
              style={{
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
                border: `solid 1px ${alpha(grey[800], 0.25)}`,
                borderRadius: "4px",
                boxShadow: `0px 0px 20px 0px ${darken(grey[900], 1)}`,
              }}
            />
          </ImageContainer>
          <Grid>
            <Divider flexItem />
            <Summary container>
              <Grid item xs={12}>
                <FlexJustified container>
                  <InformationTip
                    title={
                      isShowTooltip ? <Highlight>{item.name}</Highlight> : ""
                    }
                    arrow
                    placement="top"
                  >
                    <NameContainer item xs={9} ref={nameRef}>
                      {item.name}
                    </NameContainer>
                  </InformationTip>
                  <Flex>
                    <InformationTip
                      title={
                        <Grid>
                          <TooltipText>{`${item.name} is linked to `}</TooltipText>
                          <Highlight>{ensAddr}</Highlight>
                        </Grid>
                      }
                      arrow
                      placement="top"
                    >
                      <CheckedIcon hidden={!hasLinkedAddr} />
                    </InformationTip>
                    <DropDownMenu
                      handleSelect={handleMenuSelect}
                      options={[
                        { label: "Extend Expiry", icon: <ClockIcon /> },
                        { label: "Link Identity", icon: <LinkIcon /> },
                        {
                          label: "Set as Primary",
                          icon: <PrimaryIcon />,
                          disabled: ensName === item.name,
                        },
                        { label: "Transfer", icon: <TransferIcon /> },
                        // { label: "Update Image", icon: <PhotoIcon /> },
                      ]}
                      hasButton
                      iconButton={<MoreIcon />}
                      type="Menu"
                    />
                  </Flex>
                </FlexJustified>
                <NameDetails>
                  {hasLinkedAddr ? (
                    <Detail>
                      <Label>Linked to</Label>
                      {getMaskedAddress(String(ensAddr), 6)}
                    </Detail>
                  ) : (
                    <Detail>
                      <Label>Owner</Label>
                      {getMaskedAddress(String(item.owner.id), 6)}
                    </Detail>
                  )}
                  <Grid container>
                    <Detail mr={1}>
                      <Label>Expiry</Label>
                      {expiration}
                    </Detail>
                    <Detail>
                      <Label>In</Label>
                      {distanceToExpiration}
                    </Detail>
                  </Grid>
                </NameDetails>
              </Grid>
            </Summary>
            <FlexJustified>
              <Flex>
                {ensName === item.name && (
                  <SubContainer>
                    <PrimaryChip label="Primary" />
                  </SubContainer>
                )}
              </Flex>
              {!isTweetVerified && (
                <Flex>
                  <SubContainer>
                    <ShareButton
                      variant="contained"
                      disabled
                      onClick={() => {
                        toggleModal({
                          id: "Share RNS",
                          title: "",
                          fullHeight: true,
                          fullWidth: true,
                        });
                      }}
                    >
                      <TwitterIcon fontSize="small" />
                      <Divider orientation="vertical" flexItem />
                      <ShareLabel isDisabled={true}>Share</ShareLabel>
                    </ShareButton>
                  </SubContainer>
                  <FeatureToggle feature={FeatureList.ShareStatus}>
                    <SubContainer>
                      {/* TODO: Enable this once Share per RNS name is supported */}
                      {/* <ShareButton disabled variant="contained">
                      {isLoading ? (
                        <Verifying>Verifying</Verifying>
                      ) : isSuccess ? (
                        <Verified>Verified</Verified>
                      ) : isError ? (
                        <Failed>Failed</Failed>
                      ) : (
                        <></>
                      )}
                      {isLoading && (
                        <CircularProgress size="16px" sx={{ ml: "8px" }} />
                      )}
                    </ShareButton> */}
                    </SubContainer>
                  </FeatureToggle>
                </Flex>
              )}
            </FlexJustified>
          </Grid>
        </ItemContainer>
      </Container>
    </Grid>
  );
};

export default NameCard;
