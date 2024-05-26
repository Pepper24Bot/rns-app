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
import { Address, namehash } from "viem";
import { isEmpty } from "lodash";
import { useEnsAddress, useEnsName } from "wagmi";
import { PrimaryProps } from "@/interfaces/components/transaction";
import { useSnackbar } from "notistack";

import EnsImage from "../Reusables/EnsImage";
import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import usePrimary from "@/hooks/usePrimary";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";
import useFeatureToggle from "@/hooks/useFeatureToggle";

const Container = styled(FlexTop)(({ theme }) => ({}));

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
  const { domain, ensName, activeAddress } = props;

  const name = domain?.name || "";
  const resolverAddress = domain?.resolver?.address;

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);

  const [ensNameData, setEnsPublicName] = useState<string>(String(ensName));
  const [isWatchingSetPrimary, setWatchPrimary] = useState<boolean>(false);
  const [isWatchingSetAddr, setWatchSetAddr] = useState<boolean>(false);

  const [txHash, setTxHash] = useState<string>("");

  const { enqueueSnackbar } = useSnackbar();
  const { refetch } = useEnsName({ address: activeAddress });
  const { data: ensAddr, refetch: refetchEnsAddr } = useEnsAddress({ name });
  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { setAddressRecord } = useRecords();
  const { setPrimaryName, getPrimaryName, isLoading } = usePrimary();

  const { isWaiting: isSettingAddr, isCompleted: isSetAddrCompleted } =
    useBlockLatency({
      enabled: isWatchingSetAddr,
    });

  const { isWaiting: isSettingPrimary, isCompleted: isPrimaryCompleted } =
    useBlockLatency({
      enabled: isWatchingSetPrimary,
    });

  const ownerId = activeAddress?.toLowerCase() as Address;
  const ensAddress = ensAddr?.toLowerCase();
  const isTransactionLoading = isLoading || isSettingPrimary || isSettingAddr;

  const setEnsRecord = async () => {
    if (isEmpty(ensName)) {
      const reverseNode = `${ownerId.slice(2)}.addr.reverse`;
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
      name,
      resolverAddress,
    });

    return reponse;
  };

  const handleSetAddress = async () => {
    initializeFlags();

    const response = await setAddressRecord({
      name,
      address: ownerId,
      resolverAddress,
    });

    return response;
  };

  /**
   * Fix this - multiple returns is not recommended
   * @returns
   */
  const getStep = () => {
    if (ensAddress === ownerId) {
      return {
        transaction: "setName",
      };
    }

    if (ensNameData === name && ensAddress !== ownerId) {
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
      refetchEnsAddr();

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
  }, [ownerId]);

  return (
    <Container pt={2}>
      <EnsImage name={name} />
      <Grid maxWidth={350}>
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
              Identity will also change the Linked/Resolver address back to the
              address in which this RNS Identity is held.
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
        <InputField disabled focused value={name} />
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
        <FlexRight pt={3}>
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
    </Container>
  );
};

export default Primary;
