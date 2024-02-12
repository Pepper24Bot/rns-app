import React, { useEffect, useState } from "react";
import { alpha, styled } from "@mui/material";
import { X } from "@mui/icons-material";
import {
  Divider,
  ToolbarButton,
  Flex,
  ActionButton,
} from "../Theme/StyledGlobal";
import { useAccount, useEnsName } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import { grey } from "@mui/material/colors";
import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";
import Image from "next/image";
import WalletsContainer from "../Modal/Wallets";

const ToolbarContainer = styled(Flex)(({ theme }) => ({}));

const SocialButton = styled(ToolbarButton)(({ theme }) => ({
  textTransform: "capitalize",
  marginLeft: "5px",
  "&.MuiButtonBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    border: `solid 1px ${theme.palette.primary.main}`,
    height: "40px",
    width: "50px",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

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
      <SocialButton variant="outlined">
        <i className="fa-brands fa-discord fa-xl" />
      </SocialButton>
      <SocialButton variant="outlined">
        <i className="fa-brands fa-x-twitter fa-xl" />
      </SocialButton>
      <Divider orientation="vertical" flexItem />
      <ToolbarButton
        variant="contained"
        onClick={() => {
          toggleModal({
            title: address ? "Switch Wallet" : "Choose your Wallet",
            node: <WalletsContainer />,
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
