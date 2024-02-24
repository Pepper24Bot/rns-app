import React, { useEffect, useState } from "react";
import { Link, styled } from "@mui/material";
import {
  Divider,
  ToolbarButton,
  Flex,
  SocialButton,
} from "../Theme/StyledGlobal";
import { useAccount, useEnsName } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import Image from "next/image";

const ToolbarContainer = styled(Flex)(({ theme }) => ({}));

export const Toolbar: React.FC = () => {
  const { address, connector } = useAccount();
  const { toggleModal } = useModalState();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });
  const ensName = useEnsName({ address });

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
    const label = address ? getMaskedAddress(address) : "Connect Wallet";
    setWalletLabel(label);

    const walletIcon = address ? path : "/icons/wallet.svg";
    setIconPath(walletIcon);
  }, [address]);

  return (
    <ToolbarContainer>
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
      <ToolbarButton
        variant="contained"
        onClick={() => {
          toggleModal({
            id: "Wallets",
            title: address ? "Switch Wallet" : "Choose your Wallet",
          });
        }}
      >
        <Image
          src={iconPath}
          alt={connector?.name || "Wallet Icon"}
          width={24}
          height={24}
          style={{ marginRight: "8px", color: "white" }}
        />
        {walletLabel}
      </ToolbarButton>
    </ToolbarContainer>
  );
};

export default Toolbar;
