import React, { useEffect, useRef, useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import {
  getExpiry,
  hasNonAsciiChars,
  isInGracePeriod,
  isTooltipShowing,
} from "@/utils/common";
import {
  FieldContainer,
  Flex,
  FlexCenter,
  InformationTip,
  FieldLabel,
  PrimaryChip,
  SecondaryLabel,
  FieldValue,
  HighlightText,
  TooltipContainer,
  WarningIcon as StyledWarningIcon,
  FlexJustified,
  ModalInputField,
} from "../Theme/StyledGlobal";
import { EMPTY_ADDRESS } from "@ensdomains/ensjs/utils";
import { useEnsName } from "wagmi";
import { WARNING_ASCII } from "@/constants/content";
import { FONT_WEIGHT } from "../Theme/Global";
import { Address } from "viem";
import { DetailsProps } from "@/interfaces/global/transaction";

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

const InputField = styled(ModalInputField)(({ theme }) => ({
  maxWidth: "500px",

  [theme.breakpoints.down(800)]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

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
}));

const Field = styled(FieldContainer)(({ theme }) => ({
  marginTop: "24px",

  [theme.breakpoints.up(715)]: {
    width: "350px",
  },

  [theme.breakpoints.down(635)]: {
    width: "75vw",
  },
}));

const RegisteredLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

const WarningIcon = styled(StyledWarningIcon)(({ theme }) => ({
  width: "24px",
  height: "24px",
  marginRight: "8px",
}));

export const Details: React.FC<DetailsProps> = (props: DetailsProps) => {
  const { item } = props;

  const {
    name,
    wrappedOwner: ownerAddr,
    resolvedAddress: linkedAddr,
    labelName,
    expiryDate,
    gracePeriod,
  } = item;

  const hasLinkedAddr = linkedAddr && linkedAddr !== EMPTY_ADDRESS;
  const nameRef = useRef<HTMLDivElement | null>(null);
  const inGracePeriod = isInGracePeriod(gracePeriod);

  const [isShowNameTooltip, setIsShowNameTooltip] = useState<boolean>(false);

  const { data: ensName } = useEnsName({
    address: (ownerAddr as Address) || "0x",
  });

  const { data: linkedTo } = useEnsName({
    address: (linkedAddr as Address) || "0x",
  });

  const owner = ensName || ownerAddr;
  const resolverId = linkedTo || linkedAddr;
  const hasWarning = hasNonAsciiChars(labelName ?? "");

  const { expiration, distanceToExpiry, remainingGrace } = getExpiry(
    expiryDate,
    gracePeriod
  );

  useEffect(() => {
    const isNameShowing = isTooltipShowing(nameRef);
    setIsShowNameTooltip(isNameShowing);
  }, []);

  return (
    <Grid container mt={6} minWidth={250}>
      <EnsImage name={name ?? ""} />
      <DetailsContainer item>
        <Grid>
          {/* NAME.ROOT */}
          <Field sx={{ mt: 0 }}>
            <FlexJustified container>
              <Grid item width="calc(100% - 60px)">
                <InformationTip
                  arrow
                  placement="top"
                  title={
                    isShowNameTooltip ? (
                      <HighlightText>{name}</HighlightText>
                    ) : (
                      ""
                    )
                  }
                >
                  <TooltipGrid ref={nameRef} isShowTooltip={isShowNameTooltip}>
                    {name}
                  </TooltipGrid>
                </InformationTip>
                <RegisteredLabel>Registered</RegisteredLabel>
              </Grid>
              <Flex item>
                {ensName === name && (
                  <PrimaryChip size="small" label="Primary" sx={{ mr: 0.5 }} />
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
                  {hasWarning ? <WarningIcon /> : <></>}
                </InformationTip>
                <InformationTip title="View on secondary marketplace." arrow>
                  <Image
                    src="/icons/tradeverse.png"
                    alt="Tradeverse Icon"
                    width={32}
                    height={32}
                    style={{ cursor: "pointer" }}
                  />
                </InformationTip>
              </Flex>
            </FlexJustified>
          </Field>

          {/* OWNER */}
          <InputField
            label="Owner"
            value={owner}
            InputProps={{
              readOnly: true,
            }}
          />

          {/* LINKED TO ADDRESS */}
          {hasLinkedAddr && (
            <InputField
              label="Linked To / Resolver"
              value={resolverId}
              InputProps={{
                readOnly: true,
              }}
            />
          )}

          {/* EXPIRY DATE */}
          {!inGracePeriod ? (
            <InputField
              label="Expiry"
              value={expiration}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <FieldValue minWidth="100px">{`In ${distanceToExpiry}`}</FieldValue>
                ),
              }}
            />
          ) : (
            <Grid container mt={0.25} spacing={2}>
              <Grid item xs={5}>
                <InputField
                  label="Expiry"
                  value={expiration}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={7}>
                <InputField
                  label="Grace Period"
                  value={`Ends in ${remainingGrace.label}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Details;
