import React, { useEffect, useRef, useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import {
  findCharacterSet,
  getExpiration,
  isTooltipShowing,
} from "@/utils/common";
import {
  FieldContainer,
  Flex,
  FlexCenter,
  InformationTip,
  FieldLabel,
  ModalInputField,
  PrimaryChip,
  Relative,
  SecondaryLabel,
  SkeletonTypography,
  FieldValue,
  HighlightText,
  TooltipContainer,
  WarningIcon,
  FlexJustified,
  TooltipText,
} from "../Theme/StyledGlobal";
import { WrappedDomain } from "@/redux/graphql/hooks";
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils";
import { useEnsName } from "wagmi";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { WARNING_ASCII } from "@/constants/content";
import { FONT_WEIGHT } from "../Theme/Global";
import { Address } from "viem";

import Image from "next/image";
import EnsImage from "../Reusables/EnsImage";
import TooltipContent from "../Reusables/TooltipContent";

const DetailsContainer = styled(FlexCenter)(({ theme }) => ({
  alignItems: "start",

  [theme.breakpoints.up(710)]: {
    maxWidth: "350px",
  },

  [theme.breakpoints.down(600)]: {
    width: "100%",
  },
}));

const InputField = styled(ModalInputField)(({ theme }) => ({}));

// TODO: Fix this
const Label = styled(FieldLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
  position: "absolute",
  top: -10,
  left: 15,
  backgroundColor: darken(theme.palette.background.darker, 0.6),
  paddingRight: "8px",
  borderRadius: "2px",
}));

const TooltipGrid = styled(TooltipContainer)(({ theme }) => ({
  fontSize: "16px",

  [theme.breakpoints.up(715)]: {
    width: "300px",
  },

  [theme.breakpoints.down(635)]: {
    width: "70vw",
  },
}));

const Field = styled(FieldContainer)(({ theme }) => ({
  marginTop: "24px",
}));

const RegisteredLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

interface DetailsProps {
  name?: string;
  domain?: Partial<WrappedDomain>;
  isSuccess?: boolean;
}

export const Details: React.FC<DetailsProps> = (props: DetailsProps) => {
  const { name, domain, isSuccess = true } = props;

  const details = domain;
  const nameRef = useRef<HTMLDivElement | null>(null);

  const linkedAddr = details?.domain?.resolver?.addr?.id;
  const hasLinkedAddr = linkedAddr && linkedAddr !== EMPTY_ADDRESS;

  const [isShowNameTooltip, setIsShowNameTooltip] = useState<boolean>(false);

  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const ownerAddr = domain?.owner?.id;

  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: (ownerAddr as Address) || "0x",
  });

  const { data: linkedTo, isLoading: isLinkedAddrLoading } = useEnsName({
    address: (linkedAddr as Address) || "0x",
  });

  const owner = ensName || root.address;
  const resolverId = linkedTo || linkedAddr;
  const characterSet = findCharacterSet(details?.domain?.labelName || "");
  const hasWarning = characterSet === "emoji" || characterSet === "mixed";

  const { expiration, distanceToExpiration } = getExpiration(
    details?.domain?.createdAt,
    details?.domain?.expiryDate
  );

  useEffect(() => {
    const isNameShowing = isTooltipShowing(nameRef);
    setIsShowNameTooltip(isNameShowing);
  }, []);

  return (
    <Grid container mt={6} minWidth={250}>
      <EnsImage name={name} />
      <DetailsContainer item>
        <Grid>
          {/* NAME.ROOT */}
          <Field sx={{ mt: 0 }}>
            <Grid>
              <InformationTip
                arrow
                placement="top"
                title={
                  isShowNameTooltip ? <HighlightText>{name}</HighlightText> : ""
                }
              >
                <TooltipGrid ref={nameRef} isShowTooltip={isShowNameTooltip}>
                  {name}
                </TooltipGrid>
              </InformationTip>
              <RegisteredLabel>Registered</RegisteredLabel>
              <Flex pt={2}>
                {ensName === name && (
                  <PrimaryChip size="small" label="Primary" sx={{ mr: 1 }} />
                )}
                <InformationTip
                  arrow
                  placement="bottom"
                  title={
                    <TooltipContent
                      content={WARNING_ASCII.content}
                      highlights={WARNING_ASCII.highlights}
                      isEnabled={hasWarning}
                    />
                  }
                >
                  {hasWarning ? (
                    <WarningIcon
                      sx={{
                        width: "24px",
                        height: "24px",
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </InformationTip>
                <InformationTip title="View on secondary marketplace." arrow>
                  <Image
                    src="/icons/marketplace.svg"
                    alt="MarketPlace Icon"
                    width={24}
                    height={24}
                    style={{ cursor: "pointer" }}
                  />
                </InformationTip>
              </Flex>
            </Grid>
          </Field>

          {/* OWNER */}
          <Field>
            <Label>Owner</Label>
            <Relative minWidth={150} maxWidth={300} width="100%">
              <SkeletonTypography isloading={isEnsLoading} />
              <InformationTip
                arrow
                placement="bottom"
                title={
                  <TooltipText>
                    <HighlightText>{owner} </HighlightText>- {ownerAddr}
                  </TooltipText>
                }
              >
                <TooltipGrid>
                  <FieldValue isloading={isEnsLoading}>{owner}</FieldValue>
                </TooltipGrid>
              </InformationTip>
            </Relative>
          </Field>

          {/* LINKED TO ADDRESS */}
          {hasLinkedAddr && (
            <Field>
              <Label>Linked To / Resolver</Label>
              <Relative minWidth={150}>
                <SkeletonTypography isloading={isLinkedAddrLoading} />
                <InformationTip
                  arrow
                  placement="bottom"
                  title={
                    <TooltipText>
                      <HighlightText>{resolverId}</HighlightText>{" "}
                      {`- ${linkedAddr}`}
                    </TooltipText>
                  }
                >
                  <TooltipGrid>
                    <FieldValue isloading={isLinkedAddrLoading}>
                      {resolverId}
                    </FieldValue>
                  </TooltipGrid>
                </InformationTip>
              </Relative>
            </Field>
          )}

          {/* EXPIRY DATE */}
          <Field>
            <Label>Expiry</Label>
            <FlexJustified width="100%">
              <Relative minWidth={150}>
                <SkeletonTypography isloading={!isSuccess} />
                <FieldValue isloading={!isSuccess}>
                  {expiration || "00-00-0000"}
                </FieldValue>
              </Relative>
              <Relative minWidth={75}>
                <SkeletonTypography isloading={!isSuccess} />
                <FieldLabel
                  isloading={!isSuccess}
                >{`In ${distanceToExpiration}`}</FieldLabel>
              </Relative>
            </FlexJustified>
          </Field>
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Details;
