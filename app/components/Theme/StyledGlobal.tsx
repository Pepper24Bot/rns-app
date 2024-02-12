import { Button, Grid, alpha, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

export const Flex = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

export const FlexJustified = styled(Flex)(({ theme }) => ({
  justifyContent: "space-between",
}));

export const FlexCenter = styled(Flex)(({ theme }) => ({
  justifyContent: "center",
}));

export const FlexLeft = styled(Flex)(({ theme }) => ({
  justifyContent: "start",
}));

export const BaseButton = styled(Button)(({ theme }) => ({
  textTransform: "capitalize",

  "&.MuiButtonBase-root": {
    borderRadius: "8px",
  },
}));

export const WalletButton = styled(Button)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    filter: `drop-shadow(0px 0px 4px ${alpha(
      theme.palette.primary.dark,
      0.15
    )})`,
    borderRadius: "16px",
    border: `solid 1px ${alpha(grey[50], 0.15)}`,
    fontSize: "14px",
    fontFamily: "Roboto Mono",
  },
}));

export const HighlightText = styled("span")(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));
