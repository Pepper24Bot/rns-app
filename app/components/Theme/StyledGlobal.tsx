import {
  Button,
  Grid,
  alpha,
  styled,
  Divider as MuiDivider,
  Typography,
  TextField,
  IconButton,
  Skeleton,
  Theme,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { FONT_SIZE, FONT_WEIGHT } from "./Global";

export const Relative = styled(Grid)(({ theme }) => ({
  position: "relative",
}));

export const Flex = styled(Grid, {
  shouldForwardProp: (prop) => prop !== "isloading",
})<{ isloading?: boolean }>(({ isloading = false }) => ({
  display: !isloading ? "flex" : "none",
  alignItems: "center",
}));

export const FlexJustified = styled(Flex)(({ theme }) => ({
  justifyContent: "space-between",
}));

export const FlexEven = styled(Flex)(({ theme }) => ({
  justifyContent: "space-evenly",
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

  "&.MuiButton-text": {
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },
  },
}));

export const ActionButton = styled(BaseButton)(({ theme }) => ({
  "&.MuiButtonBase-root": {
    filter: `drop-shadow(0px 0px 10px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,
  },
  "&.MuiButton-contained": {
    border: `solid 1px ${alpha(grey[50], 0.15)}`,
  },
  "&.MuiButton-text": {
    color: "white",
    border: "none",
    padding: "8px 16px",

    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },
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
    fontFamily: "var(--default-font)",
  },

  "&.MuiButton-text": {
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },
  },
}));

export const SocialButton = styled(ToolbarButton)(({ theme }) => ({
  textTransform: "capitalize",
  marginLeft: "5px",
  "&.MuiButtonBase-root": {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    border: `solid 1px ${theme.palette.primary.main}`,
    height: "40px",
    width: "50px",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export const BaseIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.darker,
  borderRadius: "8px",
  padding: "10px",
}));

export const HighlightText = styled("span")(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color: theme.palette.text.primary,
}));

export const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: "4px 30px",
  borderColor: alpha(theme.palette.primary.main, 0.2),
}));

export const Description = styled(Grid)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  textAlign: "center",
  fontSize: "12px",
  fontWeight: FONT_WEIGHT.Light,
  color: theme.palette.secondary.main,
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--default-font)",
  fontSize: "24px",
  fontWeight: FONT_WEIGHT.Bold,
  textAlign: "center",
  marginBottom: "20px",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Large,
  },
}));

export const SubTitle = styled(Title)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Light,
  letterSpacing: "normal",
}));

export const Heading = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--secondary-font)",
  fontSize: "36px",
  fontWeight: FONT_WEIGHT.Bold,
}));

export const BaseInputField = styled(TextField)(({ theme }) => ({
  ".MuiInputBase-input": {
    padding: "0",

    "&.Mui-disabled": {
      WebkitTextFillColor: theme.palette.text.primary,
    },
  },

  ".MuiInputBase-root": {
    borderRadius: "8px",

    "&.MuiFilledInput-root": {
      backgroundColor: theme.palette.background.darker,
      "&::before": {
        border: "none",
      },
      "&::after": {
        border: "none",
        transition: "none", // disable animation
      },
      "&:hover": {
        backgroundColor: alpha(theme.palette.background.dark, 0.5),
        "&::before": {
          border: "none",
          transition: "none", // disable animation
        },
      },
    },

    "&.MuiOutlinedInput-root": {
      fontStyle: "italic",
      fontFamily: "var(--default-font)",
      fontSize: "18px",
      padding: "16px 25px",

      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },

      "& fieldset": {
        borderColor: theme.palette.primary.dark,
        "& legend": {
          fontSize: "16px",
        },
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.75),
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
  },
}));

export const InputField = styled(BaseInputField)(({ theme }) => ({
  "&.MuiFormControl-root": {
    width: "100%",
    "& .MuiFormLabel-root": {
      "&.MuiInputLabel-root": {
        fontSize: "18px",
        color: alpha(theme.palette.text.primary, 0.5),
      },
    },
  },
  ".MuiInputBase-root": {
    backgroundColor: alpha(theme.palette.primary.dark, 0.15),
    borderRadius: "8px",

    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },

    "&.MuiOutlinedInput-root": {
      fontStyle: "normal",
      fontFamily: "var(--secondary-font)",
      fontSize: "14px",
      padding: "10px 25px",

      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
      "&.Mui-focused fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
  },
}));

export const ModalInputField = styled(InputField)(({ theme }) => ({
  ".MuiInputBase-root": {
    [theme.breakpoints.down("md")]: {
      fontSize: "14px",
    },

    "&.MuiOutlinedInput-root": {
      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },

      fontSize: "16px",
      fontWeight: FONT_WEIGHT.Light,
      padding: "16px 25px",
      color: theme.palette.text.primary,
    },
  },

  "&:not(:first-of-type)": {
    marginTop: "20px",
  },
}));

export const FieldContainer = styled(FlexJustified)(({ theme }) => ({
  borderRadius: "8px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.15),
  border: `solid 1px ${alpha(theme.palette.primary.main, 0.5)}`,
  marginTop: "10px",
  padding: "16px 25px",
}));

export const SkeletonGeneric = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== "isloading",
})<{ isloading?: boolean }>(({ isloading }) => ({
  display: isloading ? "block" : "none",
  position: "absolute",
}));

export const SkeletonTypography = styled(SkeletonGeneric)(() => ({
  height: "100%",
  width: "100%",
}));

export const SkeletonRectangular = styled(SkeletonGeneric)(() => ({
  minHeight: "30px",
  minWidth: "150px",
  borderRadius: "8px",
}));

export const PrimaryLabel = styled(SubTitle, {
  shouldForwardProp: (prop) => prop !== "isloading",
})<{ isloading?: boolean }>(({ theme, isloading }) => ({
  visibility: isloading ? "hidden" : "visible",
  lineHeight: "normal",
  textAlign: "start",
  marginBottom: 0,
  fontWeight: FONT_WEIGHT.Regular,
  color: theme.palette.text.primary,

  [theme.breakpoints.down("md")]: {
    fontSize: "14px",
  },
}));

export const SecondaryLabel = styled(PrimaryLabel, {
  shouldForwardProp: (prop) => prop !== "isloading",
})<{ isloading?: boolean }>(({ theme, isloading }) => ({
  fontFamily: "var(--secondary-font)",
}));

export const InformationTip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    padding: 8,
    filter: `drop-shadow(0px 1px 1px rgb(0, 0, 0, 0.5))`,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.paper,
    fontSize: (theme as Theme).typography.pxToRem(16),
    filter: `drop-shadow(-1px 0px 0px rgb(0, 0, 0, 0.25))`,
  },
}));

export const AvailableText = styled(SecondaryLabel)(({ theme }) => ({
  color: "#24FF00",
  textTransform: "uppercase",
  fontSize: "14px",

  [theme.breakpoints.down("md")]: {
    fontSize: FONT_SIZE.Small,
  },
}));

export const NotAvailableText = styled(AvailableText)(({ theme }) => ({
  color: "#FF0000",
}));

export const RegisteredText = styled(AvailableText)(({ theme }) => ({
  color: theme.palette.primary.main,
}));
