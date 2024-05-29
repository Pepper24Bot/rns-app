import React, { useEffect, useRef, useState } from "react";
import { Grid, alpha, darken } from "@mui/material";
import { NameWrapped } from "@/redux/graphql/hooks";
import { grey } from "@mui/material/colors";
import {
  Flex,
  FlexJustified,
  InformationTip,
  ShareButton,
  SkeletonRectangular,
} from "@/components/Theme/StyledGlobal";
import {
  Label,
  Divider,
  CheckedIcon,
  ClockIcon,
  Container,
  Detail,
  DownloadIcon,
  ImageContainer,
  ItemContainer,
  LinkIcon,
  MoreIcon,
  NameContainer,
  NameDetails,
  PrimaryChip,
  PrimaryIcon,
  ShareLabel,
  SubContainer,
  Summary,
  TooltipText,
  TransferIcon,
  TwitterIcon,
  Highlight,
} from "./StyledName";
import {
  getDate,
  getExpiration,
  getMaskedAddress,
  isDateWithinRange,
  parseCookie,
} from "@/utils/common";
import { useModalState } from "@/redux/modal/modalSlice";
import { EMPTY_ADDRESS } from "@/constants/components";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { useEnsAddress, useEnsName } from "wagmi";
import { namehash, Address } from "viem";
import { useGetNftImageQuery } from "@/redux/metadata/metadataApi";
import { CardProps } from "@/interfaces/components/transaction";
import { useSnackbar } from "notistack";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { useShareState } from "@/redux/share/shareSlice";

import FeatureToggle from "@/components/Reusables/FeatureToggle";
import DropDownMenu, { Option } from "@/components/Reusables/DropDownMenu";
import useNetworkConfig from "@/hooks/useNetworkConfig";
import useContractDetails from "@/hooks/useContractDetails";

export interface NameProps {
  item: NameWrapped;
  activeAddress: Address;
}

export const NameCard: React.FC<NameProps> = (props: NameProps) => {
  const { item, activeAddress } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { name: networkName } = useNetworkConfig();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { useShareStatus } = useShareState();
  const { isSuccess } = useShareStatus();
  const { address: contractAddr } = useContractDetails({
    action: "NameWrapper",
  });

  const nameHash = namehash(item.name ?? "");
  const nameRef = useRef<HTMLDivElement | null>(null);

  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);
  const [isImageLoading, setImageLoading] = useState<boolean>(true);
  const [isDownloadRequested, setDownloadRequested] = useState<boolean>(false);

  const {
    data: image,
    isSuccess: isMetadataSuccess,
    isError,
  } = useGetNftImageQuery(
    {
      network: networkName,
      contractAddr,
      hash: nameHash,
    },
    { skip: !isDownloadRequested }
  );

  const [isShareEnabled, setShareEnabled] = useState<boolean>(false);

  const { data: ensName } = useEnsName({
    address: activeAddress,
  });

  const { data: ensAddr } = useEnsAddress({
    name: item.domain.name || "",
  });

  const hasLinkedAddr = ensAddr && ensAddr !== EMPTY_ADDRESS;
  const isTweetVerified =
    parseCookie("isTweetVerified") === "true" || isSuccess;
  const imageUrl = `https://rns-metadata.fly.dev/${networkName}/${contractAddr}/${nameHash}/image`;

  console.log("name:: ", item.domain.name);
  const { expiration, distanceToExpiration } = getExpiration(
    item.domain.createdAt,
    item.domain.expiryDate
  );

  const handleDownloadPng = (imgURI: string) => {
    const link = document.createElement("a");
    link.href = imgURI;
    link.download = `${item?.domain?.labelName || "rns-name"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadRequested(false);
  };

  const handleSvgToPng = (objectUrl: string) => {
    const image = new Image();
    // aligns with metadata-server - TODO: fix this
    image.width = 540;
    image.height = 540;
    image.src = objectUrl;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const imgURI = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      handleDownloadPng(imgURI);
      enqueueSnackbar("Download completed!", {
        variant: "success",
        autoHideDuration: 2000,
      });
    };
  };

  const handleMenuSelect = (menuOption: Option) => {
    if (menuOption.label === "Download Image") {
      setDownloadRequested(true);
    } else {
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
    }
  };

  useEffect(() => {
    const start = new Date("2024-05-28T08:00:00.000+10:00");
    const end = new Date("2024-06-25T08:00:00.000+10:00");
    const createdDate = getDate(item.domain.createdAt);
    const isShareable = isDateWithinRange(createdDate, start, end);

    setShareEnabled(isShareable);
  }, [item.domain.createdAt, isTweetVerified]);

  useEffect(() => {
    const scrollWidth = nameRef?.current?.scrollWidth || 0;
    const clientWidth = nameRef?.current?.clientWidth || 0;

    if (scrollWidth > clientWidth) {
      setIsShowTooltip(true);
    }
  }, []);

  useEffect(() => {
    if (isDownloadRequested && !isMetadataSuccess) {
      enqueueSnackbar("Download in progress.", {
        variant: "info",
        autoHideDuration: 3000,
      });
    }

    if (isMetadataSuccess) {
      const imageStr = image as unknown as string;
      const blob = new Blob([imageStr], {
        type: "image/svg+xml",
      });

      const objectUrl = URL.createObjectURL(blob);
      handleSvgToPng(objectUrl);
    }

    if (isError) {
      enqueueSnackbar("Ooops! Download failed.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [isMetadataSuccess, isDownloadRequested, isError]);

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
              src={imageUrl}
              alt="RNS Name"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width={200}
              height={200}
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
                        {
                          label: "Download Image",
                          icon: <DownloadIcon />,
                        },
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
              <Flex>
                <InformationTip
                  title={
                    !isShareEnabled
                      ? "This identity was registered outside of the quest period."
                      : !root.futurePassAddress
                      ? "You do not have a FuturePass address, please create one to complete the Quest."
                      : isTweetVerified
                      ? "Post sharing during Quest period successfully completed."
                      : ""
                  }
                >
                  <SubContainer>
                    <ShareButton
                      variant="contained"
                      disabled={
                        !isShareEnabled ||
                        isTweetVerified ||
                        !root.futurePassAddress
                      }
                      onClick={() => {
                        toggleModal({
                          id: "Share RNS",
                          title: "",
                          fullHeight: true,
                          fullWidth: true,
                          isCloseDisabled: true,
                        });
                      }}
                    >
                      <TwitterIcon fontSize="small" />
                      <Divider orientation="vertical" flexItem />
                      <ShareLabel
                        isDisabled={
                          !isShareEnabled ||
                          isTweetVerified ||
                          !root.futurePassAddress
                        }
                      >
                        Share
                      </ShareLabel>
                    </ShareButton>
                  </SubContainer>
                </InformationTip>
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
            </FlexJustified>
          </Grid>
        </ItemContainer>
      </Container>
    </Grid>
  );
};

export default NameCard;
