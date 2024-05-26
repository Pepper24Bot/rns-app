import React from "react";
import { MaterialDesignContent, SnackbarProvider } from "notistack";
import { CheckCircle, Cancel, Info, Warning } from "@mui/icons-material";
import { darken, alpha, styled } from "@mui/material";
import { green, red, yellow } from "@mui/material/colors";

const CustomSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
  "&.notistack-MuiContent-success": {
    maxWidth: "400px",
    backgroundColor: darken(green[900], 0.9),
    borderRadius: "8px 0 0 8px",
    border: `solid 1px ${alpha(green[700], 0.6)}`,
    fontFamily: "var(--secondary-font)",
    fontSize: "14px",
  },
  "&.notistack-MuiContent-error": {
    maxWidth: "400px",
    backgroundColor: darken(red[800], 0.9),
    borderRadius: "8px 0 0 8px",
    border: `solid 1px ${alpha(red[700], 0.6)}`,
    fontFamily: "var(--secondary-font)",
    fontSize: "14px",
  },
  "&.notistack-MuiContent-warning": {
    maxWidth: "400px",
    backgroundColor: darken(yellow[900], 0.95),
    borderRadius: "8px 0 0 8px",
    border: `solid 1px ${alpha(yellow[800], 0.5)}`,
    fontFamily: "var(--secondary-font)",
    fontSize: "14px",
  },
  "&.notistack-MuiContent-info": {
    maxWidth: "400px",
    backgroundColor: darken(theme.palette.primary.dark, 0.9),
    borderRadius: "8px 0 0 8px",
    border: `solid 1px ${theme.palette.primary.dark}`,
    fontFamily: "var(--secondary-font)",
    fontSize: "14px",
  },
}));

const CheckCircleIcon = styled(CheckCircle)(({ theme }) => ({
  color: green[600],
  height: "18px",
  width: "18px",
  marginRight: "12px",
}));

const ErrorIcon = styled(Cancel)(({ theme }) => ({
  color: red[600],
  height: "18px",
  width: "18px",
  marginRight: "12px",
}));

const InfoIcon = styled(Info)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: "18px",
  width: "18px",
  marginRight: "12px",
}));

const WarningIcon = styled(Warning)(({ theme }) => ({
  color: yellow[800],
  height: "18px",
  width: "18px",
  marginRight: "12px",
}));

interface SnackbarProps {
  children?: React.ReactNode;
}

export const SnackbarWrapper: React.FC<SnackbarProps> = (
  props: SnackbarProps
) => {
  const { children } = props;

  return (
    <SnackbarProvider
      maxSnack={5}
      transitionDuration={{
        enter: 300,
        exit: 200,
      }}
      autoHideDuration={8000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      Components={{
        success: CustomSnackbar,
        error: CustomSnackbar,
        info: CustomSnackbar,
        warning: CustomSnackbar,
      }}
      iconVariant={{
        success: <CheckCircleIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarWrapper;
