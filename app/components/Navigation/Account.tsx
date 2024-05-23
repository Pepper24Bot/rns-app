import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  alpha,
  styled,
} from "@mui/material";
import {
  ActionButton,
  ActionTooltip,
  ContentTooltip,
  Flex,
  FlexLeft,
  FlexRight,
  FlexTop,
  InformationTip,
  SecondaryLabel,
  TitleTooltip,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { green } from "@mui/material/colors";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { getMaskedAddress } from "@/utils/common";
import { useAccount, useDisconnect } from "wagmi";
import { Check, ContentCopy } from "@mui/icons-material";
import { useModalState } from "@/redux/modal/modalSlice";
import { FUTURE_PASS } from "@/constants/url";
import { Address } from "viem";

import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import ReactJoyride, { Step } from "react-joyride";
import Image from "next/image";
import useCreateAccount from "@/hooks/FuturePass/ProxyExtrinsic/useCreateAccount";
import useNetworkConfig from "@/hooks/useNetworkConfig";

const Container = styled(Grid)(({ theme }) => ({
  minWidth: "275px",
}));

const AccountLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Bold,
}));

const Highlight = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.primary.main,
}));

const Label = styled(Highlight)(({ theme }) => ({
  color: theme.palette.text.primary,
  paddingRight: "8px",
  fontSize: "12px",
  paddingBottom: "2px",
}));

const ChainLabel = styled(Label)(({ theme }) => ({
  paddingBottom: 0,
  fontSize: "14px",
  textTransform: "capitalize",
}));

const RegularText = styled(Highlight)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.75),
}));

const OnlineIcon = styled(Grid)(({ theme }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "4px",
  backgroundColor: green[600],
  marginRight: "8px",
  marginTop: "4px",
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginY: "20px",
  borderColor: alpha(theme.palette.primary.dark, 0.25),
}));

const Vertical = styled(Grid)(({ theme }) => ({
  height: "16px",
  width: "4px",
  marginLeft: "18px",
  backgroundColor: alpha(theme.palette.background.dark, 0.1),
}));

const Logo = styled(Avatar)(({ theme }) => ({
  marginRight: "10px",
  backgroundColor: theme.palette.background.dark,
}));

const CopyIcon = styled(ContentCopy)(({ theme }) => ({
  width: "16px",
  height: "16px",
  color: alpha(theme.palette.text.primary, 0.25),
}));

const CheckIcon = styled(Check)(({ theme }) => ({
  width: "16px",
  height: "16px",
  color: alpha(theme.palette.text.primary, 0.25),
}));

const FpButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    padding: "4px 12px",
  },
  "&.MuiButton-contained": {
    backgroundColor: alpha(theme.palette.primary.dark, 0.5),

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.dark, 0.75),
    },

    "&.Mui-disabled": {
      backgroundColor: alpha(theme.palette.background.dark, 0.25),
    },
  },
}));

export interface AccountProps {
  toggleClose?: () => void;
}

