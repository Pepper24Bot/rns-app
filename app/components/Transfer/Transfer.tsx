import React, { useEffect, useState } from "react";
import { Collapse, Grid, styled } from "@mui/material";
import {
  ActionButton,
  FlexCenter,
  FlexRight,
  ModalInputField as InputField,
  Relative,
} from "../Theme/StyledGlobal";
import { isEmpty } from "lodash";
import { useModalState } from "@/redux/modal/modalSlice";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { Address } from "viem";
import { TransactionProps } from "@/interfaces/components/transaction";

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

export const Transfer: React.FC<TransactionProps> = (
  props: TransactionProps
) => {
  const dispatch = useDispatch();

  const { domain } = props;
  const { closeModal } = useModalState();

  const [isTransferSuccess, setIsTransferSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isAddrUpdating, setIsAddrUpdating] = useState<boolean>(false);
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);

  const [inputAddr, setInputAddr] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const { transfer, isLoading: isTransferLoading } = useTransfer();
  const { setAddressRecord, isLoading: isAddrLoading } = useRecords();

  const { isCompleted: isAddrUpdated } = useBlockLatency({
    enabled: isAddrUpdating,
    blocksToWait: 3,
  });

  const { isWaiting, isCompleted } = useBlockLatency({
    enabled: isBlockEnabled,
    blocksToWait: 3,
  });

  const isTransactionLoading = isTransferLoading || isWaiting || isAddrLoading;

  const initializeFlags = () => {
    // display progress bar
    setIsProgressVisible(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsTransferSuccess(false);
  };

  /**
   * TODO: Add check if the address record is not the same as the new owner
   * TODO: Add check if the address or name are valid
   * @param value
   */
  const handleUpdateAddress = async () => {
    initializeFlags();

    const { isSuccess, data } = await setAddressRecord({
      name: domain?.name || "",
      address: inputAddr as Address,
    });

    if (isSuccess) {
      setIsAddrUpdating(true);
    } else {
      setIsError(true);
    }
  };

  const handleTransfer = async () => {
    const name = domain?.name;

    if (name && isAddrUpdated) {
      const { data, isSuccess } = await transfer({ name, newOwner: inputAddr });

      if (isSuccess) {
        setIsBlockEnabled(true);
        setTxHash(data.hash);
      } else {
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    if (isCompleted) {
      // Data Invalidation: Refresh Dashboard
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsTransferSuccess(true);
    }
  }, [isCompleted]);

  useEffect(() => {
    handleTransfer();
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
          <Collapse in={isProgressVisible}>
            <FlexCenter pt={2}>
              <Relative width="100%">
                <ProgressBar
                  isError={isError}
                  isPaused={!isTransactionLoading}
                  isVisible={isProgressVisible}
                  isSuccess={isTransferSuccess}
                />
                <ViewTransaction isVisible={isTransferSuccess} hash={txHash} />
              </Relative>
            </FlexCenter>
          </Collapse>
        </Grid>
        <Grid pt={3}>
          <FlexRight>
            <ActionButton
              disabled={isTransactionLoading || isTransferSuccess}
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              disabled={isEmpty(inputAddr) || isTransactionLoading}
              variant="contained"
              onClick={() => {
                handleUpdateAddress();
              }}
            >
              Confirm
            </ActionButton>
          </FlexRight>
        </Grid>
      </Container>
    </Grid>
  );
};

export default Transfer;
