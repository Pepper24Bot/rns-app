import React, { useEffect, useState } from "react";
import {
  useScrollTrigger,
  styled,
  Grid,
  Slide,
  AppBar as MuiAppBar,
  Avatar,
  Box,
  Chip,
  alpha,
  Typography,
} from "@mui/material";
import {
  BaseButton,
  WalletButton,
  Flex,
  FlexCenter,
  FlexJustified,
} from "../Theme/StyledGlobal";

import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import Image from "next/image";
import WalletsContainer from "../Modal/Wallets";
import { getMaskedAddress } from "@/services/utils";
import useWalletIcon, { Wallet } from "@/hooks/useWalletIcon";

const Navigation = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  backgroundImage: "none", // override appbar's default
  zIndex: 10,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: "240px",
    width: `calc(100% - ${240}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavigationContainer = styled(FlexCenter)(({ theme }) => ({
  filter: `drop-shadow(0px 0px 15px #000000)`,
  backgroundColor: alpha(theme.palette.primary.dark, 0.15),
  border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
  borderRadius: "8px",
  height: "60px",
  margin: "10px",
}));

const Contents = styled(FlexJustified)(({ theme }) => ({
  maxWidth: "1420px",
  width: "100%",
  padding: "10px 40px",
}));

const ToolbarContainer = styled(Flex)(({ theme }) => ({}));

export type ScrollProps = {
  window?: () => Window;
  children: React.ReactElement;
};

/**
 * Ideally, this should be on a separate file
 * but lets keep it here since it is a small component.
 */
export const HideOnScrollBar: React.FC<ScrollProps> = (props: ScrollProps) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export const NavigationBar: React.FC = () => {
  const { address, isConnected, connector } = useAccount();
  const { toggleModal } = useModalState();
  const { path } = useWalletIcon({ name: connector?.name as Wallet });

  /**
   * Move wallet label and icon path to useState/useEffect
   * to fix nextjs hydration issue wherein the generated
   * html on the server does not match the rendered html
   * on the client-side
   */
  const [walletLabel, setWalletLabel] = useState<string>("Connect Wallet");
  const [iconPath, setIconPath] = useState<string>("/icons/wallet.svg");

  useEffect(() => {
    const label = address ? getMaskedAddress(address) : "Connect Wallet";
    setWalletLabel(label);

    const walletIcon = address ? path : "/icons/wallet.svg";
    setIconPath(walletIcon);
  }, [address]);

  return (
    <HideOnScrollBar>
      <Navigation>
        <NavigationContainer>
          <Contents>
            <Image
              src="/images/rns-logo.svg"
              alt="RNS Icon"
              width={260}
              height={30}
            />
            <ToolbarContainer>
              <WalletButton
                variant="contained"
                onClick={() => {
                  toggleModal({
                    title: "Choose your Wallet",
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
              </WalletButton>
            </ToolbarContainer>
          </Contents>
        </NavigationContainer>
      </Navigation>
    </HideOnScrollBar>
  );
};

export default NavigationBar;
