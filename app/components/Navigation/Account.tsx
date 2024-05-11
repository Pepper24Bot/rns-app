import React, { useState } from "react";
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
  Flex,
  FlexRight,
  FlexTop,
  InformationTip,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { green } from "@mui/material/colors";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { getMaskedAddress } from "@/utils/common";
import { useAccount, useDisconnect } from "wagmi";
import { ContentCopy } from "@mui/icons-material";
import { useModalState } from "@/redux/modal/modalSlice";
import { FUTURE_PASS } from "@/constants/url";
import { Address } from "viem";

import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import Image from "next/image";
import useCreateAccount from "@/hooks/FuturePass/useCreateAccount";
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

const FpButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    padding: "4px 12px",
  },
  "&.MuiButton-contained": {
    backgroundColor: alpha(theme.palette.primary.dark, 0.2),

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.dark, 0.5),
    },

    "&.Mui-disabled": {
      backgroundColor: alpha(theme.palette.background.dark, 0.25),
    },
  },
}));

export interface AccountProps {
  toggleClose?: () => void;
}

export const Account: React.FC<AccountProps> = (props: AccountProps) => {
  const { toggleClose } = props;

  const { connector, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { network } = useNetworkConfig();

  const { toggleModal } = useModalState();
  const { useRootNetwork, updateRootDetails } = useRootNetworkState();
  const { data: root } = useRootNetwork();

  const { createFpAccount } = useCreateAccount();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });

  const [isFpActive, setIsFpActive] = useState<boolean>(
    root.isFpActive || false
  );

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

  const handleCreateFp = async () => {
    await createFpAccount();
  };

  return (
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
            opacity: isFpActive ? "0.25" : "1",
          }}
        >
          <Logo>
            <Image
              src={path}
              alt="Wallet Icon"
              width={20}
              height={20}
              style={{
                color: "white",
                marginRight: root.eoaAddress ? "" : "8px",
              }}
            />
          </Logo>
          <Grid>
            <Label>{`${connector?.name} Address`}</Label>
            <Flex>
              <Highlight
                sx={{
                  color: isFpActive ? "text.secondary" : "primary.main",
                }}
              >
                {getMaskedAddress(root.eoaAddress || "")}
              </Highlight>
              <IconButton
                sx={{ p: 0, ml: 1 }}
                onClick={() => {
                  handleCopy(root.eoaAddress || "");
                }}
              >
                <CopyIcon />
              </IconButton>
            </Flex>
          </Grid>
        </Flex>
        <Vertical />
        <Flex
          sx={{
            transform: isFpActive ? "translate(0, -55px)" : "",
            transition: "all 0.25s ease-out allow-discrete",
            opacity: isFpActive ? "1" : "0.25",
          }}
        >
          <Logo>
            <Image
              src="/icons/futurePass.svg"
              alt="Wallet Icon"
              width={20}
              height={20}
              style={{
                color: "white",
                marginRight: root.eoaAddress ? "" : "8px",
              }}
            />
          </Logo>
          <Grid>
            {root.futurePassAddress ? (
              <Grid>
                <Label>FuturePass Address</Label>
                <Flex>
                  <Highlight
                    sx={{
                      color: isFpActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    {getMaskedAddress(root.futurePassAddress || "")}
                  </Highlight>
                  <IconButton
                    sx={{ p: 0, ml: 1 }}
                    onClick={() => {
                      handleCopy(root.futurePassAddress || "");
                    }}
                  >
                    <CopyIcon />
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
                  onClick={() => {
                    handleSwitchAddress();
                  }}
                >
                  {isFpActive
                    ? `Switch to ${connector?.name}`
                    : " Switch to FuturePass"}
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
              disconnect();
            }}
          >
            Disconnect
          </ActionButton>
        </Grid>
      </FlexRight>
    </Container>
  );
};

export default Account;
