import {
  Divider as MuiDivider,
  Grid,
  alpha,
  darken,
  styled,
} from "@mui/material";
import { FONT_WEIGHT } from "../../../Theme/Global";
import {
  FlexCenter,
  SecondaryLabel,
  FlexJustified,
} from "../../../Theme/StyledGlobal";

export const Container = styled(Grid)(({ theme }) => ({}));

export const TopContainer = styled(FlexCenter)(({ theme }) => ({
  padding: "16px",
  borderRadius: "60px",
  border: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,
  backgroundColor: theme.palette.background.paper,
  textAlign: "center",
  filter: `drop-shadow(0px 5px 10px ${theme.palette.background.paper})`,
  cursor: "pointer",
  margin: "0 8px 8px 8px",
  "&:hover": {
    border: `solid 1px ${darken(theme.palette.primary.main, 0.35)}`,
  },
}));

export const TopTotalCount = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "30px",
  fontWeight: FONT_WEIGHT.Bold,
}));

export const Header = styled(FlexJustified)(({ theme }) => ({
  padding: "16px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.05),
  border: `solid 1px ${darken(theme.palette.primary.main, 0.4)}`,
}));

export const OwnerContainer = styled(Header)(({ theme }) => ({
  border: `solid 1px ${darken(theme.palette.primary.main, 0.4)}`,
}));

export const ColumnTitle = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Bold,
}));

export const ColumnContainer = styled(Grid)(({ theme }) => ({
  borderRadius: "4px",
  margin: "4px 8px",
}));

export const ColumnContent = styled(Grid)(({ theme }) => ({
  // padding: "16px",
  // borderBottom: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,
  // borderLeft: `solid 1px ${darken(theme.palette.primary.main, 0.75)}`,

  maxHeight: "600px",
  padding: 0,
  border: "none",
  paddingRight: "8px",

  overflowY: "scroll",
  overscrollBehavior: "contain",

  "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.background.paper,
  },

  "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
    backgroundColor: darken(theme.palette.primary.main, 0.85),
  },
}));

export const Row = styled(FlexJustified)(({ theme }) => ({
  alignItems: "center",
  padding: "8px",
  margin: "8px 0",
  borderRadius: "4px",
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${darken(theme.palette.primary.main, 0.85)}`,

  "&:hover": {
    border: `solid 1px ${darken(theme.palette.primary.main, 0.35)}`,
  },
}));

export const RowText = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "isPrimary",
})<{ isPrimary?: boolean }>(({ theme, isPrimary }) => ({
  fontSize: "16px",
  color: isPrimary ? theme.palette.primary.main : theme.palette.text.primary,
}));

export const TopHolder = styled(RowText)(({ theme, isPrimary }) => ({
  color: isPrimary
    ? theme.palette.primary.main
    : alpha(theme.palette.text.primary, 0.75),
}));

export const HighlightValue = styled(RowText)(({ theme }) => ({
  fontSize: "32px",
  color: darken(theme.palette.primary.main, 0.5),
  textAlign: "center",
}));

export const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "24px 0",
  // backgroundColor: theme.palette.primary.dark,

  "&.MuiDivider-root::after": {
    borderColor: alpha(theme.palette.primary.dark, 0.5),
  },
  "&.MuiDivider-root::before": {
    borderColor: alpha(theme.palette.primary.dark, 0.5),
  },
}));
