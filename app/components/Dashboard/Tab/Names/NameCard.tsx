import React, { useEffect, useRef, useState } from "react";
import {
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
  tooltipClasses,
} from "@mui/material";
import { NameWrapped } from "@/redux/graphql/hooks";
import { green, grey, red, yellow } from "@mui/material/colors";
import {
  CheckCircle,
  MoreVert,
  AccessTime,
  Link,
  CropOriginal,
  SwapHoriz,
  X,
} from "@mui/icons-material";
import {
  ButtonLabel,
  Flex,
  FlexJustified,
  InformationTip,
  SecondaryLabel,
  ShareButton,
} from "@/components/Theme/StyledGlobal";
import { getExpiration, getMaskedAddress, parseCookie } from "@/services/utils";
import { useModalState } from "@/redux/modal/modalSlice";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { EMPTY_ADDRESS } from "@/services/constants";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { isEmpty } from "lodash";

import FeatureToggle from "@/components/Reusables/FeatureToggle";
import DropDownMenu, { Option } from "@/components/Reusables/DropDownMenu";
import Image from "next/image";
import EnsImage from "@/components/Reusables/EnsImage";

const Container = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(180deg, #0C0C0C 50%, rgba(194,24,91,0.75) 100%)",
  borderRadius: "8px",
  padding: "1px",
}));

const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
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

const ShareContainer = styled(Summary)(({ theme }) => ({
  padding: "10px 30px 20px 25px",
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
  // fontWeight: FONT_WEIGHT.Bold,
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

export const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export interface NameProps {
  item: NameWrapped;
}

export const NameCard: React.FC<NameProps> = (props: NameProps) => {
  const { item } = props;
  const { toggleModal } = useModalState();

  const nameRef = useRef<HTMLDivElement | null>(null);
  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);

  // Check if name is linked to the wallet address
  const linkedAddr = item?.domain?.resolver?.addr?.id;
  const hasLinkedAddr = linkedAddr && linkedAddr !== EMPTY_ADDRESS;

  const isTweetVerified = parseCookie("isTweetVerified") === "true";

  const handleMenuSelect = (menuOption: Option) => {
    toggleModal({
      id: menuOption.label,
      title: menuOption.label,
      data: {
        domain: item.domain,
        owner: item.owner,
      },
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
          <ImageContainer>
            <Image
              src="/images/rns-default.gif"
              alt="Wallet Icon"
              width={290}
              height={200}
              style={{
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
                border: `solid 1px ${alpha(grey[700], 0.25)}`,
                borderRadius: "4px",
                boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,
              }}
            />
            <RnsName>
              <RnsNameText>{item.name}</RnsNameText>
            </RnsName>
          </ImageContainer>
          <Grid mt="-40px">
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
                          <Highlight>{linkedAddr}</Highlight>
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
                        { label: "Link Name", icon: <LinkIcon /> },
                        // { label: "Update Image", icon: <PhotoIcon /> },
                        // { label: "Transfer", icon: <TransferIcon /> },
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
                      {getMaskedAddress(String(linkedAddr), 6)}
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
                      {
                        getExpiration(
                          item.domain.createdAt,
                          item.domain.expiryDate
                        ).expiration
                      }
                    </Detail>
                    <Detail>
                      <Label>In</Label>
                      {
                        getExpiration(
                          item.domain.createdAt,
                          item.domain.expiryDate
                        ).distanceToExpiration
                      }
                    </Detail>
                  </Grid>
                </NameDetails>
              </Grid>
            </Summary>
            {!isTweetVerified && (
              <FlexJustified>
                <ShareContainer>
                  <ShareButton
                    variant="contained"
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
                    <ShareLabel>Share</ShareLabel>
                  </ShareButton>
                </ShareContainer>
                <FeatureToggle feature={FeatureList.ShareStatus}>
                  <ShareContainer>
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
                  </ShareContainer>
                </FeatureToggle>
              </FlexJustified>
            )}
          </Grid>
        </ItemContainer>
      </Container>
    </Grid>
  );
};

export default NameCard;
