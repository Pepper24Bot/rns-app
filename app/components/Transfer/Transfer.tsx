import React, { useEffect, useState } from "react";
import { Collapse, Grid, styled, alpha } from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  FlexRight,
  ModalInputField as InputField,
  Relative,
  SecondaryLabel,
} from "../Theme/StyledGlobal";
import { isEmpty } from "lodash";
import { useModalState } from "@/redux/modal/modalSlice";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { Address } from "viem";
import { TransactionProps } from "@/interfaces/components/transaction";
import { useEnsAddress } from "wagmi";

import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";
import ViewTransaction from "../Reusables/ViewTransaction";
import useTransfer from "@/hooks/useTransfer";
import useBlockLatency from "@/hooks/useBlockLatency";
import useRecords from "@/hooks/useRecords";

const Container = styled(Grid)(({ theme }) => ({
  width: "350px",
  display: "grid",
  alignContent: "space-between",

  [theme.breakpoints.between("miniTablet", "tablet")]: {
    width: "max-content",
  },

  [theme.breakpoints.down("miniTablet")]: {
    width: "100%",
  },
}));

const Note = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.35),
}));

export const Transfer: React.FC<TransactionProps> = (
  props: TransactionProps
) => {
  const dispatch = useDispatch();

  const { domain } = props;
  const { closeModal } = useModalState();
  const { data: addressRecord, refetch } = useEnsAddress({
    name: domain?.name || "",
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [isWatchingAddrUpdate, setWatchingAddrUpdate] =
    useState<boolean>(false);
  const [isWatchingTransfer, setWatchingTransfer] = useState<boolean>(false);

  const [inputAddr, setInputAddr] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const { transfer, isLoading: isTransferLoading } = useTransfer();
  const { setAddressRecord, isLoading: isRecordLoading } = useRecords();

  const { isWaiting: isAddrUpdating, isCompleted: isAddrUpdated } =
    useBlockLatency({
      enabled: isWatchingAddrUpdate,
      blocksToWait: 3,
    });

  const { isWaiting: isTransferring, isCompleted: isTransferred } =
    useBlockLatency({
      enabled: isWatchingTransfer,
      blocksToWait: 3,
    });

  const isTransactionLoading =
    isTransferLoading || isRecordLoading || isTransferring || isAddrUpdating;

  const initializeFlags = () => {
    // display progress bar
    setIsPending(true);
    setIsProgressVisible(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsSuccess(false);
  };

  const handleUpdateAddress = async () => {
    initializeFlags();

    const { isSuccess } = await setAddressRecord({
      name: domain?.name || "",
      address: inputAddr as Address,
    });

    if (isSuccess) {
      setWatchingAddrUpdate(true);
      refetch();
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleTransfer = async () => {
    const name = domain?.name;

    if (name) {
      const { data, isSuccess } = await transfer({ name, newOwner: inputAddr });

      if (isSuccess) {
        setWatchingTransfer(true);
        setTxHash(data.hash);
      } else {
        setIsError(true);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    if (isTransferred) {
      // Data Invalidation: Refresh Dashboard
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isTransferred]);

  useEffect(() => {
    if (isAddrUpdated) {
      // Refresh dashboard, in case the user cancels the transaction midway
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      handleTransfer();
    }
  }, [isAddrUpdated]);

  return (
    <Grid container mt={6} minWidth={250}>
      <EnsImage name={domain?.name || ""} />
      <Container>
        <Grid>
          <InputField disabled value={domain?.name} />
          <InputField
            label="Transfer To"
            placeholder="Enter FuturePass Address or RNS"
            focused
            value={inputAddr}
            onChange={(event) => {
              const { value } = event.target;
              setInputAddr(value);
            }}
          />
          <Note py={2}>
            Please note that transferring this identity will also set the
            address record to the receiver's address.
          </Note>
          <Collapse in={isProgressVisible}>
            <FlexCenter pt={2}>
              <Relative width="100%">
                <ProgressBar
                  isError={isError}
                  isPaused={!isTransactionLoading}
                  isVisible={isProgressVisible}
                  isSuccess={isSuccess}
                />
                <ViewTransaction isVisible={isSuccess} hash={txHash} />
              </Relative>
            </FlexCenter>
          </Collapse>
        </Grid>
        <Grid pt={3}>
          <FlexRight>
            <ActionButton
              disabled={isPending || isTransactionLoading}
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
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
                  isTransactionLoading
                }
                variant="contained"
                onClick={() => {
                  if (addressRecord === inputAddr) {
                    initializeFlags();
                    handleTransfer();
                  } else {
                    handleUpdateAddress();
                  }
                }}
              >
                Confirm
              </ActionButton>
            </Collapse>
          </FlexRight>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Transfer;
