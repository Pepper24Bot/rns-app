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
import Link from "./Link";

export const Form: React.FC<Link> = (props: Link) => {
  const { owner, domain } = props;

  const { address } = useAccount();
  const { closeModal } = useModalState();
  const { setFuturePass, error, data, failureReason } = useRecords();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [futurePassAddr, setFuturePassAddr] = useState<string>(
    "0xFfFFFFff00000000000000000000000000038E08"
  );

  const handleSetFuturePass = async () => {
    setIsPending(true);

    if (futurePassAddr && domain?.name) {
      const { isSuccess, error } = await setFuturePass({
        name: domain?.labelName || "",
        // futurePassAddress: futurePassAddr as Address,
        futurePassAddress: "0xFfFFFFff00000000000000000000000000038E08",
        resolverAddress: domain?.resolver?.address,
      });
    }

    // if (isSuccess) {
    //   closeModal();
    // }

    setIsPending(false);
  };

  React.useEffect(() => {
    console.log("ERROR", error, data, failureReason);
  }, [error, data, failureReason]);

  return (
    <Grid item xs>
      <Grid>
        <InputField disabled value={domain?.name} />
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
            Confirm
            {isPending && (
              <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
            )}
          </ActionButton>
        </FlexRight>
      </Grid>
    </Grid>
  );
};
