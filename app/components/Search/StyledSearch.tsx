import { Grid, alpha, styled, Popper as MuiPopper } from "@mui/material";
import {
  BaseButton,
  BaseIconButton,
  SubTitle,
  SecondaryLabel,
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
