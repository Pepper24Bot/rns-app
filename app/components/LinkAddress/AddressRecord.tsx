import React, { useEffect, useState } from "react";
import { Collapse, Grid, styled } from "@mui/material";
import {
  FlexRight,
  ActionButton,
  FlexCenter,
  Relative,
  FlexTop,
} from "../Theme/StyledGlobal";
import { useModalState } from "@/redux/modal/modalSlice";
import { getMaskedAddress } from "@/utils/common";
import { Address } from "viem";
import { useGetNamesByNameQuery } from "@/redux/graphql/graphqlApi";
import { EMPTY_ADDRESS } from "@/constants/components";
import { useEnsAddress, useEnsName } from "wagmi";
import { LinkProps } from "@/interfaces/components/transaction";
import { useSnackbar } from "notistack";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import UpdateRecord from "./UpdateRecord";
import RemoveAddress from "./RemoveRecord";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";
import useFeatureToggle from "@/hooks/useFeatureToggle";
import EnsImage from "../Reusables/EnsImage";

const RecordContainer = styled(FlexTop)(({ theme }) => ({
  marginTop: "48px",
  minWidth: "250px",
  maxHeight: "60vh",
  overflow: "overlay",
}));

const FormContainer = styled(Grid)(({ theme }) => ({
  maxWidth: "350px",
  paddingBottom: "16px",

  [theme.breakpoints.down(710)]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

export const AddressRecord: React.FC<LinkProps> = (props: LinkProps) => {
  const { domain: domainState, owner, ensName, activeAddress } = props;

  const { data } = useGetNamesByNameQuery(
    { labelName: `${domainState?.labelName}` },
    { skip: domainState?.name === null }
  );
  const { refetch: refetchEnsAddr, data: ensAddr } = useEnsAddress({
    name: domainState?.name || "",
  });
  const { refetch: refetchEnsName } = useEnsName({ address: activeAddress });
  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { enqueueSnackbar } = useSnackbar();

  const domain = data?.wrappedDomains[0]?.domain;
  const linkedAddr = ensAddr || domain?.resolver?.addr?.id || "";

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
  const linkedAddress = isEditMode ? linkedAddr : getMaskedAddress(linkedAddr);

  // Updating of Linked Address
  const [inputValue, setInputValue] = useState<string>(linkedAddress || "None");

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
      enqueueSnackbar(
        `You have successfully ${
          isRemoveMode ? "removed" : "updated"
        } the address record of ${domain?.name}!`,
        { variant: "success" }
      );

      setIsSuccess(true);
      setIsPending(false);

      // dirty trick, refetch right away when updating address record
      // but when removing an address, refetch when closing the modal
      if (!isRemoveMode) {
        // Refetch the address so that the Dashboard will have an updated value
        refetchEnsAddr();
      }

      /**
       * Trigger the refetch when setting the address
       * record of a primary name so that the components listening
       * to useEnsName hook will update the state
       */
      if (ensName === domainState?.name) {
        refetchEnsName();
      }
    }
  }, [isCompleted]);

  useEffect(() => {
    setInputValue(linkedAddress);
  }, [linkedAddr, isEditMode]);

  return (
    <Grid>
      <RecordContainer container>
        <EnsImage name={domainState?.name || ""} />
        <FormContainer>
          {!isRemoveMode ? (
            <UpdateRecord
              ensName={ensName}
              name={domainState?.name || ""}
              owner={ownerId}
              isFuturePassValid={isFuturePassValid}
              addressInput={inputValue}
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
              disableBack={isTransactionLoading || isPending || isSuccess}
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
        </FormContainer>
      </RecordContainer>
      <FlexRight>
        <ActionButton
          disabled={isPending || isWaiting}
          variant="text"
          onClick={() => {
            refetchEnsAddr();
            closeModal();
          }}
        >
          {isSuccess ? "Close" : "Cancel"}
        </ActionButton>
        <Collapse
          orientation="horizontal"
          in={(isEditMode || isRemoveMode) && !isSuccess}
        >
          <ActionButton
            disabled={
              inputValue === linkedAddr ||
              isPending ||
              isSuccess ||
              isWaiting ||
              !isFeatureEnabled("Link")
            }
            sx={{ ml: 1 }}
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
        </Collapse>
      </FlexRight>
    </Grid>
  );
};

export default AddressRecord;
