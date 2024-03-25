import React, { useEffect, useState } from "react";
import { Grid, Link, styled } from "@mui/material";
import {
  Divider,
  ToolbarButton,
  Flex,
  SocialButton,
} from "../Theme/StyledGlobal";
import { useAccount, useEnsName } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import { isEmpty } from "lodash";

import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import Image from "next/image";

const ToolbarContainer = styled(Flex)(({ theme }) => ({
  padding: "10px 0",

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "center",
  },
}));

const HorizontalDivider = styled(Divider)(({ theme }) => ({
  margin: "8px 0 16px 0",
  [theme.breakpoints.up("mobile")]: {
    display: "none",
  },
}));

export const Toolbar: React.FC = () => {
  const { address, connector } = useAccount();
  const { toggleModal } = useModalState();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });
  const { data: ensName } = useEnsName({ address });

  /**
   * Move wallet label and icon path to useState/useEffect
   * to fix nextjs hydration issue wherein the generated
   * html on the server does not match the rendered html
   * on the client-side
   */
  const [walletLabel, setWalletLabel] = useState<string>("Connect Wallet");
  const [iconPath, setIconPath] = useState<string>("/icons/wallet.svg");

  useEffect(() => {
    // TODO: display ensName here of the connected address
    const label = ensName
      ? ensName
      : address
      ? getMaskedAddress(address)
      : "Connect Wallet";
    setWalletLabel(label);

    const walletIcon = address ? path : "/icons/wallet.svg";
    setIconPath(walletIcon);
  }, [address]);

  return (
    <ToolbarContainer>
      <Flex
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },
        }}
      >
        <Link href="https://twitter.com/RootNameService" target="_blank">
          <SocialButton variant="outlined">
            <i className="fa-brands fa-discord fa-xl" />
          </SocialButton>
        </Link>
        <Link href="https://twitter.com/RootNameService" target="_blank">
          <SocialButton variant="outlined">
            <i className="fa-brands fa-x-twitter fa-xl" />
          </SocialButton>
        </Link>
        <Divider orientation="vertical" flexItem />
      </Flex>
      {/* TODO: Clean this */}
      <Grid width="100%" textAlign="center">
        <HorizontalDivider variant="fullWidth" />
        <ToolbarButton
          variant="contained"
          onClick={() => {
            toggleModal({
              id: "Wallets",
              // title: address ? "Switch Wallet" : "Choose your Wallet",
              // isHeaderEnabled: true
              title: address ? "Manage Account" : "Choose your Wallet",
              isHeaderEnabled: !isEmpty(address),
              isXDisabled: true,
            });
          }}
        >
          <Image
            src={iconPath}
            alt="Wallet Icon"
            width={24}
            height={24}
            style={{ marginRight: "8px", color: "white" }}
          />
          {walletLabel}
        </ToolbarButton>
      </Grid>
    </ToolbarContainer>
  );
};

export default Toolbar;
