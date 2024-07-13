import { WARNING_ASCII } from "@/constants/content";
import { InputAdornment, styled } from "@mui/material";
import {
  InformationTip,
  PrimaryChip,
  WarningIcon,
} from "../Theme/StyledGlobal";
import React from "react";
import TooltipContent from "./TooltipContent";

export interface AdornmentProps {
  hasNonAscii?: boolean;
  isPrimary?: boolean;
  children?: React.ReactNode;
  position?: "start" | "end";
}

export const Warning = styled(WarningIcon)(({ theme }) => ({
  width: "24px",
  height: "24px",
}));

export const EndAdornment: React.FC<AdornmentProps> = (
  props: AdornmentProps
) => {
  const { children, hasNonAscii, isPrimary, position = "end" } = props;

  return (
    <InputAdornment position="end">
      {position === "start" && children}
      {isPrimary && <PrimaryChip size="small" label="Primary" />}
      <InformationTip
        arrow
        placement="bottom-end"
        title={
          <TooltipContent
            content={WARNING_ASCII.content}
            highlights={WARNING_ASCII.highlights}
            isEnabled={hasNonAscii}
          />
        }
      >
        {hasNonAscii ? (
          <Warning
            sx={{
              mr: position === "end" ? "8px" : "0",
              ml: "8px",
            }}
          />
        ) : (
          <></>
        )}
      </InformationTip>
      {position === "end" && children}
    </InputAdornment>
  );
};

export default EndAdornment;
