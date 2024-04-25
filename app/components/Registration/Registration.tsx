import React, { useEffect, useState } from "react";
import {
  FlexCenter,
  ToolbarButton,
  FlexRight,
  ActionButton,
  SecondaryLabel,
  Relative,
  BoxContainer,
  Tip,
  ShareButton,
  FlexJustified,
  FlexLeft,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Divider, Grid, alpha, styled } from "@mui/material";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address } from "viem";
import { COMMITMENT_AGE } from "@/services/constants";
import { X } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { parseCookie } from "@/services/utils";

import CircularProgress from "../Reusables/CircularProgressWithLabel";
import Image from "next/image";
import useNameDetails from "@/hooks/useNameDetails";
import useRegister from "@/hooks/useRegister";
import Form from "./Form";
import useFees from "@/hooks/useFees";
import ProgressBar from "../Reusables/ProgressBar";
import useTokenApproval from "@/hooks/useApprovalToken";
import useBlockLatency from "@/hooks/useBlockLatency";

const ShareLabel = styled(SecondaryLabel)(({ theme }) => ({
  padding: "8px 16px",
  textTransform: "uppercase",
  fontWeight: FONT_WEIGHT.Bold,
}));

const ShareTip = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.75),
  width: "calc(100% - 50px)",
  textAlign: "center",
  paddingBottom: "16px",
}));

const TwitterIcon = styled(X)(({ theme }) => ({
  margin: "8px 16px",
}));

const ViewProcessText = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  fontSize: "12px",
  color: disabled ? theme.palette.primary.dark : theme.palette.primary.main,
}));

