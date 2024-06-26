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
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { Link } from "./LinkAddress";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import useBlockLatency from "@/hooks/useBlockLatency";

export const AddRecord: React.FC<Link> = (props: Link) => {
  const { domain } = props;
  const { closeModal } = useModalState();

  const dispatch = useDispatch();

  /** Status Flags */
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [isFuturePassValid, setIsFuturePassValid] = useState<boolean>(true);
  const [inputAddr, setInputAddr] = useState<string>("");

  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);

  /** Use the isLoading Flag here for the progress bar */
  const { setAddressRecord, isLoading } = useRecords({ type: "AddressRecord" });

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
    const { isSuccess } = await setAddressRecord({
      name: domain?.name || "",
      address: inputAddr as Address,
      resolverAddress: domain?.resolver?.address,
    });

    if (isSuccess) {
      setIsBlockEnabled(true);
    } else {
      setIsError(true);
    }

    setResetProgress(false);
    setIsPending(false);
  };

  useEffect(() => {
    if (isCompleted) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
    }
  }, [isCompleted]);

  return (
    <Grid item xs display="grid" alignContent="space-between">
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
        <FlexCenter marginY={2.5}>
          <Relative width="100%">
            <BoxContainer isVisible={isProgressVisible}>
              <ProgressBar
                isError={isError}
                isPaused={!isTransactionLoading}
                isVisible={isProgressVisible}
                isSuccess={isSuccess}
                resetProgress={resetProgress}
              />
            </BoxContainer>
            <FlexCenter>
              <Tip isVisible={isSuccess}>View Transaction</Tip>
            </FlexCenter>
          </Relative>
        </FlexCenter>
      </Grid>
      <Grid mt={3}>
        <FlexRight>
          <ActionButton
            disabled={isPending || isSuccess || isWaiting}
            sx={{ marginRight: 1 }}
            variant="text"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            disabled={isEmpty(inputAddr) || isPending || isSuccess || isWaiting}
            variant="contained"
            onClick={() => {
              handleSetAddress();
            }}
          >
            Confirm
          </ActionButton>
        </FlexRight>
      </Grid>
    </Grid>
  );
};

export default AddRecord;
