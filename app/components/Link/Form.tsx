import React, { useState } from "react";
import { Grid, CircularProgress, styled } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
} from "../Theme/StyledGlobal";
import { Address } from "viem";
import { useDomainState } from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";
import useRecords from "@/hooks/useRecords";

export const Form: React.FC = () => {
  const { address } = useAccount();
  const { closeModal } = useModalState();
  const { useDomain } = useDomainState();
  const { name = "" } = useDomain();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [futurePassAddr, setFuturePassAddr] = useState<string>("");

  const { setFuturePass } = useRecords({});

  const handleSetFuturePass = async () => {
    setIsPending(true);

    if (futurePassAddr) {
      const { isSuccess, error } = await setFuturePass({
        owner: address as Address,
        futurePassAddress: futurePassAddr as Address,
        resolverAddress: "0xadf27dd9c31ab734f06bb5bd2d6b04eb10e4b5d5", // temp - just for the sake of setting up
      });
    }

    // if (isSuccess) {
    //   closeModal();
    // }

    setIsPending(false);
  };

  return (
    <Grid item xs>
      <Grid>
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
              handleSetFuturePass();
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
