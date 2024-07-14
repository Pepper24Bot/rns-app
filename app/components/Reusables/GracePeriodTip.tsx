import React from "react";
import { FieldContainer, Tip, WarningIcon } from "../Theme/StyledGlobal";
import { alpha, styled } from "@mui/material";
import { amber } from "@mui/material/colors";
import { getExpiry, isInGracePeriod } from "@/utils/common";

const HighlightTip = styled("span")(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const GraceTip = styled(Tip)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.4),
  textAlign: "start",
  width: "100%",
  paddingLeft: "8px",

  [theme.breakpoints.down("md")]: {
    fontSize: "12px",
  },
}));

const GraceContainer = styled(FieldContainer)(({ theme }) => ({
  backgroundColor: alpha(amber[600], 0.05),
  border: `solid 1px ${alpha(amber[800], 0.25)}`,
  marginTop: 0,
  padding: "12px",
}));

interface GracePeriodProps {
  expiryDate?: string;
  gracePeriod?: string;
  content?: string;
}

export const GracePeriodTip: React.FC<GracePeriodProps> = (
  props: GracePeriodProps
) => {
  const { expiryDate, gracePeriod, content } = props;
  const { remainingGrace } = getExpiry(expiryDate, gracePeriod);
  const inGracePeriod = isInGracePeriod(gracePeriod);

  return inGracePeriod ? (
    <GraceContainer>
      <WarningIcon />
      <GraceTip>
        The grace period for this identity will end on
        <HighlightTip> {remainingGrace.label}</HighlightTip>.{" "}
        {content
          ? content
          : "When the identity is not extended before the grace period ends, it will be available for registration."}
      </GraceTip>
    </GraceContainer>
  ) : (
    <></>
  );
};

export default GracePeriodTip;
