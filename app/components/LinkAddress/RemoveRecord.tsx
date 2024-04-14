import React, { useEffect, useState } from "react";
import { Grid, styled, IconButton, alpha } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexLeft,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { KeyboardBackspace } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";
import { EMPTY_ADDRESS } from "@/services/constants";
import { getMaskedAddress } from "@/services/utils";

const ConfirmationLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const ConfirmationText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Light,
}));

export interface RemoveProps {
  toggleRemoveMode: () => void;
  futurePassInput: string;
  disableBack?: boolean;
}

export const RemoveAddress: React.FC<RemoveProps> = (props: RemoveProps) => {
  const { futurePassInput, toggleRemoveMode, disableBack } = props;

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const value =
      futurePassInput === EMPTY_ADDRESS
        ? "None"
        : getMaskedAddress(futurePassInput);
    setValue(value);
  }, [futurePassInput]);

  return (
    <Grid>
      <FlexLeft>
        <IconButton
          disabled={disableBack}
          onClick={() => {
            // Go back to the previous page
            toggleRemoveMode();
          }}
        >
          <KeyboardBackspace />
        </IconButton>
        <ConfirmationLabel>Confirmation</ConfirmationLabel>
      </FlexLeft>
      <Grid pt={4}>
        <ConfirmationText pb={4}>
          Are you sure you want to remove the linked address?
        </ConfirmationText>
        <InputField
          label="Linked To / Resolver"
          disabled
          focused
          value={value}
        />
      </Grid>
    </Grid>
  );
};

export default RemoveAddress;
