import React from "react";
import { Divider, Grid, Typography, alpha, styled } from "@mui/material";
import { Description, useModalState } from "@/redux/modal/modalSlice";
import { useAccount, useConnect, useConnectors, useDisconnect } from "wagmi";
import {
  ActionButton,
  Flex,
  FlexLeft,
  FlexRight,
  PrimaryLabel,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { FONT_WEIGHT } from "../Theme/Global";
import { X } from "@mui/icons-material";

import Paragraph from "../Reusables/Paragraph";
import Image from "next/image";
import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";

const Container = styled(Grid)(({ theme }) => ({
  maxWidth: "320px",
  width: "100%",
}));

const WalletsContainer = styled(Grid)(({ theme }) => ({
  margin: "10px 0px",
}));

const WalletItem = styled(Flex, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  maxWidth: "320px",
  padding: "14px 40px",
  marginTop: "10px",
  border: `solid 1px ${
    isActive ? theme.palette.primary.main : theme.palette.primary.dark
  }`,
  borderRadius: "8px",
  backgroundColor: isActive
    ? theme.palette.primary.dark
    : alpha(theme.palette.primary.dark, 0.1),
  filter: `drop-shadow(0px 4px 10px ${alpha(
    theme.palette.background.paper,
    0.75
  )})`,

  "&:hover": {
    backgroundColor: isActive
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.dark, 0.25),
    border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    cursor: "pointer",
  },
}));

const WalletName = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  fontWeight: FONT_WEIGHT.Bold,
  color: theme.palette.secondary.main,
  marginLeft: "20px",
}));

const HeaderLabel = styled(PrimaryLabel)(({ theme }) => ({
  padding: "10px 0",
}));

const Label = styled(PrimaryLabel)(({ theme }) => ({
  fontSize: "14px",
  padding: "0px 16px",
  color: alpha(theme.palette.text.primary, 0.75),
}));

const AccountLabel = styled(PrimaryLabel)(({ theme }) => ({
  fontSize: "12px",
  padding: "0px 16px",
  color: alpha(theme.palette.text.primary, 0.25),
}));

const DisconnectButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    marginTop: "35px",
  },
}));

export const Wallets: React.FC = () => {
  const connectors = useConnectors();
  const { connect } = useConnect();
  const { connector: activeConnector } = useAccount();
  const { disconnect, isPending: isDisconnecting } = useDisconnect();

  const { closeModal } = useModalState();
  const { getIcon } = useWalletIcon();

  const description: Description = {
    content:
      "By connecting your wallet, you agree to our Terms of Service and our Privacy Policy.",
    highlights: ["Terms of Service", "Privacy Policy"],
  };

  const getWalletName = (name: string) => {
    switch (name) {
      case "Injected":
        return "MetaMask";
      default:
        return name;
    }
  };

  return (
    <Container>
      {!activeConnector?.name && !isDisconnecting && (
        <Grid mb={5}>
          <Paragraph description={description} />
        </Grid>
      )}
      <WalletsContainer>
        <Grid>
          {activeConnector?.name && <HeaderLabel>Switch Wallet</HeaderLabel>}
          {connectors?.map((connector) => {
            return (
              connector.name !== "MetaMask" && (
                <WalletItem
                  key={connector.id}
                  onClick={() => {
                    connect({ connector });
                    closeModal();
                  }}
                  isActive={activeConnector?.name === connector.name}
                >
                  <Image
                    src={getIcon(connector.name as Wallet)}
                    alt={connector.name}
                    width={32}
                    height={32}
                  />
                  <WalletName>{getWalletName(connector.name)}</WalletName>
                </WalletItem>
              )
            );
          })}
          {activeConnector?.name && (
            <FlexRight>
              <DisconnectButton
                variant="contained"
                onClick={() => {
                  disconnect();
                  closeModal();
                }}
              >
                Disconnect
              </DisconnectButton>
            </FlexRight>
          )}
        </Grid>
        {activeConnector?.name && (
          <>
            <Divider sx={{ mt: 4, mb: 2, backgroundColor: "primary.dark" }} />
            <Grid mb={4}>
              <HeaderLabel>Social Accounts</HeaderLabel>
              <FlexLeft>
                <X />
                <Grid>
                  <Label>X (Twitter)</Label>
                  <AccountLabel>X (Twitter)</AccountLabel>
                </Grid>
              </FlexLeft>
            </Grid>
          </>
        )}
      </WalletsContainer>
    </Container>
  );
};

export default Wallets;
