"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import { Provider } from "react-redux";

import { WagmiProvider } from "wagmi";
import { config } from "@/chains/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import store from "@/redux/store";
import PageNavigation from "@/components/Navigation/NavigationBar";
import PageModal from "@/components/Modal/ModalContainer";
import GlobalTheme from "../Theme/Global";
import PageFooter from "../Footer/PageFooter";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

import "@fontsource/roboto-mono/200.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/700.css";

const queryClient = new QueryClient();

const WrapperContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const ContentContainer = styled(Grid)(({ theme }) => ({
  minHeight: "calc(100vh - 198px)",
}));

export interface WrapperProps {
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
  const { children } = props;
  return (
    <WagmiProvider config={config}>
      {/* Tanstack Provider - Server side and needed by wagmi */}
      <QueryClientProvider client={queryClient}>
        {/* RTK Query Provider - Client side State Management */}
        <Provider store={store}>
          <GlobalTheme>
            <WrapperContainer>
              <ContentContainer>
                <PageNavigation />
                <PageModal />
                {/* TODO: Mount PageSnackbars */}
                {children}
              </ContentContainer>
              <PageFooter />
            </WrapperContainer>
          </GlobalTheme>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default PageWrapper;
