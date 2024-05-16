import React, { useEffect, useState } from "react";
import {
  FlexCenter,
  ToolbarButton,
  FlexRight,
  ActionButton,
  SecondaryLabel,
  Relative,
  Tip,
  ShareButton,
  FlexJustified,
  FlexLeft,
  ErrorTip,
  Flex,
  InformationTip,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Divider, Grid, alpha, styled } from "@mui/material";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address } from "viem";
import { COMMITMENT_AGE, PAYMENT_METHOD } from "@/constants/components";
import { X } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { parseCookie } from "@/utils/common";

import CircularProgress from "../Reusables/CircularProgressWithLabel";
import Image from "next/image";
import useNameDetails from "@/hooks/useNameDetails";
import useRegister from "@/hooks/useRegister";
import Form from "./Form";
import useFees from "@/hooks/useFees";
import ProgressBar from "../Reusables/ProgressBar";
import useToken from "@/hooks/useToken";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";

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
  const { address = "" } = useAccount();
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

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isDetailsEnabled, setIsDetailsEnabled] = useState<boolean>(true);
  const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(true);
  const [isBalanceSufficient, setBalanceSufficient] = useState<boolean>(true);
  const [isSkipCommit, setSkipCommit] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");

  const [isBlockEnabled, setIsBlockEnabled] = useState<boolean>(false);
  const [isApprovedStarted, setIsApprovedStarted] = useState<boolean>(false);

  const { isCompleted: isApproved } = useBlockLatency({
    enabled: isApprovedStarted,
    blocksToWait: 3,
  });

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
    rentPrice: { base },
    hash,
    duration,
    secret,
    resolver,
    resolverAddr,
  } = useNameDetails({
    name,
    year,
    payment,
    isEnabled: isDetailsEnabled,
  });

  const { commit, register, isLoading, commitments } = useRegister();
  const { approve, isApprovalLoading, getBalance } = useToken();

  const { rentFee } = useFees({
    rent: base,
    payment,
  });

  const isTransactionLoading = isLoading || isApprovalLoading || isWaiting;
  const hashStr = hash as unknown as string;

  const initializeFlags = () => {
    // display progress bar
    setIsProgressVisible(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsDetailsEnabled(false);
    setAreBtnsDisabled(true);
  };

  const setFlagsWhenError = () => {
    setIsError(true);
    setAreBtnsDisabled(false);
  };

  /**
   * Step #2:
   * check if the commitment (hash generated from makeCommitment)
   * has already been committed within 24 hours, if so, do not make
   * another commitment but proceed to the token approval / registration
   * transactions.
   */
  const getCommitment = async () => {
    const { data, isSuccess } = await commitments({ hash: hashStr });
    if (isSuccess) {
      setSkipCommit(data.isCommitmentValid);
    }
    setAreBtnsDisabled(false);
  };

  /**
   * Step #3:
   * Commit the hash generated by the makeCommitment.
   * Calls commit handler from useRegister hook.
   * This will only be triggered when the approval is successful - see useEffect listener
   */
  const handleCommit = async () => {
    if (isBalanceSufficient) {
      initializeFlags();

      if (!isSkipCommit) {
        const { isSuccess, error } = await commit({ hash: hashStr });

        if (isSuccess) {
          setCooldown(true);
        } else {
          setFlagsWhenError();
        }

        setTimeout(() => {
          setIsCommitSuccess(isSuccess);
        }, COMMITMENT_AGE);
      } else {
        setCooldown(true);
        setTimeout(() => {
          setIsCommitSuccess(true);
        }, 1000);
        setTimeout(() => {
          setCooldown(false);
        }, 2000);
      }
    }
  };

  /**
   * Step #4:
   * Approve ERC20
   * calls approval handler from useRegister hook
   */
  const handleApproval = async () => {
    if (isCommitSuccess) {
      /**
       * Recommended slippage: 5-10%
       * https://docs.ens.domains/registry/eth#registering
       */
      const slippage = 0.1;
      const { isSuccess } = await approve({
        payment,
        fee: rentFee * (1 + slippage),
      });

      if (isSuccess) {
        setIsApprovalSuccess(isSuccess);
        setIsApprovedStarted(true);
      } else {
        setFlagsWhenError();
      }
    }
  };

  /**
   * Step #5:
   * Register the name.
   * Calls register handler from useRegister hook.
   * This will only be triggered when the commit is successful - see useEffect listener
   */
  const handleRegister = async () => {
    const paymentAddress = (payment?.address ||
      PAYMENT_METHOD[0].address) as Address;

    if (isApprovalSuccess && isApproved) {
      const { isSuccess, data } = await register({
        resolver,
        args: {
          name,
          owner: address,
          duration,
          secret,
          resolverAddr,
          paymentAddress,
        },
      });

      if (isSuccess) {
        setIsBlockEnabled(true);
        setTxHash(data.hash);
      } else {
        setFlagsWhenError();
      }
    }
  };

  // on initial load only - get the commitment's validity
  useEffect(() => {
    if (hash) {
      getCommitment();
    }
  }, [hash]);

  // check wallet balance before doing transaction
  useEffect(() => {
    const getBalanceOf = async () => {
      const { data } = await getBalance({
        payment,
        fee: rentFee,
      });

      setBalanceSufficient(data.isBalanceSufficient);
      setAreBtnsDisabled(!data.isBalanceSufficient);
    };

    if (hash) {
      getBalanceOf();
    }
  }, [rentFee, hash]);

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
    if (!isSkipCommit) {
      setCooldown(false);
    }
  }, [isCommitSuccess]);

  useEffect(() => {
    handleRegister();
  }, [isApprovalSuccess, isApproved]);

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal closes
    if (!isModalOpen) {
      updateName({ ...nameInitialState, name });
    }
  }, [isModalOpen]);

  return (
    <Grid mt={6} minWidth={250} maxWidth={400}>
      <Form isShowing={!isRegisterSuccess} rentFee={rentFee} />
      <FlexCenter py={2}>
        <Relative>
          <Collapse in={!isBalanceSufficient}>
            <FlexCenter pb={3}>
              <ErrorTip>Registration fees exceed wallet balance</ErrorTip>
            </FlexCenter>
          </Collapse>
          <Collapse in={isProgressVisible}>
            <Flex>
              <ProgressBar
                isError={isError}
                isPaused={!isTransactionLoading}
                isVisible={isProgressVisible}
                isSuccess={isRegisterSuccess}
              />
              <Collapse orientation="horizontal" in={isCooldown}>
                <CircularProgress
                  countdown
                  isVisible={isCooldown}
                  isSuccess={isCommitSuccess}
                />
              </Collapse>
            </Flex>
          </Collapse>
          <Collapse in={isCooldown}>
            <FlexLeft>
              <Tip>
                Please wait for 60 seconds before the transaction proceeds.
              </Tip>
            </FlexLeft>
          </Collapse>
          <ViewTransaction isVisible={isRegisterSuccess} hash={txHash} />
          <Collapse in={!isProgressVisible}>
            <FlexCenter>
              <Tip>
                Avoid paying yearly transaction fees by selecting a longer
                registration period.
              </Tip>
            </FlexCenter>
          </Collapse>
        </Relative>
      </FlexCenter>

      {/* Hide these action buttons after the registration */}
      <Collapse in={!isRegisterSuccess}>
        <Grid pt={2}>
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
                <InformationTip title="Ooops! We are not live yet!" arrow>
                  <Grid>
                    <ActionButton
                      // disabled={areBtnsDisabled}
                      disabled
                      variant="contained"
                      onClick={() => {
                        if (!isApprovalSuccess && isCommitSuccess) {
                          setIsError(false);
                          setAreBtnsDisabled(true);
                          handleApproval();
                        } else if (!isRegisterSuccess && isApprovalSuccess) {
                          setIsError(false);
                          setAreBtnsDisabled(true);
                          handleRegister();
                        } else {
                          handleCommit();
                        }
                      }}
                    >
                      Confirm
                    </ActionButton>
                  </Grid>
                </InformationTip>
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
      </Collapse>

      {/* <Collapse in={!isTweetVerified && isRegisterSuccess}> */}
      <Collapse in={false}>
        <Grid mt={3}>
          <FlexCenter>
            <ShareTip isDisabled={true}>
              Help us spread the word by sharing your new RNS on X.
            </ShareTip>
          </FlexCenter>
          <FlexCenter>
            <ShareButton
              disabled
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
              <ShareLabel isDisabled={true}>Share</ShareLabel>
            </ShareButton>
          </FlexCenter>
        </Grid>
      </Collapse>
    </Grid>
  );
};

export default RegisterName;
