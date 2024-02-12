import {
  Button,
  Grid,
  alpha,
  styled,
  Divider as MuiDivider,
} from "@mui/material";
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

export const FlexRight = styled(Flex)(({ theme }) => ({
  justifyContent: "end",
}));

export const BaseButton = styled(Button)(({ theme }) => ({
  textTransform: "capitalize",

  "&.MuiButtonBase-root": {
    borderRadius: "8px",
    minWidth: 0,
  },
}));

export const ActionButton = styled(BaseButton)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    marginTop: "35px",
    border: `solid 1px ${alpha(grey[50], 0.15)}`,
    filter: `drop-shadow(0px 0px 10px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,
  },
}));

export const ToolbarButton = styled(Button)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    minWidth: 0,
    filter: `drop-shadow(0px 0px 4px ${alpha(
      theme.palette.primary.dark,
      0.5
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

export const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "4px 30px",
  borderColor: alpha(theme.palette.primary.main, 0.2),
}));
