import React from "react";
import { Grid, styled, alpha, Collapse } from "@mui/material";
import {
  ModalInputField as InputField,
  ActionButton,
  Flex,
} from "../Theme/StyledGlobal";
import { CheckCircle, Close, Edit } from "@mui/icons-material";
import { green } from "@mui/material/colors";

const ResolverButton = styled(ActionButton)(({ theme }) => ({
  "&.MuiButton-contained": {
    border: "none",
    borderRadius: "4px",
    backgroundColor: theme.palette.primary.dark,
    padding: "8px",

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.dark, 0.5),
    },
  },
}));

const CheckedIcon = styled(CheckCircle)(({ theme }) => ({
  color: green[500],
  width: "24px",
  height: "24px",
  position: "absolute",
  top: "-8px",
  right: "-8px",
  zIndex: 2,
}));

export interface UpdateProps {
  name?: string;
  owner?: string;
  isUpdateEnabled?: boolean;
  toggleEditMode: () => void;
  toggleRemoveMode: () => void;

  isFuturePassValid?: boolean;
  futurePassInput: string;
  updateAddressInput: (value: string) => void;
}

export const UpdateRecord: React.FC<UpdateProps> = (props: UpdateProps) => {
  const {
    name = "",
    owner = "",
    futurePassInput = "",
    isUpdateEnabled = false,
    isFuturePassValid = false,
    toggleEditMode,
    toggleRemoveMode,
    updateAddressInput,
  } = props;

  return (
    <Grid>
      <InputField disabled value={name} />
      <InputField
        label="Owner"
        disabled
        // focused
        value={owner}
        InputProps={{
          endAdornment: <CheckedIcon />,
        }}
      />
      <InputField
        error={!isFuturePassValid}
        helperText={
          !isFuturePassValid ? "Please insert a FuturePass Address only" : ""
        }
        focused
        label="Linked To / Resolver"
        value={futurePassInput}
        onChange={(event) => {
          const { value } = event.target;
          if (isUpdateEnabled) {
            updateAddressInput(value);
          }
        }}
        InputProps={{
          endAdornment: (
            <Flex>
              <ResolverButton
                sx={{ marginRight: 1 }}
                variant="contained"
                onClick={() => {
                  toggleEditMode();
                }}
              >
                <Edit />
              </ResolverButton>
              <Collapse
                style={{ height: "auto" }}
                orientation="horizontal"
                in={!isUpdateEnabled}
              >
                <ResolverButton
                  disabled={isUpdateEnabled}
                  variant="contained"
                  onClick={() => {
                    toggleRemoveMode();
                  }}
                >
                  <Close />
                </ResolverButton>
              </Collapse>
            </Flex>
          ),
        }}
      />
    </Grid>
  );
};

export default UpdateRecord;
