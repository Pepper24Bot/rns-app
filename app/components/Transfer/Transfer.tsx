import React, { useCallback, useEffect, useState } from "react";
import {
  Collapse,
  Grid,
  styled,
  alpha,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
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
import { Address, isAddress } from "viem";
import { TransactionProps } from "@/interfaces/components/transaction";
import { useEnsAddress } from "wagmi";
import { isRootName } from "@/utils/common";
import { config } from "@/chains/config";
import { normalize } from "viem/ens";
import { getEnsAddress } from "@wagmi/core";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";

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

  const { domain, owner } = props;
  const { closeModal } = useModalState();
  const { data: addressRecord, refetch } = useEnsAddress({
    name: domain?.name || "",
  });

  // Transaction status
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [isWatchingAddrUpdate, setWatchAddrUpdate] = useState<boolean>(false);
  const [isWatchingTransfer, setWatchTransfer] = useState<boolean>(false);

  const [isFieldError, setFieldError] = useState<boolean>(false);
  const [isFieldValidating, setFieldValidating] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<string>("");

  const [inputAddr, setInputAddr] = useState<string>("");
  const [newOwner, setNewOwner] = useState<string>("");

  const [txHash, setTxHash] = useState<string>("");

  const { transfer, isLoading: isTransferLoading } = useTransfer();
  const { setAddressRecord, isLoading: isRecordLoading } = useRecords();

  const { isWaiting: isAddrUpdating, isCompleted: isAddrUpdated } =
    useBlockLatency({
      enabled: isWatchingAddrUpdate,
    });

  const { isWaiting: isTransferring, isCompleted: isTransferred } =
    useBlockLatency({
      enabled: isWatchingTransfer,
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

  const setErrorFieldData = (helper: string) => {
    setFieldError(true);
    setHelperText(helper);
    setNewOwner("");
  };

  const setValidAddress = async (value: string) => {
    setFieldValidating(true);
    const isValidAddress = isAddress(value);
    const isValidName = isRootName(value);

    if (!isValidAddress && !isValidName) {
      setErrorFieldData("Invalid Address or RNS!");
    }

    if (isValidName && !isValidAddress) {
      const addressRecord = await getEnsAddress(config, {
        name: normalize(value),
      });

      if (!addressRecord) {
        setErrorFieldData("The RNS is not linked to any address!");
      } else if (addressRecord.toLowerCase() === owner?.id) {
        setErrorFieldData("You are sending this identity to your own address!");
      } else {
        setNewOwner(addressRecord);
      }
    } else if (!isValidName && isValidAddress) {
      if (value.toLowerCase() === owner?.id) {
        setErrorFieldData("You are sending this identity to your own address!");
      } else {
        setNewOwner(value);
      }
    }
    setFieldValidating(false);
  };

  const handleDebounceOnChange = async (value: string) => {
    setFieldError(false);
    setHelperText("");

    if (!value) {
      setNewOwner("");
    } else {
      await setValidAddress(value);
    }
  };

  const debounceFn = useCallback(
    _debounce(handleDebounceOnChange, DEFAULT_DEBOUNCE),
    []
  );

  const handleUpdateAddress = async () => {
    initializeFlags();

    const { isSuccess } = await setAddressRecord({
      name: domain?.name || "",
      address: newOwner as Address,
    });

    if (isSuccess) {
      setWatchAddrUpdate(true);
      refetch();
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleTransfer = async () => {
    const name = domain?.name;

    if (name) {
      const { data, isSuccess } = await transfer({ name, newOwner });

      if (isSuccess) {
        setWatchTransfer(true);
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
            error={isFieldError}
            helperText={helperText}
            label="Transfer To"
            placeholder="Enter Wallet Address or RNS"
            focused
            value={inputAddr}
            onChange={(event) => {
              const { value } = event.target;
              setInputAddr(value);
              debounceFn(value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mt: 1 }}>
                  <Collapse in={isFieldValidating}>
                    <CircularProgress size={18} />
                  </Collapse>
                </InputAdornment>
              ),
            }}
          />
          <Note pt={4} pb={2}>
            Please note that transferring this identity will also set the
            address record (Linked Address) to the receiver's address.
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
                  isEmpty(newOwner) ||
                  isPending ||
                  isSuccess ||
                  isTransactionLoading
                }
                variant="contained"
                onClick={() => {
                  if (addressRecord === newOwner) {
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
