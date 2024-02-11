"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import { Provider } from "react-redux";
import store from "@/redux/store";

import GlobalTheme from "../Theme/Global";

const WrapperContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
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
          {/* TODO: Add PageNavigation */}
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
