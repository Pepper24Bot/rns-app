import React from "react";
import { getHighlight, getHighlightedTexts } from "@/utils/common";
import { Grid, Link, alpha, styled } from "@mui/material";
import { FONT_WEIGHT } from "../Theme/Global";
import { HighlightText, SecondaryLabel } from "../Theme/StyledGlobal";

const InfoTip = styled(SecondaryLabel)(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.5),
  fontSize: "12px",
  whiteSpace: "pre-line",
}));

const Highlight = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

interface TooltipProps {
  content: string;
  highlights: { text: string; isUrl?: boolean }[];
  /**
   * Default value is true,
   * set to false to deactivate getting the highlights
   */
  isEnabled?: boolean;
}

/**
 * TODO: Memoize this
 * @param props
 * @returns
 */
export const TooltipContent: React.FC<TooltipProps> = (props: TooltipProps) => {
  const { content, highlights, isEnabled = true } = props;

  const highlightedTexts = getHighlightedTexts(content, highlights);

  return isEnabled ? (
    <Grid>
      <InfoTip>
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
    </Grid>
  ) : (
    <></>
  );
};

export default TooltipContent;
