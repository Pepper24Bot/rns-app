import React, { useEffect, useState } from "react";
import { Collapse, Grid } from "@mui/material";
import {
  FlexRight,
  ActionButton,
  FlexCenter,
  Relative,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/utils/common";
import { Address } from "viem";
import { useDispatch } from "react-redux";
import { graphqlApi, useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { EMPTY_ADDRESS } from "@/constants/components";
import { useAccount, useEnsAddress, useEnsName } from "wagmi";
import { LinkProps } from "@/interfaces/components/transaction";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import UpdateRecord from "./UpdateRecord";
import RemoveAddress from "./RemoveRecord";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";

export const AddressRecord: React.FC<LinkProps> = (props: LinkProps) => {
  const { domain: domainState, owner, ensName } = props;

  const dispatch = useDispatch();

  const { data } = useGetNamesByNameQuery(
    { labelName: `${domainState?.labelName}` },
    { skip: domainState?.name === null }
  );

  const { address } = useAccount();
  const { refetch: refetchEnsAddr } = useEnsAddress({
    name: domainState?.name || "",
  });

  const { refetch: refetchEnsName } = useEnsName({ address });
  const { closeModal } = useModalState();

  const domain = data?.wrappedDomains[0]?.domain;
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
  const [txHash, setTxHash] = useState<string>("");

  const { setAddressRecord, isLoading } = useRecords();
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

    const { isSuccess, data } = await setAddressRecord({
      name: domain?.name || "",
      address: value as Address,
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
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
      refetchEnsAddr();

      if (ensName === domainState?.name) {
        refetchEnsName();
      }
    }
  }, [isCompleted]);

  useEffect(() => {
    setInputValue(futurePass);
  }, [linkedAddr, isEditMode]);

  return (
    <Grid item xs>
      {!isRemoveMode ? (
        <UpdateRecord
          ensName={ensName}
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
      <Collapse in={isProgressVisible}>
        <FlexCenter pt={3}>
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

      <Collapse in={isEditMode || isRemoveMode}>
        <FlexRight pt={3}>
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
      </Collapse>
    </Grid>
  );
};

export default AddressRecord;
