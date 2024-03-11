import React, { useEffect } from "react";
import {
  useScrollTrigger,
  styled,
  Slide,
  AppBar as MuiAppBar,
  alpha,
  Grid,
} from "@mui/material";
import { FlexCenter, FlexJustified } from "../Theme/StyledGlobal";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";

import Image from "next/image";
import Toolbar from "./Toolbar";
import useNetworkConfig from "@/hooks/useNetworkConfig";

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
  borderRadius: "8px",
  border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
  margin: "10px",
}));

const Contents = styled(FlexJustified)(({ theme }) => ({
  maxWidth: "1420px",
  width: "100%",
  padding: "0 40px",

  [theme.breakpoints.down("sm")]: {
    padding: "0 20px",
    justifyContent: "center",
  },
}));

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
  const { address, chainId } = useAccount();
  const { toggleModal, closeModal } = useModalState();
  const { config } = useNetworkConfig();

  // TODO: Mount this somewhere else
  useEffect(() => {
    if (chainId !== undefined && chainId !== config.id) {
      toggleModal({
        id: "Switch Network",
        title: "Switch Network",
        isCloseDisabled: true,
      });
    } else {
      closeModal();
    }
  }, [chainId, address]);

  return (
    <HideOnScrollBar>
      <Navigation>
        <NavigationContainer>
          <Contents container>
            <Image
              src="/images/rns-logo.svg"
              alt="RNS Icon"
              width={260}
              height={30}
              style={{
                height: "-webkit-fill-available",
                width: "-webkit-fill-available",
                maxWidth: "260px",
                padding: "10px 0",
              }}
            />
            <Toolbar />
          </Contents>
        </NavigationContainer>
      </Navigation>
    </HideOnScrollBar>
  );
};

export default NavigationBar;
