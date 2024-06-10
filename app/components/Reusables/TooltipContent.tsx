import React from "react";
import { getHighlight, getHighlightedTexts } from "@/utils/common";
import { Grid, Link, alpha, styled } from "@mui/material";
import { FONT_WEIGHT } from "../Theme/Global";
import { Flex, HighlightText } from "../Theme/StyledGlobal";

const InfoTip = styled(Grid)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.5),
  fontSize: "12px",
  whiteSpace: "pre-line",

  [theme.breakpoints.down(600)]: {
    minWidth: "100px",
    maxWidth: "200px",
  },
}));

interface TooltipProps {
  heading?: string;
  icons?: {
    heading?: React.ReactNode;
  };
  content?: string;
  highlights?: { text: string; isUrl?: boolean }[];
  /**
   * Default value is true,
   * set to false to deactivate getting the highlights
   */
  isEnabled?: boolean;

  wordBreak?: "break-word" | "break-all" | "normal" | "keep-all";
  maxWidth?: string;
  minWidth?: string;
}

/**
 * TODO: Memoize this
 * @param props
 * @returns
 */
export const TooltipContent: React.FC<TooltipProps> = (props: TooltipProps) => {
  const {
    content = "",
    highlights,
    isEnabled = true,
    icons,
    heading,
    wordBreak = "normal",
    maxWidth = "350px",
    minWidth = "50px",
  } = props;

  const highlightedTexts = getHighlightedTexts(content, highlights);

  return isEnabled ? (
    <InfoTip sx={{ wordBreak, maxWidth, minWidth }}>
      {heading && (
        <Flex pb={2} textTransform="uppercase">
          {icons?.heading && <Grid mr={1}>{icons?.heading}</Grid>}
          <HighlightText>{heading}</HighlightText>
        </Flex>
      )}
      {highlightedTexts?.map((text, index) => {
        const highlight = getHighlight(text, highlights);

        return highlight && highlight.isUrl ? (
          <Link key={`link-${text}-${index}`} href={text} target="_blank">
            <HighlightText>{text}</HighlightText>
          </Link>
        ) : highlight && !highlight.isUrl ? (
          <HighlightText key={`link-${text}-${index}`}>{text}</HighlightText>
        ) : (
          text && <span key={`span-${index}`}>{text}</span>
        );
      })}
    </InfoTip>
  ) : (
    <></>
  );
};

export default TooltipContent;
