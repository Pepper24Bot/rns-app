import React, { useEffect, useState } from "react";
import { styled, Grid, alpha } from "@mui/material";
import { Domain } from "@/redux/graphql/hooks";
import { FONT_WEIGHT } from "../Theme/Global";
import {
  FlexTop,
  SecondaryLabel,
  ModalInputField as InputField,
  ActionButton,
  FlexRight,
  BoxContainer,
  FlexCenter,
  Relative,
  Tip,
} from "../Theme/StyledGlobal";

import EnsImage from "../Reusables/EnsImage";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address, namehash } from "viem";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { isEmpty } from "lodash";

import useRecords from "@/hooks/useRecords";
import ProgressBar from "../Reusables/ProgressBar";
import usePrimary from "@/hooks/usePrimary";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";

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

export interface Primary {
  domain?: Partial<Domain>;
  ensName?: string;
  ensAddr?: string;
  owner?: {
    id?: string;
  };
}

export const Primary: React.FC<Primary> = (props: Primary) => {
  const { domain, owner, ensName, ensAddr } = props;

  const name = domain?.name || "";
  const ownerId = owner?.id as Address;
  const resolverAddress = domain?.resolver?.address;

  const dispatch = useDispatch();

  const { closeModal } = useModalState();
  const { setPrimaryName, getPrimaryName, isLoading } = usePrimary();
  const { setAddressRecord } = useRecords();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);

  const [ensNameData, setEnsPublicName] = useState<string>(String(ensName));
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const { isWaiting, isCompleted } = useBlockLatency({
    enabled: isBlockEnabled,
  });

  const isTransactionLoading = isLoading || isWaiting;

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
    // should always start to 0
    setResetProgress(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsSuccess(false);
  };

  const postTransaction = (isSuccess: boolean, hash: string) => {
    if (isSuccess) {
      setIsBlockEnabled(true);
      setTxHash(hash);
    } else {
      setIsError(true);
      setIsPending(false);
    }

    setResetProgress(false);
  };

  const handleSetPrimaryName = async () => {
    const reponse = await setPrimaryName({
      name,
      address: ownerId,
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
    if (ensAddr === ownerId) {
      return {
        transaction: "setName",
      };
    }

    if (ensNameData === name && ensAddr !== ownerId) {
      return {
        transaction: "setAddr",
      };
    }

    return {
      transaction: "2steps", // setName + setAddr
    };
  };

  /**
   * Conditions:
   * Test deploy
   */
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
      const { isSuccess, data } = await handleSetAddress();

      if (isSuccess) {
        const { isSuccess: primarySuccess, data: primaryData } =
          await handleSetPrimaryName();
        postTransaction(primarySuccess, primaryData.hash);
      } else {
        postTransaction(isSuccess, data.hash);
      }
    }
  };

  useEffect(() => {
    if (isCompleted) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
    }
  }, [isCompleted]);

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
        <FlexCenter marginY={2}>
          <Relative width="100%">
            <BoxContainer isVisible={isProgressVisible}>
              <ProgressBar
                isError={isError}
                isPaused={!isTransactionLoading}
                isVisible={isProgressVisible}
                isSuccess={isSuccess}
              />
            </BoxContainer>
            <ViewTransaction isVisible={isSuccess} hash={txHash} />
          </Relative>
        </FlexCenter>
        <FlexRight pt={2}>
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
            disabled={isPending || isSuccess || isWaiting}
            variant="contained"
            onClick={() => {
              handleSetPrimary();
            }}
          >
            Confirm
          </ActionButton>
        </FlexRight>
      </Grid>
    </Container>
  );
};

export default Primary;
