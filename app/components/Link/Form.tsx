import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
  FlexCenter,
  Relative,
  BoxContainer,
  Tip,
} from "../Theme/StyledGlobal";
import { Address } from "viem";
import { useModalState } from "@/redux/modal/modalSlice";
import { isAddressFuturePass } from "@/services/utils";
import { useWaitForTransactionReceipt } from "wagmi";

import useRecords from "@/hooks/useRecords";
import Link from "./Link";
import ProgressBar from "../Reusables/ProgressBar";

export const Form: React.FC<Link> = (props: Link) => {
  const { domain } = props;

  const { closeModal } = useModalState();
  const { setAddressRecord } = useRecords();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isFuturePassValid, setIsFuturePassValid] = useState<boolean>(true);
  const [isLinkSuccess, setIsLinkSuccess] = useState<boolean>(false);
  const [isLinkError, setIsLinkError] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [linkHash, setLinkHash] = useState<Address | undefined>(undefined);

  // My FuturePass = "0xFfFFFFff00000000000000000000000000038E08";
  const [futurePassAddr, setFuturePassAddr] = useState<string>("");

  const { data } = useWaitForTransactionReceipt({
    hash: linkHash,
  });

  const handleSetFuturePass = async () => {
    const isValid = isAddressFuturePass(futurePassAddr);
    setIsFuturePassValid(isValid);

    if (futurePassAddr && domain?.name && isValid) {
      setIsProgressVisible(true);
      setIsPending(true);

      // const { isSuccess, error } = await setTextRecord({
      //   name: domain?.labelName || "",
      //   key: "futurepass",
      //   value: futurePassAddr,
      // });

      const { isSuccess, error, data } = await setAddressRecord({
        name: domain?.labelName || "",
        key: "futurepass",
        futurePassAddress: futurePassAddr as Address,
        resolverAddress: domain?.resolver?.address,
      });

      if (isSuccess) {
        setIsPending(false);
        setLinkHash(data);
      } else {
        setIsLinkError(true);
      }
    }
  };

  useEffect(() => {
    if (data?.blockHash) {
      setIsLinkSuccess(true);
    }
  }, [data?.blockHash]);

  return (
    <Grid item xs display="grid" alignContent="space-between">
      <Grid>
        <InputField disabled value={domain?.name} />
        <InputField
          error={!isFuturePassValid}
          helperText={!isFuturePassValid ? "Invalid FuturePass Address" : ""}
          label="FuturePass Address"
          placeholder="Enter FuturePass Address"
          focused
          value={futurePassAddr}
          onChange={(event) => {
            const { value } = event.target;
            setFuturePassAddr(value);
            if (!isFuturePassValid) {
              setIsFuturePassValid(true);
            }
          }}
        />
        <FlexCenter marginY={2.5}>
          <Relative width="100%">
            <BoxContainer isVisible={isProgressVisible}>
              <ProgressBar
                isError={isLinkError}
                isPaused={isPending}
                isVisible={isProgressVisible}
                isSuccess={isLinkSuccess}
              />
            </BoxContainer>
            <FlexCenter>
              <Tip isVisible={isProgressVisible}>View Transaction</Tip>
            </FlexCenter>
          </Relative>
        </FlexCenter>
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
          </ActionButton>
        </FlexRight>
      </Grid>
    </Grid>
  );
};
