import React, { useEffect, useState } from "react";
import { styled, Grid, alpha, Collapse } from "@mui/material";
import { FONT_WEIGHT } from "../Theme/Global";
import {
  FlexTop,
  SecondaryLabel,
  ModalInputField as InputField,
  ActionButton,
  FlexRight,
  FlexCenter,
  Relative,
} from "../Theme/StyledGlobal";

import { useModalState } from "@/redux/modal/modalSlice";
import { namehash } from "viem";
import { isEmpty } from "lodash";
import { useEnsName } from "wagmi";
import { PrimaryProps } from "@/interfaces/global/transaction";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import { hasNonAsciiChars } from "@/utils/common";

import EnsImage from "../Reusables/EnsImage";
import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import usePrimary from "@/hooks/usePrimary";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";
import useFeatureToggle from "@/hooks/useFeatureToggle";
import EndAdornment from "../Reusables/EndAdornment";

const PrimaryContainer = styled(FlexTop)(({ theme }) => ({
  marginTop: "48px",
  minWidth: "250px",
  maxHeight: "80vh",
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

const ConfirmationText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: FONT_WEIGHT.Light,
  color: theme.palette.text.primary,
}));

const Note = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.35),
}));

export const Primary: React.FC<PrimaryProps> = (props: PrimaryProps) => {
  const { item, address } = props;
  const { name, resolvedAddress: ensAddr } = item;

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { refetch, data: ensName } = useEnsName({ address });
  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { setAddressRecord } = useRecords();
  const { setPrimaryName, getPrimaryName, isLoading } = usePrimary();
  const { refetchRanking } = useLeaderboardState();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [ensNameData, setEnsPublicName] = useState<string>(String(ensName));
  const [isWatchingSetPrimary, setWatchPrimary] = useState<boolean>(false);
  const [isWatchingSetAddr, setWatchSetAddr] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const { isWaiting: isSettingAddr, isCompleted: isSetAddrCompleted } =
    useBlockLatency({
      enabled: isWatchingSetAddr,
    });

  const { isWaiting: isSettingPrimary, isCompleted: isPrimaryCompleted } =
    useBlockLatency({
      enabled: isWatchingSetPrimary,
    });

  const isTransactionLoading = isLoading || isSettingPrimary || isSettingAddr;
  const hasNonAscii = hasNonAsciiChars(name ?? "");

  const setEnsRecord = async () => {
    if (isEmpty(ensName)) {
      const reverseNode = `${address.slice(2)}.addr.reverse`;
      const reverseNamehash = namehash(reverseNode);
      const { data: ensPublicName } = await getPrimaryName({
        domainId: reverseNamehash,
      });

      setEnsPublicName(String(ensPublicName));
    }
  };

  const initializeFlags = () => {
    // display progress bar
    setIsPending(true);
    setIsProgressVisible(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsSuccess(false);
  };

  const postTransaction = (isSuccess: boolean, hash: string) => {
    if (isSuccess) {
      setWatchPrimary(true);
      setTxHash(hash);
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleSetPrimaryName = async () => {
    const reponse = await setPrimaryName({
      name: name ?? "",
    });

    return reponse;
  };

  const handleSetAddress = async () => {
    initializeFlags();

    const response = await setAddressRecord({
      name: name ?? "",
      address,
    });

    return response;
  };

  /**
   * Fix this - multiple returns is not recommended
   * @returns
   */
  const getStep = () => {
    if (ensAddr === address) {
      return {
        transaction: "setName",
      };
    }

    if (ensNameData === name && ensAddr !== address) {
      return {
        transaction: "setAddr",
      };
    }

    return {
      transaction: "2steps", // setName + setAddr
    };
  };

  const handleSetPrimary = async () => {
    const { transaction } = getStep();

    if (transaction === "setName") {
      initializeFlags();
      const { isSuccess, data } = await handleSetPrimaryName();
      postTransaction(isSuccess, data.hash);
    } else if (transaction === "setAddr") {
      const { isSuccess, data } = await handleSetAddress();
      postTransaction(isSuccess, data.hash);
    } else {
      if (!isSetAddrCompleted) {
        const { isSuccess } = await handleSetAddress();
        if (isSuccess) {
          setWatchSetAddr(true);
        } else {
          setIsError(true);
          setIsPending(false);
        }
      } else {
        initializeFlags();
        const { isSuccess, data } = await handleSetPrimaryName();
        postTransaction(isSuccess, data.hash);
      }
    }
  };

  useEffect(() => {
    if (isSetAddrCompleted) {
      enqueueSnackbar(`Updating the linked address of ${name} is completed!`, {
        variant: "info",
      });

      const setPrimaryName = async () => {
        const { isSuccess: primarySuccess, data: primaryData } =
          await handleSetPrimaryName();
        postTransaction(primarySuccess, primaryData.hash);
      };

      setPrimaryName();
    }
  }, [isSetAddrCompleted]);

  useEffect(() => {
    if (isPrimaryCompleted) {
      // Refresh the data in Leaderboard
      refetchRanking();

      enqueueSnackbar(
        `Well done! You have successfully set ${name} as your primary`,
        { variant: "success" }
      );

      refetch();
      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isPrimaryCompleted]);

  useEffect(() => {
    setEnsRecord();
  }, [address]);

  return (
    <Grid>
      <PrimaryContainer container>
        <EnsImage name={name ?? ""} />
        <FormContainer>
          {getStep().transaction === "setName" && (
            <>
              <ConfirmationText pb={3}>
                Are you sure you want to use this name as your primary?
              </ConfirmationText>

              <Note pb={3}>
                Please note that you can only have one primary name per address.
              </Note>
            </>
          )}
          {getStep().transaction === "setAddr" && (
            <>
              <ConfirmationText pb={3}>
                Are you sure you want to use this name as your primary?
              </ConfirmationText>

              <Note pb={3}>
                Please note that setting this RNS Identity as your Primary
                Identity will also change the Linked/Resolver address back to
                the address in which this RNS Identity is held.
              </Note>
            </>
          )}
          {getStep().transaction === "2steps" && (
            <>
              <ConfirmationText pb={3}>
                The address for this identity does not match this wallet.
              </ConfirmationText>
              <Note pb={3}>
                To use this as your primary name, you will need to update the
                address for this identity first.
              </Note>
            </>
          )}
          <InputField
            focused
            value={name}
            InputProps={{
              readOnly: true,
              endAdornment: <EndAdornment hasNonAscii={hasNonAscii} />,
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
                />
                <ViewTransaction isVisible={isSuccess} hash={txHash} />
              </Relative>
            </FlexCenter>
          </Collapse>
        </FormContainer>
      </PrimaryContainer>
      <FlexRight>
        <ActionButton
          disabled={isPending || isTransactionLoading}
          sx={{ marginRight: 1 }}
          variant="text"
          onClick={() => {
            closeModal();
            router.replace("/", { scroll: false });
          }}
        >
          {isSuccess ? "Close" : "Cancel"}
        </ActionButton>
        <Collapse orientation="horizontal" in={!isSuccess}>
          <ActionButton
            disabled={
              isSuccess ||
              isPending ||
              isTransactionLoading ||
              !isFeatureEnabled("Primary")
            }
            variant="contained"
            onClick={() => {
              handleSetPrimary();
            }}
          >
            Confirm
          </ActionButton>
        </Collapse>
      </FlexRight>
    </Grid>
  );
};

export default Primary;
