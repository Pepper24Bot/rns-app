import React, { useState } from "react";
import { Grid, CircularProgress, styled } from "@mui/material";
import {
  InputField as StyledInputField,
  FlexRight,
  ActionButton,
} from "../Theme/StyledGlobal";
import { Address } from "viem";
import { useDomainState } from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import useLinkName from "@/hooks/useLinkName";

const InputField = styled(StyledInputField)(({ theme }) => ({
  ".MuiInputBase-root": {
    "&.MuiOutlinedInput-root": {
      fontSize: "16px",
      fontWeight: 200,
      padding: "16px 25px",
      color: theme.palette.text.primary,
    },
  },
  maxWidth: "350px",

  "&:not(:first-of-type)": {
    marginTop: "20px",
  },
}));

export const Form: React.FC = () => {
  const { closeModal } = useModalState();
  const { useDomain } = useDomainState();
  const { name = "" } = useDomain();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [futurePassAddr, setFuturePassAddr] = useState<string>("");

  const { setOwner } = useLinkName({});

  const handleLinkName = async () => {
    setIsPending(true);

    const { isSuccess, error } = await setOwner({
      name,
      address: futurePassAddr as Address,
    });

    if (isSuccess) {
      closeModal();
    }

    setIsPending(false);
  };

  return (
    <Grid item xs>
      <Grid maxWidth={350}>
        <InputField disabled value={name} />
        <InputField
          label="FuturePass Address"
          placeholder="Enter FuturePass Address"
          focused
          value={futurePassAddr}
          onChange={(event) => {
            const { value } = event.target;
            setFuturePassAddr(value);
          }}
        />
      </Grid>
      <Grid mt={3}>
        <FlexRight>
          <ActionButton
            sx={{ marginRight: 1 }}
            variant="text"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={() => {
              handleLinkName();
            }}
          >
            {isPending && (
              <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
            )}
            Confirm
          </ActionButton>
        </FlexRight>
      </Grid>
    </Grid>
  );
};