export const RegisterName: React.FC = () => {
  const { address } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { name = "", year = 1, payment } = useDomain();
  const { closeModal, toggleModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const dispatch = useDispatch();
  const isTweetVerified = parseCookie("isTweetVerified") === "true";

  const [isCommitSuccess, setIsCommitSuccess] = useState<boolean>(false);
  const [isApprovalSuccess, setIsApprovalSuccess] = useState<boolean>(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [isCooldown, setCooldown] = useState<boolean>(false);
  const [resetProgress, setResetProgress] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isDetailsEnabled, setIsDetailsEnabled] = useState<boolean>(true);
  const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(false);
  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);

  const { isWaiting, isCompleted } = useBlockLatency({
    enabled: isBlockEnabled,
    blocksToWait: 2,
  });

  /**
   * Step #1:
   * Make Commitment
   * useNameDetails calls makeCommitment - look for #5
   */
  const {
    controller,
    rentPrice: { base },
    estimatedGas,
    estimatedGasPrice,
    hash,
    duration,
    secret,
    resolver,
    resolverAddr,
  } = useNameDetails({
    name,
    year,
    owner: address,
    payment,
    isEnabled: isDetailsEnabled,
  });

  const { commit, register, isLoading } = useRegister();
  const { approve, isApprovalLoading } = useTokenApproval();

  const { rentFee, totalFee, transactionFee } = useFees({
    rent: base,
    gasPrice: estimatedGasPrice,
    gasFee: estimatedGas,
    payment,
  });

  const isTransactionLoading = isLoading || isApprovalLoading || isWaiting;

  const initializeFlags = () => {
    // display progress bar
    setIsProgressVisible(true);
    // should always start to 0
    setResetProgress(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsDetailsEnabled(false);
    setAreBtnsDisabled(true);
  };

  const setFlagsWhenError = () => {
    setIsError(true);
    setAreBtnsDisabled(false);
    setResetProgress(false);
  };

  /**
   * Step #2:
   * Commit the hash generated by the makeCommitment.
   * Calls commit handler from useRegister hook.
   * This will only be triggered when the approval is successful - see useEffect listener
   */
  const handleCommit = async () => {
    initializeFlags();

    const hashStr = hash as unknown as string;
    const { isSuccess, error } = await commit({ hash: hashStr, controller });

    if (isSuccess) {
      setCooldown(true);
    } else {
      setFlagsWhenError();
    }

    setTimeout(() => {
      setIsCommitSuccess(isSuccess);
      setCooldown(false);
    }, COMMITMENT_AGE);
  };

  /**
   * Step #3:
   * Approve ERC20
   * calls approval handler from useRegister hook
   */
  const handleApproval = async () => {
    if (isCommitSuccess) {
      const { isSuccess } = await approve({
        payment,
        fee: totalFee,
      });

      if (isSuccess) {
        setIsApprovalSuccess(isSuccess);
      } else {
        setFlagsWhenError();
      }
    }
  };

  /**
   * Step #4:
   * Register the name.
   * Calls register handler from useRegister hook.
   * This will only be triggered when the commit is successful - see useEffect listener
   */
  const handleRegister = async () => {
    if (isApprovalSuccess) {
      const { isSuccess } = await register({
        controller,
        resolver,
        fees: {
          gasPrice: estimatedGasPrice,
          rent: rentFee,
          totalFee: totalFee,
        },
        args: {
          name,
          owner: address as Address,
          duration,
          secret,
          resolverAddr,
          payment,
        },
      });

      if (isSuccess) {
        setIsBlockEnabled(true);
      } else {
        setFlagsWhenError();
      }
    }
  };

  useEffect(() => {
    if (isCompleted) {
      // Data Invalidation: Refresh Dashboard
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      updateName({ status: "Registered" });
      setIsRegisterSuccess(true);
    }
  }, [isCompleted]);

  useEffect(() => {
    handleApproval();
  }, [isCommitSuccess]);

  useEffect(() => {
    handleRegister();
  }, [isApprovalSuccess]);

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal closes
    if (!isModalOpen) {
      updateName({ ...nameInitialState, name });
    }
  }, [isModalOpen]);

  return (
    <Grid mt={6} minWidth={250} maxWidth={400}>
      <Form
        isShowing={!isRegisterSuccess}
        rentFee={rentFee}
        totalFee={totalFee}
        transactionFee={transactionFee}
      />
      <FlexCenter marginY={2.5}>
        <Relative>
          <BoxContainer isVisible={isProgressVisible} display="flex">
            <ProgressBar
              isError={isError}
              isPaused={!isTransactionLoading}
              isVisible={isProgressVisible}
              isSuccess={isRegisterSuccess}
            />
            <Collapse orientation="horizontal" in={isCooldown}>
              <CircularProgress isVisible={isCooldown} countdown />
            </Collapse>
          </BoxContainer>
          {isCooldown && (
            <FlexLeft>
              <Tip isVisible={isCooldown}>
                Please wait for 60 seconds before the transaction proceeds.
              </Tip>
            </FlexLeft>
          )}
          <FlexCenter>
            <Tip isVisible={isRegisterSuccess}>View Transaction</Tip>
          </FlexCenter>
          <FlexCenter>
            <Tip isVisible={!isProgressVisible}>
              Avoid paying yearly transaction fees by selecting a longer
              registration period.
            </Tip>
          </FlexCenter>
        </Relative>
      </FlexCenter>

      {/* Hide these action buttons after the registration */}
      {!isRegisterSuccess && (
        <Grid mt={3}>
          {address ? (
            <FlexJustified>
              <ActionButton
                disabled={areBtnsDisabled}
                onClick={() => {
                  toggleModal({
                    id: "Registration Info",
                    title: "Registration Process",
                  });
                }}
                sx={{
                  "&.MuiButton-text": {
                    padding: "0",
                  },
                }}
              >
                <ViewProcessText disabled={areBtnsDisabled}>
                  View Registration Process
                </ViewProcessText>
              </ActionButton>
              <FlexRight>
                <ActionButton
                  disabled={areBtnsDisabled}
                  sx={{ marginRight: 1 }}
                  variant="text"
                  onClick={() => {
                    closeModal();
                  }}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  disabled={areBtnsDisabled}
                  variant="contained"
                  onClick={() => {
                    handleCommit();
                  }}
                >
                  Confirm
                </ActionButton>
              </FlexRight>
            </FlexJustified>
          ) : (
            <FlexCenter>
              <ToolbarButton
                variant="contained"
                onClick={() => {
                  toggleModal({
                    id: "Wallets",
                    isXDisabled: true,
                    title: address ? "Switch Wallet" : "Choose your Wallet",
                  });
                }}
              >
                <Image
                  src="/icons/wallet.svg"
                  alt="Wallet Icon"
                  width={24}
                  height={24}
                  style={{ marginRight: "8px", color: "white" }}
                />
                Connect Wallet
              </ToolbarButton>
            </FlexCenter>
          )}
        </Grid>
      )}

      {/* Only show the share button when the registration is successful */}
      {!isTweetVerified && isRegisterSuccess && (
        <Grid mt={3}>
          <FlexCenter>
            <ShareTip>
              Help us spread the word by sharing your new RNS on X.
            </ShareTip>
          </FlexCenter>
          <FlexCenter>
            <ShareButton
              variant="contained"
              onClick={() => {
                toggleModal({
                  id: "Share RNS",
                  title: "",
                  fullHeight: true,
                  fullWidth: true,
                });
              }}
            >
              <TwitterIcon fontSize="small" />
              <Divider orientation="vertical" flexItem />
              <ShareLabel>Share</ShareLabel>
            </ShareButton>
          </FlexCenter>
        </Grid>
      )}
    </Grid>
  );
};

export default RegisterName;
