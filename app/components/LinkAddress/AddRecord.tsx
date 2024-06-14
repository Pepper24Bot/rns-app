import React, { useEffect, useState } from "react";
import { Collapse, Grid, styled } from "@mui/material";
import {
  ModalInputField as InputField,
  FlexRight,
  ActionButton,
  FlexCenter,
  Relative,
  FlexTop,
} from "../Theme/StyledGlobal";
import { Address, isAddress } from "viem";
import { useModalState } from "@/redux/modal/modalSlice";
import { isEmpty } from "lodash";
import { LinkProps } from "@/interfaces/components/transaction";
import { useEnsName } from "wagmi";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
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

export const AddRecord: React.FC<LinkProps> = (props: LinkProps) => {
  const { item, address } = props;
  const { name } = item;

  const router = useRouter();

  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { enqueueSnackbar } = useSnackbar();

  /** Status Flags */
  const [isValidAddress, setValidAddress] = useState<boolean>(true);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [inputAddr, setInputAddr] = useState<string>("");
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const { refetch } = useEnsName({ address });

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
    const isValid = isAddress(inputAddr);

    if (isValid) {
      initializeFlags();
      const { isSuccess, data } = await setAddressRecord({
        name: name ?? "",
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
    }

    setValidAddress(isValid);
  };

  useEffect(() => {
    if (isCompleted) {
      enqueueSnackbar(
        `You have successfully added an address record to ${name ?? ""}.`,
        { variant: "success" }
      );

      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isCompleted]);

  return (
    <Grid item xs>
      <RecordContainer container>
        <EnsImage name={name ?? ""} />
        <FormContainer>
          <Grid>
            <InputField disabled value={name} />
            <InputField
              error={!isValidAddress}
              helperText={
                !isValidAddress ? "Please insert a valid Address only" : ""
              }
              label="Address"
              placeholder="Enter Address"
              focused
              value={inputAddr}
              onChange={(event) => {
                const { value } = event.target;
                setInputAddr(value);
                if (!isValidAddress) {
                  setValidAddress(true);
                }
              }}
            />
          </Grid>
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
          sx={{ marginRight: 1 }}
          variant="text"
          onClick={() => {
            refetch();
            closeModal();
            router.replace("/", { scroll: false });
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
              !isValidAddress ||
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
  );
};

export default AddRecord;
