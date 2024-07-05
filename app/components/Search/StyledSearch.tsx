import {
  Grid,
  alpha,
  styled,
  Popper as MuiPopper,
  Divider as MuiDivider,
} from "@mui/material";
import { Search as MuiSearchIcon } from "@mui/icons-material";
import {
  BaseButton,
  BaseIconButton,
  SubTitle,
  SecondaryLabel,
  ActionButton,
  BaseInputField,
  Title,
} from "../Theme/StyledGlobal";

import Image from "next/image";

import { Star, StarBorder } from "@mui/icons-material";
import { FONT_WEIGHT, FONT_SIZE } from "../Theme/Global";

export const Popper = styled(MuiPopper)(({ theme }) => ({
  zIndex: 15,
  marginTop: "5px !important", //override inline styling
  width: "100%",
}));

export const SearchText = styled(SubTitle)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  marginBottom: 0,
  textAlign: "start",
  wordBreak: "break-word",
  fontFamily: "var(--secondary-font)",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Medium,
  },
}));

export const PopperContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  padding: "20px",
  borderRadius: "0 0 8px 8px",

  [theme.breakpoints.down("md")]: {
    padding: "10px 15px 15px",
  },
}));

export const ButtonsContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    paddingTop: "20px",
  },
}));

export const SearchButton = styled(BaseButton)(({ theme }) => ({
  textTransform: "uppercase",
  marginLeft: "10px",

  "&.MuiButtonBase-root": {
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,

    "&.MuiButton-contained": {
      backgroundColor: theme.palette.primary.dark,
      "&.Mui-disabled": {
        backgroundColor: alpha(theme.palette.primary.dark, 0.25),
      },
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
  },
}));

export const SearchLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  fontSize: "14px",
  padding: "4px 0",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Small,
  },
}));

export const FavoriteButton = styled(BaseIconButton)(({ theme }) => ({
  borderRadius: "32px",
  padding: "4px",
  backgroundColor: "#161616",
  color: "#FFB800",
  marginLeft: "8px",
}));

export const FavoriteIcon = styled(Star)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

export const StarIcon = styled(StarBorder)(({ theme }) => ({
  height: "20px",
  width: "20px",
}));

export const NextImage = styled(Image)(({ theme }) => ({
  margin: "0 8px",
  cursor: "pointer",
}));

export const Container = styled(Grid)(({ theme }) => ({
  padding: "60px 10px 130px 10px",

  [theme.breakpoints.down("sm")]: {
    padding: "80px 10px 75px 10px",
  },
}));

export const SearchContainer = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(0deg, ${
    theme.palette.background.paper
  } 20%, ${alpha(theme.palette.primary.main, 0.5)} 100%)`,

  // TODO: theme.palette.primary.main -- fix this
  boxShadow: `0px 0px 30px 0px rgba(194,24,91,0.25)`,
  position: "relative",
  width: "100%",
  maxWidth: "800px",
  borderRadius: "16px",

  "&::before": {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
    content: '""',
    background: "linear-gradient(transparent 0%,#000000 100%)",
    boxShadow: `0px 50px 30px 25px rgba(0,0,0)`,
    borderRadius: "16px",
  },
}));

export const Search = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "75px 45px",
  margin: "1px",
  borderRadius: "16px",

  position: "relative",
  zIndex: 2,

  [theme.breakpoints.down("lg")]: {
    padding: "40px 20px",
  },
}));

export const ViewContainer = styled(Grid)(({ theme }) => ({
  textAlign: "center",
  padding: "50px 0",
}));

export const SearchTitle = styled(Title)(({ theme }) => ({
  fontSize: "48px",

  [theme.breakpoints.down("lg")]: {
    fontSize: FONT_SIZE.Xxlarge,
  },
}));

export const SearchField = styled(BaseInputField)(({ theme }) => ({
  marginTop: "50px",
  maxWidth: "500px",
}));

export const SearchIcon = styled(MuiSearchIcon)(({ theme }) => ({
  height: "24px",
  width: "24px",
}));

export const SearchSubText = styled(SubTitle)(({ theme }) => ({
  fontSize: "18px",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Medium,
  },
}));
