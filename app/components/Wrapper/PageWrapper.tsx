"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import { Provider } from "react-redux";

import store from "@/redux/store";

import PageNavigation from "@/components/Navigation/NavigationBar";
import GlobalTheme from "../Theme/Global";

const WrapperContainer = styled(Grid)(({ theme }) => ({
  minHeight: "250vh",
  backgroundColor: theme.palette.background.paper,
}));

export interface WrapperProps {
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
  const { children } = props;
  return (
    // TODO: Add WagmiConfig heres
    <Provider store={store}>
      <GlobalTheme>
        <WrapperContainer>
          <PageNavigation />
          {/* TODO: Mount PageModal */}
          {/* TODO: Mount PageSnackbars */}
          {children}
          {/* TODO: Add PageFooter */}
        </WrapperContainer>
      </GlobalTheme>
    </Provider>
  );
};

export default PageWrapper;
