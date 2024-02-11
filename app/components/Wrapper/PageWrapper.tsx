"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import { Provider } from "react-redux";

import { WagmiProvider } from "wagmi";
import { config } from "@/services/config";

import store from "@/redux/store";
import PageNavigation from "@/components/Navigation/NavigationBar";
import PageModal from "@/components/Modal/ModalContainer";
import GlobalTheme from "../Theme/Global";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/700.css";

const WrapperContainer = styled(Grid)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.paper,
}));

export interface WrapperProps {
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
  const { children } = props;
  return (
    <WagmiProvider config={config}>
      <Provider store={store}>
        <GlobalTheme>
          <WrapperContainer>
            <PageNavigation />
            <PageModal />
            {/* TODO: Mount PageModal */}
            {/* TODO: Mount PageSnackbars */}
            {children}
            {/* TODO: Add PageFooter */}
          </WrapperContainer>
        </GlobalTheme>
      </Provider>
    </WagmiProvider>
  );
};

export default PageWrapper;
