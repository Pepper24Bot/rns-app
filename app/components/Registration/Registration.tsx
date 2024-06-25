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
  CloseButton,
  CloseIcon,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Divider, Grid, Link, alpha, styled } from "@mui/material";
import { useFormState } from "@/redux/form/formSlice";
import { useAccount, useBalance } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address, formatEther, formatUnits } from "viem";
import { COMMITMENT_AGE, PAYMENT_METHOD } from "@/constants/components";
import { FUTUREVERSE, QUESTIONS, VIDEO_TUTORIAL } from "@/constants/url";
import { X } from "@mui/icons-material";
import { FONT_WEIGHT } from "../Theme/Global";
import { red } from "@mui/material/colors";
import { useRootNetworkState } from "@/redux/rootNetwork/rootNetworkSlice";
import { isEmpty } from "lodash";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { TWEETS_RNS } from "@/constants/content";

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
import useFeatureToggle from "@/hooks/useFeatureToggle";

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

const HightlightText = styled("span")(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color: red[500],
  textDecoration: "underline",
}));

const ViewProcessText = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  fontSize: "12px",
  color: disabled ? theme.palette.primary.dark : theme.palette.primary.main,
}));

interface RegistrationProps {
  name: string; // label
}

export const RegisterName: React.FC<RegistrationProps> = (
  props: RegistrationProps
) => {
  const { name = "" } = props;
  const { address } = useAccount();
  const { useForm, resetFormState } = useFormState();
  const { year = 1, payment, primary } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { isFeatureEnabled } = useFeatureToggle();
  const { useRootNetwork } = useRootNetworkState();
  const { data: root } = useRootNetwork();
  const { closeModal, toggleModal } = useModalState();
  const { data: xrpBalance } = useBalance({
    address,
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const token = payment?.address || (PAYMENT_METHOD[0].address as Address);

  const [isCommitSuccess, setIsCommitSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isCooldown, setCooldown] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isDetailsEnabled, setIsDetailsEnabled] = useState<boolean>(true);
  const [areBtnsDisabled, setAreBtnsDisabled] = useState<boolean>(true);

  const [isBalanceSufficient, setBalanceSufficient] = useState<boolean>(true);
  const [isXrpSufficient, setXrpSufficient] = useState<boolean>(true);

  const [isSkipCommit, setSkipCommit] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const [isWatchingRegister, setWatchRegister] = useState<boolean>(false);
  const [isWatchingApproval, setWatchApproval] = useState<boolean>(false);

  const { isWaiting: isApproving, isCompleted: isApproved } = useBlockLatency({
    enabled: isWatchingApproval,
  });

  const { isWaiting: isRegistering, isCompleted: isRegistered } =
    useBlockLatency({
      enabled: isWatchingRegister,
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
    token,
    isEnabled: isDetailsEnabled,
    isPrimary: primary,
  });

  const { commit, register, isLoading, commitments } = useRegister();
  const { approve, isApprovalLoading, getBalance } = useToken();

  const { rentFee } = useFees({
    rent: base,
    payment,
  });

  const isTransactionLoading =
    isLoading || isApprovalLoading || isRegistering || isApproving;

  const hashStr = hash as unknown as string;

  const handleCloseModal = () => {
    resetFormState();
    closeModal();
    router.replace("/", { scroll: false });
  };

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
    if (isBalanceSufficient || isXrpSufficient) {
      initializeFlags();

      if (!isSkipCommit) {
        const { isSuccess } = await commit({ hash: hashStr });

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
      setWatchApproval(true);
    } else {
      setFlagsWhenError();
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

    const { isSuccess, data } = await register({
      resolver,
      args: {
        name,
        owner: address || "0x",
        duration,
        secret,
        resolverAddr,
        paymentAddress,
        isPrimary: primary,
      },
    });

    if (isSuccess) {
      setWatchRegister(true);
      setTxHash(data.hash);
    } else {
      setFlagsWhenError();
    }
  };

  /**
   * Share the newly registered name
   */
  const handleTweet = () => {
    const content = TWEETS_RNS[Math.floor(Math.random() * TWEETS_RNS.length)];

    const url = `http://twitter.com/intent/tweet?text=${encodeURIComponent(
      content
    )}`;

    if (typeof window !== "undefined") {
      window.open(url, "_blank");
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
    if (address) {
      const getBalanceOf = async () => {
        const { data } = await getBalance({
          payment,
          fee: rentFee,
        });

        const balance = formatUnits(data.balance, payment?.decimals ?? 6);
        setWalletBalance(Number(balance));

        setBalanceSufficient(data.isBalanceSufficient);
      };

      if (hash) {
        getBalanceOf();
      }
    }
  }, [rentFee, hash, payment?.address, address]);

  useEffect(() => {
    if (isCommitSuccess) {
      enqueueSnackbar("Request to register is completed!", { variant: "info" });
      handleApproval();
    }

    if (!isSkipCommit) {
      setCooldown(false);
    }
  }, [isCommitSuccess]);

  useEffect(() => {
    if (isApproved) {
      enqueueSnackbar("Token approval is completed!", { variant: "info" });
      handleRegister();
    }
  }, [isApproved]);

  useEffect(() => {
    if (isRegistered) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      enqueueSnackbar(
        "Congratulations! You have successfully registered a new identity!",
        { variant: "success" }
      );
    }
  }, [isRegistered]);

  useEffect(() => {
    if (xrpBalance?.value !== undefined) {
      const isSufficient =
        Number(formatEther(xrpBalance?.value ?? BigInt(0))) >= 5;
      setXrpSufficient(isSufficient);
    }
  }, [xrpBalance?.value]);

  return (
    <Grid mt={6} minWidth={250} maxWidth={400}>
      {isRegistered && (
        <CloseButton
          onClick={() => {
            handleCloseModal();
          }}
        >
          <CloseIcon />
        </CloseButton>
      )}
      <Grid maxHeight="70vh" overflow="overlay">
        <Form
          name={`${name}.root`}
          isShowing={!isRegistered}
          rentFee={rentFee}
          walletBalance={walletBalance}
          status={isRegistered ? "Registered" : "Available"}
          address={root?.address}
          isPrimaryEnabled={true}
        />
        <FlexCenter py={2}>
          <Relative>
            <Collapse in={!isBalanceSufficient}>
              <FlexCenter pb={3}>
                <ErrorTip>Registration fees exceed wallet balance.</ErrorTip>
              </FlexCenter>
            </Collapse>
            <Collapse in={!isXrpSufficient}>
              <FlexCenter pb={3}>
                <ErrorTip>
                  Approximately 5 XRP for gas fees is required per RNS
                  registration. Please top up your XRP balance in your EOA
                  wallet via the{" "}
                  <Link href={FUTUREVERSE} target="_blank">
                    <HightlightText>FuturePass Dashboard</HightlightText>
                  </Link>
                  . If you need help, view our{" "}
                  <Link href={VIDEO_TUTORIAL} target="_blank">
                    <HightlightText>video tutorial</HightlightText>
                  </Link>{" "}
                  and{" "}
                  <Link href={QUESTIONS} target="_blank">
                    <HightlightText>FAQ's.</HightlightText>
                  </Link>
                </ErrorTip>
              </FlexCenter>
            </Collapse>
            <Collapse in={isProgressVisible}>
              <Flex container>
                <Grid item xs>
                  <ProgressBar
                    isError={isError}
                    isPaused={!isTransactionLoading}
                    isVisible={isProgressVisible}
                    isSuccess={isRegistered}
                  />
                </Grid>
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
            <ViewTransaction isVisible={isRegistered} hash={txHash} />
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
      </Grid>

      {/* Hide these action buttons after the registration */}
      <Collapse in={!isRegistered}>
        <Grid pt={2}>
          {address ? (
            <FlexJustified>
              <ActionButton
                disabled={areBtnsDisabled}
                onClick={() => {
                  router.replace("/", { scroll: false });
                  toggleModal({
                    id: "Registration Info",
                    title: "Registration Process",
                    data: {
                      label: name,
                    },
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
                  disabled={areBtnsDisabled && !isRegistered}
                  sx={{ marginRight: 1 }}
                  variant="text"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  {isRegistered ? "Close" : "Cancel"}
                </ActionButton>
                <Grid>
                  <ActionButton
                    disabled={
                      areBtnsDisabled ||
                      !isBalanceSufficient ||
                      !isXrpSufficient ||
                      !isFeatureEnabled("Registration")
                    }
                    variant="contained"
                    onClick={() => {
                      if (!isApproved && isCommitSuccess) {
                        setIsError(false);
                        setAreBtnsDisabled(true);
                        handleApproval();
                      } else if (!isRegistered && isApproved) {
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
      <Collapse in={isRegistered && !isEmpty(root.futurePassAddress)}>
        <Grid mt={3}>
          <FlexCenter>
            <ShareTip isDisabled={true}>
              Help us spread the word by sharing your new RNS on X and go into
              the running to win monthly prizes!
            </ShareTip>
          </FlexCenter>
          <FlexCenter>
            <ShareButton
              variant="contained"
              onClick={() => {
                handleTweet();
              }}
            >
              <TwitterIcon fontSize="small" />
              <Divider orientation="vertical" flexItem />
              <ShareLabel>Share</ShareLabel>
            </ShareButton>
          </FlexCenter>
        </Grid>
      </Collapse>
    </Grid>
  );
};

export default RegisterName;
