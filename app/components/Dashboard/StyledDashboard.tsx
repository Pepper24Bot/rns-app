import { Grid, Tab, alpha, styled, Tabs as MuiTabs } from "@mui/material";
import { FONT_SIZE } from "../Theme/Global";
import {
  FlexCenter,
  BaseInputField,
  BaseIconButton,
  Heading,
} from "../Theme/StyledGlobal";
import { Search as MuiSearchIcon } from "@mui/icons-material";

export const Container = styled(FlexCenter)(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.background.darker, 0.35),
  marginBottom: "10px",
}));

export const DashboardContainer = styled(Grid)(({ theme }) => ({
  maxWidth: "1400px",
  width: "100%",
  padding: "30px 80px",

  [theme.breakpoints.down("sm")]: {
    padding: "30px 40px",
  },
}));

export const Content = styled(Grid)(({ theme }) => ({
  marginTop: "30px",
}));

export const Toolbar = styled(Grid)(({ theme }) => ({
  paddingTop: "10px",
}));

export const SearchField = styled(BaseInputField)(({ theme }) => ({
  ".MuiInputBase-input": {
    padding: "10px 16px 10px 25px",
  },

  ".MuiInputBase-root": {
    backgroundColor: theme.palette.background.darker,
  },

  "&.MuiFormControl-root": {
    width: "100%",
  },
}));

export const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

export const IconButton = styled(BaseIconButton)(({ theme }) => ({
  marginLeft: "8px",
}));

export const Title = styled(Heading)(({ theme }) => ({
  fontSize: "36px",

  [theme.breakpoints.down("lg")]: {
    fontSize: FONT_SIZE.Xlarge,
  },
}));

export const Tabs = styled(MuiTabs)(({ theme }) => ({
  borderBottom: `solid 1px ${alpha(theme.palette.text.primary, 0.25)}`,

  "&.MuiTabs-root": {
    minHeight: 0,
  },
}));

export const TabItem = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.primary,

  "&.MuiTab-root": {
    padding: "8px 30px",
    backgroundColor: alpha(theme.palette.primary.dark, 0.05),
    fontSize: "16px",
    fontFamily: "var(--secondary-font)",
    minHeight: 0,

    "&:not(:first-of-type)": {
      borderLeft: `solid 2px ${theme.palette.background.paper}`,
    },

    "&:first-of-type": {
      borderRadius: "8px 0 0 0",
    },

    "&:last-child": {
      borderRadius: "0 8px 0 0",
    },

    "&.Mui-selected": {
      color: theme.palette.text.primary,
      backgroundColor: alpha(theme.palette.primary.dark, 0.5),
    },
  },
}));
