import React from "react";
import { Grid, Link, Typography, alpha, styled } from "@mui/material";
import {
  ActionButton,
  Description,
  Flex,
  FlexRight,
} from "../Theme/StyledGlobal";

import Paragraph from "../Reusables/Paragraph";
import Image from "next/image";
import { useModalState } from "@/redux/modal/modalSlice";
import { useSwitchChain } from "wagmi";

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
  fontFamily: "Roboto Mono",
  fontWeight: 700,
  color: theme.palette.secondary.main,
  marginLeft: "20px",
}));

const VideoLink = styled(Link)(({ theme }) => ({
  textDecorationColor: theme.palette.text.primary,
}));

const VideoLabel = styled(Description)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const CancelButton = styled(ActionButton)(({ theme }) => ({
  marginRight: "10px",
}));

export const SwitchNetwork: React.FC = () => {
  const { chains, switchChain } = useSwitchChain();
  const { closeModal } = useModalState();

  console.log("chains:: ", chains);

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
        <ActionButton
          variant="contained"
          onClick={() => {
            // chains only include the root testnet
            switchChain({ chainId: chains[0].id });
          }}
        >
          Confirm
        </ActionButton>
      </FlexRight>
    </Container>
  );
};

export default SwitchNetwork;
