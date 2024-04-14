import React from "react";
import { Grid, styled, IconButton, alpha } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexLeft,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { KeyboardBackspace } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";

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
          value={futurePassInput}
        />
      </Grid>
    </Grid>
  );
};

export default RemoveAddress;