export const Account: React.FC<AccountProps> = (props) => {
  const { toggleClose } = props;

  const { connector, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { network } = useNetworkConfig();

  const { toggleModal } = useModalState();
  const { useRootNetwork, updateRootDetails } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { createFpAccount } = useCreateAccount();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });

  const [isCopied, setIsCopied] = useState("");

  const [isFpActive, setIsFpActive] = useState<boolean>(
    root.isFpActive || false
  );

  const [run, setRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);

  const switchRef = useRef(null);

  const handleSwitchAddress = () => {
    document.cookie = `isFpActive=${!isFpActive}; path=/`;
    setIsFpActive(!isFpActive);
    updateRootDetails({
      ...root,
      isFpActive: !isFpActive,
      address: (!isFpActive
        ? root.futurePassAddress
        : root.eoaAddress) as Address,
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.log(`failed to copy ${text}`);
    }
  };

  const handleDisconnect = () => {
    updateRootDetails({
      ...root,
      address: undefined,
    });
    disconnect();
  };

  const handleCreateFp = async () => {
    await createFpAccount();
  };

  useEffect(() => {
    if (switchRef.current) {
      setSteps([
        {
          target: switchRef.current,
          disableBeacon: true,
          hideCloseButton: true,
          hideFooter: true,
          spotlightClicks: true,
          locale: {
            close: "Do not show again",
          },
          disableScrolling: true,
          placement: "left",
          content: (
            <Grid>
              <TitleTooltip>Switch Address</TitleTooltip>
              <ContentTooltip>
                {!isFpActive
                  ? "When switching to futurepass, all transactions will be paid by FP (excluding the gas fee)"
                  : "When switching to eoa address, all transactions will be paid by your eoa wallet address."}
              </ContentTooltip>
              <ActionTooltip>Try it now!</ActionTooltip>
              <FlexLeft pt={3}>
                <ActionButton variant="contained">
                  Do not show again
                </ActionButton>
              </FlexLeft>
            </Grid>
          ),
          styles: {
            options: {
              zIndex: 10000,
            },
          },
        },
      ]);

      setTimeout(() => {
        setRun(true);
      }, 300);
    }
  }, [switchRef]);

  return (
    <>
      {root.futurePassAddress && (
        <ReactJoyride steps={steps as Step[]} disableCloseOnEsc run={run} />
      )}
      <Container>
        <AccountLabel>Account</AccountLabel>
        <Grid py={2.5}>
          <FlexTop>
            <OnlineIcon />
            <Grid>
              <Flex>
                <Highlight>The Root Network</Highlight>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <ChainLabel>{network}</ChainLabel>
              </Flex>
              <Flex pt={0.5}>
                <ChainLabel>Chain Id:</ChainLabel>
                <RegularText>{chainId}</RegularText>
              </Flex>
            </Grid>
          </FlexTop>
        </Grid>
        <StyledDivider />
        <Grid py={2.5} pl={2.5}>
          <Flex
            sx={{
              transform: isFpActive ? "translate(0, 55px)" : "",
              transition: "all 0.25s ease-out allow-discrete",
            }}
          >
            <Logo>
              <Image
                src={path}
                alt="Wallet Icon"
                width={20}
                height={20}
                style={{
                  color: "text.primary",
                  marginRight: root.eoaAddress ? "" : "8px",
                  opacity: isFpActive ? "0.25" : "1",
                }}
              />
            </Logo>
            <Grid>
              <Label
                sx={{
                  opacity: isFpActive ? "0.25" : "1",
                }}
              >{`${connector?.name} Address`}</Label>
              <Flex>
                <Highlight
                  sx={{
                    color: isFpActive ? "text.secondary" : "primary.main",
                    opacity: isFpActive ? "0.25" : "1",
                  }}
                >
                  {getMaskedAddress(root.eoaAddress || "")}
                </Highlight>
                <IconButton
                  sx={{ p: 0, ml: 3 }}
                  onClick={() => {
                    setIsCopied("eoa");
                    handleCopy(root.eoaAddress || "");
                  }}
                >
                  {isCopied === "eoa" ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </Flex>
            </Grid>
          </Flex>
          <Vertical />
          <Flex
            sx={{
              transform: isFpActive ? "translate(0, -55px)" : "",
              transition: "all 0.25s ease-out allow-discrete",
            }}
          >
            <Logo sx={{ opacity: isFpActive ? "1" : "0.25" }}>
              <Image
                src="/icons/futurePass.svg"
                alt="Wallet Icon"
                width={20}
                height={20}
                style={{
                  color: "text.primary",
                  marginRight: root.eoaAddress ? "" : "8px",
                }}
              />
            </Logo>
            <Grid>
              {root.futurePassAddress ? (
                <Grid>
                  <Label sx={{ opacity: isFpActive ? "1" : "0.25" }}>
                    FuturePass Address
                  </Label>
                  <Flex>
                    <Highlight
                      sx={{
                        color: isFpActive ? "primary.main" : "text.secondary",
                        opacity: isFpActive ? "1" : "0.25",
                      }}
                    >
                      {getMaskedAddress(root.futurePassAddress || "")}
                    </Highlight>
                    <IconButton
                      sx={{ p: 0, ml: 3 }}
                      onClick={() => {
                        setIsCopied("fp");
                        handleCopy(root.futurePassAddress || "");
                      }}
                    >
                      {isCopied === "fp" ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                  </Flex>
                </Grid>
              ) : (
                <Flex>
                  <FpButton
                    variant="contained"
                    onClick={() => {
                      if (chainId === 7668) {
                        if (typeof window !== "undefined") {
                          window.open(FUTURE_PASS, "_blank");
                        }
                      } else {
                        // Create futurepass account via code - porcini only
                        handleCreateFp();
                      }
                    }}
                  >
                    Create a FuturePass
                  </FpButton>
                </Flex>
              )}
            </Grid>
          </Flex>
          {root.futurePassAddress && (
            <FlexRight pt={2.5}>
              <InformationTip title="" arrow placement="top">
                <Grid>
                  <FpButton
                    ref={switchRef}
                    className="step-2-switch-account"
                    onClick={() => {
                      handleSwitchAddress();
                      setRun(false);
                    }}
                  >
                    {isFpActive
                      ? `Switch to ${connector?.name}`
                      : "Switch to FuturePass"}
                  </FpButton>
                </Grid>
              </InformationTip>
            </FlexRight>
          )}
        </Grid>
        <StyledDivider />
        <FlexRight pt={2.5}>
          <Grid pr={1}>
            <ActionButton
              variant="contained"
              onClick={() => {
                if (toggleClose) {
                  toggleClose();
                }

                toggleModal({
                  id: "Wallets",
                  title: "Switch Wallet",
                  isXDisabled: true,
                });
              }}
            >
              Switch Wallet
            </ActionButton>
          </Grid>
          <Grid>
            <ActionButton
              variant="contained"
              onClick={() => {
                if (toggleClose) {
                  toggleClose();
                }
                handleDisconnect();
              }}
            >
              Disconnect
            </ActionButton>
          </Grid>
        </FlexRight>
      </Container>
    </>
  );
};

export default Account;
