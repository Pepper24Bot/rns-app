import { FONT_WEIGHT } from "@/components/Theme/Global";
import {
  SecondaryLabel,
  ButtonLabel,
  TooltipContainer,
} from "@/components/Theme/StyledGlobal";
import {
  MoreVert,
  CheckCircle,
  AccessTime,
  Key,
  CropOriginal,
  SwapHoriz,
  Download,
  Link,
  X,
} from "@mui/icons-material";
import {
  Grid,
  darken,
  alpha,
  Chip,
  styled,
  Divider as MuiDivider,
} from "@mui/material";
import { grey, green, yellow, red, amber } from "@mui/material/colors";

export const Container = styled(Grid)(({ theme }) => ({
  background: "linear-gradient(180deg, #0C0C0C 50%, rgba(194,24,91,0.75) 100%)",
  borderRadius: "8px",
  padding: "1px",
}));

export const ItemContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: `0px 0px 25px 0px ${darken(grey[900], 1)}`,
}));

export const ImageContainer = styled(Grid)(({ theme }) => ({
  padding: "20px",
}));

export const RnsName = styled(Grid)(({ theme }) => ({
  position: "relative",
  bottom: "40px",
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),
  padding: "8px",
}));

export const RnsNameText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.5),
  textAlign: "center",
  textOverflow: "ellipsis",
  overflow: "hidden",
}));

export const Summary = styled(Grid)(({ theme }) => ({
  padding: "20px 15px 20px 25px",
}));

export const SubContainer = styled(Summary)(({ theme }) => ({
  padding: "10px 20px 20px 20px",
}));

export const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.primary.main, 0.2),
}));

export const NameDetails = styled(Grid)(({ theme }) => ({
  paddingTop: "12px",
}));

export const NameContainer = styled(TooltipContainer)(({ theme }) => ({
  fontSize: "20px",
}));

export const Detail = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.85),
  fontSize: "14px",
  paddingTop: "2px",
}));

export const Label = styled("span")(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.25),
  paddingRight: "8px",
}));

export const TooltipText = styled(Detail)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.5),
  paddingTop: 0,
  fontSize: "12px",
  whiteSpace: "pre-line",
}));

export const MoreIcon = styled(MoreVert)(({ theme }) => ({}));

export const CheckedIcon = styled(CheckCircle, {
  shouldForwardProp: (prop) => prop !== "hidden",
})<{ hidden?: boolean }>(({ hidden, theme }) => ({
  color: green[500],
  width: "16px",
  height: "16px",
  visibility: hidden ? "hidden" : "visible",
  margin: "0 4px",
  cursor: "pointer",
}));

export const ClockIcon = styled(AccessTime)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
}));

export const LinkIcon = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
  transform: "rotate(-40deg)",
}));

export const PrimaryIcon = styled(Key)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
}));

export const PhotoIcon = styled(CropOriginal)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "18px",
  height: "18px",
  marginRight: "10px",
}));

export const TransferIcon = styled(SwapHoriz)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "20px",
  height: "20px",
  marginRight: "6px",
}));

export const DownloadIcon = styled(Download)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "20px",
  height: "20px",
  marginRight: "6px",
}));

export const ShareLabel = styled(SecondaryLabel)(({ theme }) => ({
  padding: "6px 10px",
  textTransform: "uppercase",
  fontWeight: FONT_WEIGHT.Bold,
}));

export const Verifying = styled(ButtonLabel)(({ theme }) => ({
  padding: "8px 12px",
  color: yellow[800],
}));

export const Verified = styled(Verifying)(({ theme }) => ({
  color: green[800],
}));

export const Failed = styled(Verifying)(({ theme }) => ({
  color: red[600],
}));

export const TwitterIcon = styled(X)(({ theme }) => ({
  margin: "6px 8px",
  fontSize: "16px",
}));

export const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const PrimaryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: amber[500],
  color: theme.palette.background.paper,
}));

export const EnsImageCard = styled("img")(({ theme }) => ({
  width: "-webkit-fill-available",
  height: "-webkit-fill-available",

  border: `solid 1px ${alpha(grey[800], 0.25)}`,
  borderRadius: "4px",
  boxShadow: `0px 0px 20px 0px ${darken(grey[900], 1)}`,

  "@supports (-moz-appearance:none)": {
    width: "-moz-available",
    height: "-moz-available",
  },
}));
