import React, { useEffect, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
  FlexCenter,
  Relative,
} from "../Theme/StyledGlobal";
import { Address } from "viem";
import { useModalState } from "@/redux/modal/modalSlice";
import { isEmpty } from "lodash";
import { LinkProps } from "@/interfaces/components/transaction";
import { useEnsAddress, useEnsName } from "wagmi";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";
import useFeatureToggle from "@/hooks/useFeatureToggle";

export const AddRecord: React.FC<LinkProps> = (props: LinkProps) => {
  const { domain, activeAddress } = props;
  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();

  /** Status Flags */
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [isFuturePassValid, setIsFuturePassValid] = useState<boolean>(true);
  const [inputAddr, setInputAddr] = useState<string>("");
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const { refetch } = useEnsName({ address: activeAddress });
  const { refetch: refetchEnsAddr } = useEnsAddress({
    name: domain?.name || "",
  });

  /** Use the isLoading Flag here for the progress bar */
  const { setAddressRecord, isLoading } = useRecords();

  const { isWaiting, isCompleted } = useBlockLatency({
    enabled: isBlockEnabled,
  });

  const isTransactionLoading = isLoading || isWaiting;

  const initializeFlags = () => {
    // display progress bar
    setIsPending(true);
    setIsProgressVisible(true);
    // should always start to 0
    setResetProgress(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsSuccess(false);
  };

  const handleSetAddress = async () => {
    initializeFlags();
    const { isSuccess, data } = await setAddressRecord({
      name: domain?.name || "",
      address: inputAddr as Address,
    });

    if (isSuccess) {
      setIsBlockEnabled(true);
      setTxHash(data.hash);
    } else {
      setIsError(true);
    }

    setResetProgress(false);
    setIsPending(false);
  };

  useEffect(() => {
    if (isCompleted) {
      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isCompleted]);

  return (
    <Grid item xs>
      <Grid>
        <InputField disabled value={domain?.name} />
        <InputField
          error={!isFuturePassValid}
          helperText={
            !isFuturePassValid ? "Please insert a FuturePass Address only" : ""
          }
          label="Address"
          placeholder="Enter Address"
          focused
          value={inputAddr}
          onChange={(event) => {
            const { value } = event.target;
            setInputAddr(value);

            /**
             * If inputted address is invalid, and an onchange has been triggered,
             * reset the invalid field flag
             */
            if (!isFuturePassValid) {
              setIsFuturePassValid(true);
            }
          }}
        />
        <Collapse in={isProgressVisible}>
          <FlexCenter pt={2}>
            <Relative width="100%">
              <ProgressBar
                isError={isError}
                isPaused={!isTransactionLoading}
                isVisible={isProgressVisible}
                isSuccess={isSuccess}
                resetProgress={resetProgress}
              />
              <ViewTransaction isVisible={isSuccess} hash={txHash} />
            </Relative>
          </FlexCenter>
        </Collapse>
      </Grid>
      <Grid pt={3}>
        <FlexRight>
          <ActionButton
            disabled={isPending || isWaiting}
            sx={{ marginRight: 1 }}
            variant="text"
            onClick={() => {
              refetch();
              refetchEnsAddr();
              closeModal();
            }}
          >
            {isSuccess ? "Close" : "Cancel"}
          </ActionButton>
          <Collapse orientation="horizontal" in={!isSuccess}>
            <ActionButton
              disabled={
                isEmpty(inputAddr) ||
                isPending ||
                isSuccess ||
                isWaiting ||
                !isFeatureEnabled("Link")
              }
              variant="contained"
              onClick={() => {
                handleSetAddress();
              }}
            >
              Confirm
            </ActionButton>
          </Collapse>
        </FlexRight>
      </Grid>
    </Grid>
  );
};

export default AddRecord;
