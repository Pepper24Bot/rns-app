import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import {
  Flex,
  FlexJustified,
  FlexRight,
  InformationTip,
  ShareButton,
  WarningIcon,
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
  TransferIcon,
  TwitterIcon,
  Highlight,
  EnsImageCard,
  ImageSkeleton,
  ExternalAddressIcon,
  NoAddressIcon,
} from "./StyledName";
import {
  findCharacterSet,
  getExpiry,
  getMaskedAddress,
  isTooltipShowing,
} from "@/utils/common";
import { DomainResponse } from "@/redux/graphql/graphqlApi";
import { useModalState } from "@/redux/modal/modalSlice";
import { EMPTY_ADDRESS } from "@/constants/components";
import { FeatureList } from "@/hooks/useFeatureToggle";
import { useEnsName } from "wagmi";
import { namehash, Address } from "viem";
import { useGetNftImageQuery } from "@/redux/metadata/metadataApi";
import { CardProps } from "@/interfaces/global/transaction";
import { Option } from "@/interfaces/global/components";
import { useSnackbar } from "notistack";
import { TWEETS_RNS, WARNING_ASCII } from "@/constants/content";
import { useRouter } from "next/navigation";

import FeatureToggle from "@/components/Reusables/FeatureToggle";
import DropDownMenu from "@/components/Reusables/DropDownMenu";
import useNetworkConfig from "@/hooks/useNetworkConfig";
import useContractDetails from "@/hooks/useContractDetails";
import TooltipContent from "@/components/Reusables/TooltipContent";

export interface NameProps {
  item: DomainResponse;

  /**
   * Always remember that this address
   * can be either eoa or fp.
   */
  address: Address;

  boundingArea?: HTMLDivElement | null;
}

