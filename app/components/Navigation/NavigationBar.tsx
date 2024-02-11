import React from "react";
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

import Image from "next/image";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";

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
  const account = useAccount();
  const { toggleModal } = useModalState();

  const isWalletConnected = account.isConnected;
  const walletAddress = account.address;

  console.log("is wallet connected:: ", account.isConnected);

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
                    node: (
                      <Typography>
                        By connecting your wallet, you agree to our Terms of
                        Service and our Privacy Policy.
                      </Typography>
                    ),
                  });
                }}
              >
                <Image
                  src="/icons/wallet.svg"
                  alt="RNS Icon"
                  width={24}
                  height={24}
                  style={{ marginRight: "8px", color: "white" }}
                />
                {isWalletConnected ? walletAddress : "Connect Wallet"}
              </WalletButton>
            </ToolbarContainer>
          </Contents>
        </NavigationContainer>
      </Navigation>
    </HideOnScrollBar>
  );
};

export default NavigationBar;
