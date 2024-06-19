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
import { TransactionProps } from "@/interfaces/global/transaction";
import { useEnsName } from "wagmi";
import { getMaskedAddress, isRootName } from "@/utils/common";
import { config } from "@/chains/config";
import { normalize } from "viem/ens";
import { getEnsAddress } from "@wagmi/core";
import { debounce as _debounce } from "lodash";
import { DEFAULT_DEBOUNCE } from "@/constants/components";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";
import ViewTransaction from "../Reusables/ViewTransaction";
import useTransfer from "@/hooks/useTransfer";
import useBlockLatency from "@/hooks/useBlockLatency";
import useRecords from "@/hooks/useRecords";
import useFeatureToggle from "@/hooks/useFeatureToggle";

const TransferContainer = styled(Grid)(({ theme }) => ({
  marginTop: "48px",
  minWidth: "250px",
  maxHeight: "75vh",
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

const Note = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.35),
}));

export const Transfer: React.FC<TransactionProps> = (
  props: TransactionProps
) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { address, item } = props;
  const { resolvedAddress: ensAddr, owner, name } = item;

  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { enqueueSnackbar } = useSnackbar();

  const { refetch: refetchEnsName } = useEnsName({
    address,
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

  // TODO: Implement field validator
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
      } else if (addressRecord.toLowerCase() === owner) {
        setErrorFieldData("You are sending this identity to your own address!");
      } else {
        setNewOwner(addressRecord);
      }
    } else if (!isValidName && isValidAddress) {
      if (value.toLowerCase() === owner) {
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
      name: name ?? "",
      address: newOwner as Address,
    });

    if (isSuccess) {
      setWatchAddrUpdate(true);
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleTransfer = async () => {
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
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      enqueueSnackbar(
        `You have successfully transferred ${name} to ${getMaskedAddress(
          newOwner
        )}!`,
        { variant: "success" }
      );

      // Refetch the ens name so that the toolbar will update the primary name
      refetchEnsName();
      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isTransferred]);

  useEffect(() => {
    if (isAddrUpdated) {
      enqueueSnackbar(`Updating the address of ${name} is completed!`, {
        variant: "info",
      });

      handleTransfer();
    }
  }, [isAddrUpdated]);

  return (
    <Grid>
      <TransferContainer container>
        <EnsImage name={name ?? ""} />
        <FormContainer>
          <InputField disabled value={name ?? ""} />
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
        </FormContainer>
      </TransferContainer>
      <FlexRight width="100%">
        <ActionButton
          disabled={isPending || isTransactionLoading}
          sx={{ marginRight: 1 }}
          variant="text"
          onClick={() => {
            router.replace("/", { scroll: false });
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
              isTransactionLoading ||
              !isFeatureEnabled("Transfer")
            }
            variant="contained"
            onClick={() => {
              if (ensAddr === newOwner) {
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
  );
};

export default Transfer;
