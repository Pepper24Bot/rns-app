import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import {
  FlexRight,
  ActionButton,
  BoxContainer,
  FlexCenter,
  Relative,
  Tip,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/services/utils";
import { Link } from "./LinkAddress";
import { Address } from "viem";
import { useDispatch } from "react-redux";
import { graphqlApi, useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { EMPTY_ADDRESS } from "@/services/constants";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import UpdateRecord from "./UpdateRecord";
import RemoveAddress from "./RemoveRecord";
import useBlockLatency from "@/hooks/useBlockLatency";

export const AddressRecord: React.FC<Link> = (props: Link) => {
  const { domain: domainState, owner } = props;
  const { closeModal } = useModalState();

  const { data } = useGetNamesByNameQuery(
    { labelName: `${domainState?.labelName}` },
    { skip: domainState?.name === null }
  );

  const dispatch = useDispatch();
  const domain = data?.nameWrappeds[0]?.domain;
  const linkedAddr = domain?.resolver?.addr?.id || "";

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isRemoveMode, setIsRemoveMode] = useState<boolean>(false);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);
  const [isFuturePassValid, setIsFuturePassValid] = useState<boolean>(true);
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);

  const { setAddressRecord, isLoading } = useRecords({
    type: "AddressRecord",
  });

  const { isWaiting, isCompleted } = useBlockLatency({
    enabled: isBlockEnabled,
  });

  const isTransactionLoading = isLoading || isWaiting;

  const ownerId = getMaskedAddress(owner?.id || "");
  const futurePass = isEditMode ? linkedAddr : getMaskedAddress(linkedAddr);

  // Updating of Linked Address
  const [inputValue, setInputValue] = useState<string>(futurePass || "None");

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

  const handleUpdateAddress = async (value: string) => {
    initializeFlags();

    const { isSuccess } = await setAddressRecord({
      name: domain?.name || "",
      address: value as Address,
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

  useEffect(() => {
    setInputValue(futurePass);
  }, [linkedAddr, isEditMode]);

  return (
    <Grid item xs>
      {!isRemoveMode ? (
        <UpdateRecord
          name={domainState?.name || ""}
          owner={ownerId}
          isFuturePassValid={isFuturePassValid}
          futurePassInput={inputValue}
          updateAddressInput={(value) => {
            setInputValue(value);
          }}
          isUpdateEnabled={isEditMode}
          toggleEditMode={() => {
            setIsEditMode(!isEditMode);
            setIsProgressVisible(false);

            /**
             * If inputted address is invalid, and an onchange has been triggered,
             * reset the invalid field flag
             */
            if (!isFuturePassValid) {
              setIsFuturePassValid(true);
            }
          }}
          toggleRemoveMode={() => {
            setIsRemoveMode(!isRemoveMode);
          }}
        />
      ) : (
        <RemoveAddress
          futurePassInput={linkedAddr}
          disableBack={isPending || isSuccess}
          toggleRemoveMode={() => {
            setIsProgressVisible(false);
            setIsRemoveMode(!isRemoveMode);
          }}
        />
      )}
      <FlexCenter marginY={1}>
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
      {(isEditMode || isRemoveMode) && (
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
            disabled={
              inputValue === linkedAddr || isPending || isSuccess || isWaiting
            }
            variant="contained"
            onClick={() => {
              if (isRemoveMode) {
                handleUpdateAddress(EMPTY_ADDRESS);
              } else {
                handleUpdateAddress(inputValue);
              }
            }}
          >
            Confirm
          </ActionButton>
        </FlexRight>
      )}
    </Grid>
  );
};

export default AddressRecord;