export const NameCard: React.FC<NameProps> = (props: NameProps) => {
  const { item, address, boundingArea } = props;
  const { name, labelName, expiryDate, resolvedAddress: ensAddr } = item;

  const { enqueueSnackbar } = useSnackbar();
  const { toggleModal } = useModalState();
  const { name: networkName } = useNetworkConfig();
  const { address: contractAddr } = useContractDetails({
    action: "NameWrapper",
  });

  const router = useRouter();
  const nameHash = namehash(name ?? "");
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

  const { data: ensName } = useEnsName({
    address: address,
  });

  const characterSet = findCharacterSet(labelName ?? "");
  const hasLinkedAddr = ensAddr && ensAddr !== EMPTY_ADDRESS;
  const imageUrl = `https://rns-metadata.fly.dev/${networkName}/${contractAddr}/${nameHash}/image`;

  const { expiration, distance } = getExpiry(expiryDate);

  const handleDownloadPng = (imgURI: string) => {
    const link = document.createElement("a");
    link.href = imgURI;
    link.download = `${labelName || "rns-name"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadRequested(false);
  };

  const initiateDownload = () => {
    if (isDownloadRequested && !isMetadataSuccess) {
      enqueueSnackbar("Download in progress.", {
        variant: "info",
        autoHideDuration: 3000,
      });
    }

    if (isMetadataSuccess) {
      const imageStr = image as unknown as string;
      const dataUrl =
        "data:image/svg+xml; charset=utf8, " + encodeURIComponent(imageStr);

      handleSvgToPng(dataUrl);
    }

    if (isError) {
      enqueueSnackbar("Ooops! Download failed.", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleSvgToPng = (dataUrl: string) => {
    const img = new Image();
    img.width = 540;
    img.height = 540;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const imgURI = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");

        handleDownloadPng(imgURI);
        enqueueSnackbar("Download completed!", {
          variant: "success",
          autoHideDuration: 2000,
        });
      } catch (error) {
        console.log("download-error:: ", error);
        enqueueSnackbar("Ooops! Download failed!", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    };

    img.src = dataUrl;
  };

  const toggleTransactionModal = (menuOption: Option) => {
    const { label: menuLabel, title } = menuOption;

    const data: CardProps = {
      item,
      address,
    };

    toggleModal({
      data,
      id: menuLabel,
      title: title || menuLabel,
      isCloseDisabled: true,
      isXDisabled: true,
    });
  };

  // THIS IS REDUNDANT
  const handleMenuSelect = (menuOption: Option) => {
    const { label: menuLabel } = menuOption;

    switch (menuLabel) {
      case "Extend Expiry":
        toggleTransactionModal(menuOption);
        return router.replace(`/expiry/${labelName}`, { scroll: false });
      case "Link Identity":
        toggleTransactionModal(menuOption);
        return router.replace(`/record/${labelName}`, { scroll: false });
      case "Set as Primary":
        toggleTransactionModal(menuOption);
        return router.replace(`/primary/${labelName}`, { scroll: false });
      case "Transfer":
        toggleTransactionModal(menuOption);
        return router.replace(`/transfer/${labelName}`, { scroll: false });
      case "Download Image":
        setDownloadRequested(true);
        return;
      default:
        return;
    }
  };

  const getTooltipProps = () => {
    if (ensAddr === address) {
      return {
        heading: "Linked to connected wallet address",
        icons: {
          heading: <CheckedIcon />,
        },
        content: `${name} is linked to connected wallet address ${ensAddr}`,
      };
    } else if (hasLinkedAddr && ensAddr !== address) {
      return {
        heading: "Beware: Linked to an external wallet address!",
        icons: {
          heading: <ExternalAddressIcon />,
        },
        content: `${name} is linked to external wallet address ${ensAddr}`,
      };
    } else if (!hasLinkedAddr) {
      return {
        icons: {
          heading: <NoAddressIcon />,
        },
      };
    }
  };

  /**
   * Share the newly registered name
   */
  const handleTweet = () => {
    const content = TWEETS_RNS[Math.floor(Math.random() * TWEETS_RNS.length)];

    const url = `http://twitter.com/intent/tweet?text=${encodeURIComponent(
      content
    )}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    const isShowing = isTooltipShowing(nameRef);
    setIsShowTooltip(isShowing);
  }, []);

  // Move this to a callback
  useEffect(() => {
    initiateDownload();
  }, [isMetadataSuccess, isDownloadRequested, isError]);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
      <Container>
        <ItemContainer>
          <ImageContainer>
            <ImageSkeleton isloading={isImageLoading} />
            <EnsImageCard
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
            />
          </ImageContainer>
          <Grid>
            <Divider flexItem />
            <Summary container>
              <Grid item xs={12}>
                <FlexJustified container>
                  <InformationTip
                    arrow
                    placement="top"
                    title={isShowTooltip ? <Highlight>{name}</Highlight> : ""}
                    current={boundingArea}
                  >
                    <NameContainer
                      item
                      xs={8}
                      ref={nameRef}
                      isShowTooltip={isShowTooltip}
                    >
                      {name}
                    </NameContainer>
                  </InformationTip>
                  <FlexRight>
                    <InformationTip
                      arrow
                      placement="top"
                      current={boundingArea}
                      title={
                        <TooltipContent
                          content={WARNING_ASCII.content}
                          highlights={WARNING_ASCII.highlights}
                          isEnabled={
                            characterSet === "emoji" || characterSet === "mixed"
                          }
                        />
                      }
                    >
                      <WarningIcon
                        hidden={
                          characterSet !== "emoji" && characterSet !== "mixed"
                        }
                      />
                    </InformationTip>
                    <DropDownMenu
                      handleSelect={handleMenuSelect}
                      options={[
                        { label: "Extend Expiry", icon: <ClockIcon /> },
                        { label: "Link Identity", icon: <LinkIcon /> },
                        {
                          label: "Set as Primary",
                          icon: <PrimaryIcon />,
                          disabled: ensName === name,
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
                  </FlexRight>
                </FlexJustified>
                <NameDetails>
                  <FlexJustified>
                    <Detail>
                      <Label>Linked to:</Label>
                      {hasLinkedAddr
                        ? getMaskedAddress(String(ensAddr), 6)
                        : "No Address"}
                    </Detail>
                    <InformationTip
                      title={
                        hasLinkedAddr ? (
                          <TooltipContent
                            {...getTooltipProps()}
                            wordBreak="keep-all"
                            minWidth="325px"
                            highlights={[
                              { text: name || "" },
                              { text: ensAddr || "" },
                            ]}
                          />
                        ) : (
                          ""
                        )
                      }
                      arrow
                      placement="top"
                      current={boundingArea}
                    >
                      {getTooltipProps()?.icons?.heading || <></>}
                    </InformationTip>
                  </FlexJustified>
                  <Grid container>
                    <Detail mr={1}>
                      <Label>Expiry:</Label>
                      {expiration}
                    </Detail>
                    <Detail>
                      <Label>In</Label>
                      {distance}
                    </Detail>
                  </Grid>
                </NameDetails>
              </Grid>
            </Summary>
            <FlexJustified>
              <Flex>
                {ensName === name && (
                  <SubContainer>
                    <PrimaryChip label="Primary" size="small" />
                  </SubContainer>
                )}
              </Flex>
              <Flex>
                <InformationTip
                  current={boundingArea}
                  title={
                    "Help us spread the word by sharing your new RNS on X and go into the running to win monthly prizes!"
                  }
                >
                  <SubContainer>
                    <ShareButton
                      variant="contained"
                      onClick={() => {
                        handleTweet();
                      }}
                    >
                      <TwitterIcon />
                      <Divider orientation="vertical" flexItem />
                      <ShareLabel>Share</ShareLabel>
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
