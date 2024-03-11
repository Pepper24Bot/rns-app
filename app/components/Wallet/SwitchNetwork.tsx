import React from "react";
import { Grid, Link, Typography, alpha, styled } from "@mui/material";
import {
  ActionButton,
  Description,
  Flex,
  FlexRight,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { useSwitchChain } from "wagmi";
import { FONT_WEIGHT } from "../Theme/Global";

import Paragraph from "../Reusables/Paragraph";
import Image from "next/image";
import useNetworkConfig from "@/hooks/useNetworkConfig";

const Container = styled(Grid)(({ theme }) => ({
  maxWidth: "360px",
  width: "100%",
}));

const RootNetwork = styled(Flex)(({ theme }) => ({
  maxWidth: "360px",
  padding: "14px 40px",
  margin: "40px 0 10px",
  border: `solid 1px ${theme.palette.primary.dark}`,
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),
  filter: `drop-shadow(0px 4px 10px ${alpha(
    theme.palette.background.paper,
    0.75
  )})`,
}));

const WalletName = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  fontWeight: FONT_WEIGHT.Bold,
  color: theme.palette.secondary.main,
  marginLeft: "20px",
}));

const VideoLink = styled(Link)(({ theme }) => ({
  textDecorationColor: theme.palette.text.primary,
}));

const VideoLabel = styled(Description)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color: theme.palette.text.primary,
}));

const CancelButton = styled(ActionButton)(({ theme }) => ({
  marginRight: "10px",
  "&.MuiButtonBase-root": {
    marginTop: "35px",
  },
}));

const ConfirmButton = styled(CancelButton)(({ theme }) => ({
  marginRight: 0,
}));

export const SwitchNetwork: React.FC = () => {
  const { chains, switchChain } = useSwitchChain();
  const { closeModal } = useModalState();
  const { walletConfig } = useNetworkConfig();

  // console.log("chains:: ", chains);

  /**
   * TODO:
   * 1. Check for the existence of porcini/root network in the wallet
   * - if root/porcini is not setup, call window.ethereum.request({method: 'wallet_addEthereumChain'})
   * - else call wagmi switchChain()
   *
   * 2. Get environment variable and check for the network
   */
  // switchChain({ chainId: chains[0].id });
  const switchNetwork = async () => {
    const config = walletConfig;

    if (typeof window.ethereum !== "undefined") {
      try {
        const result = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [config],
        });

        console.log("result:: ", result);
      } catch (error) {
        console.log("Error:: ", error);
      }
    }
  };

  return (
    <Container>
      <Paragraph
        description="You are currently connected to another network, Please switch to The
        Root Network."
      />
      <RootNetwork>
        <Image
          src="/images/rns-logo-1.svg"
          alt="RNS Logo"
          width={36}
          height={36}
        />
        <WalletName>The Root Network</WalletName>
      </RootNetwork>

      <Paragraph
        description={{
          content: "Or add The Root Network manually.",
          highlights: ["manually"],
        }}
      />
      <VideoLink href="https://vimeo.com/909628422/f677c793af" target="_blank">
        <VideoLabel>Watch here</VideoLabel>
      </VideoLink>

      <FlexRight>
        <CancelButton
          variant="text"
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </CancelButton>
        <ConfirmButton
          variant="contained"
          onClick={() => {
            // chains only include the root testnet
            switchNetwork();
          }}
        >
          Confirm
        </ConfirmButton>
      </FlexRight>
    </Container>
  );
};

export default SwitchNetwork;
