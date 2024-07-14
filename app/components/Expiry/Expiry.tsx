import React, { useEffect, useState } from "react";
import { useFormState } from "@/redux/form/formSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount, useBalance } from "wagmi";
import { Collapse, Grid, IconButton, Link, alpha, styled } from "@mui/material";
import {
  FlexRight,
  ActionButton,
  SecondaryLabel,
  FlexLeft,
  FlexCenter,
  Relative,
  ErrorTip,
} from "../Theme/StyledGlobal";
import { KeyboardBackspace } from "@mui/icons-material";
import { PAYMENT_METHOD } from "@/constants/components";
import { formatEther, formatUnits } from "viem";
import { FUTUREVERSE, QUESTIONS, VIDEO_TUTORIAL } from "@/constants/url";
import { red } from "@mui/material/colors";
import { FONT_WEIGHT } from "../Theme/Global";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { ExpiryProps } from "@/interfaces/global/transaction";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";

import Form from "../Registration/Form";
import Summary from "./Summary";
import useFees from "@/hooks/useFees";
import useExtend from "@/hooks/useExtendExpiry";
import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";
import useToken from "@/hooks/useToken";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";
import useFeatureToggle from "@/hooks/useFeatureToggle";
import GracePeriodTip from "../Reusables/GracePeriodTip";

const SummaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const FormContainer = styled(Grid)(({ theme }) => ({
  margin: "48px 0 20px 0",
  minWidth: "250px",
  maxHeight: "70vh",
  overflow: "overlay",
}));

const DetailsContainer = styled(Grid)(({ theme }) => ({
  width: "380px",
  display: "grid",
  alignContent: "space-between",

  [theme.breakpoints.down(735)]: {
    width: "100%",
  },
}));

const HightlightText = styled("span")(({ theme }) => ({
  fontWeight: FONT_WEIGHT.Bold,
  color: red[500],
  textDecoration: "underline",
}));

const Grace = styled(Grid)(({ theme }) => ({
  marginRight: "32px",

  [theme.breakpoints.down(735)]: {
    marginRight: "0",
    marginBottom: "10px",
  },
}));

export const Expiry: React.FC<ExpiryProps> = (props: ExpiryProps) => {
  const { item, address } = props;
  const { name, labelName, gracePeriod, expiryDate } = item;

  const { address: walletAddress = "0x" } = useAccount();
  const { data: xrpBalance } = useBalance({
    address: walletAddress,
  });

  const { useForm, updateFees, resetFormState } = useFormState();
  const { year = 1, payment } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const { closeModal } = useModalState();
  const { isFeatureEnabled } = useFeatureToggle();
  const { refetchRanking } = useLeaderboardState();

  const router = useRouter();
  const dispatch = useDispatch();
  const token = payment?.address || PAYMENT_METHOD[0].address;

  /**
   * Page 01 = Extend Expiry Form
   * Page 02 = Summary Form
   */
  const [extendPage, setExtendPage] = useState<number>(1);

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isDetailsEnabled, setIsDetailsEnabled] = useState<boolean>(true);
  const [isBalanceSufficient, setBalanceSufficient] = useState<boolean>(true);
  const [isXrpSufficient, setXrpSufficient] = useState<boolean>(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>("");

  const [isWatchingExtend, setWatchExtend] = useState<boolean>(false);
  const [isWatchingApproval, setWatchApproval] = useState<boolean>(false);

  const { isWaiting: isApproving, isCompleted: isApproved } = useBlockLatency({
    enabled: isWatchingApproval,
  });

  const { isWaiting: isExtending, isCompleted: isExtended } = useBlockLatency({
    enabled: isWatchingExtend,
  });

  const { approve, isApprovalLoading, getBalance, isBalanceLoading } =
    useToken();
  const {
    renew,
    duration,
    rentPrice: { base },
    isLoading,
  } = useExtend({
    name: labelName ?? "",
    year,
    token,
    isEnabled: isDetailsEnabled,
  });

  const { rentFee } = useFees({
    rent: base,
    payment,
  });

  const isTransactionLoading =
    isLoading || isApprovalLoading || isExtending || isApproving;

  const initializeFlags = () => {
    // display progress bar
    setIsPending(true);
    setIsProgressVisible(true);
    // in case the user rejected the transaction, reset the error status
    setIsError(false);
    setIsDetailsEnabled(false);
  };

  const handleApproval = async () => {
    initializeFlags();

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
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleExtend = async () => {
    const { isSuccess, data } = await renew({
      name: labelName ?? "",
      duration,
    });

    if (isSuccess) {
      setWatchExtend(true);
      setTxHash(data.hash);
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  // On initial load - check wallet balance before doing transaction
  useEffect(() => {
    const getBalanceOf = async () => {
      // TODO: Remove the rentfee check in whitelist branch
      if (address && rentFee) {
        const { data } = await getBalance({
          address,
          payment,
          fee: rentFee,
        });

        const balance = formatUnits(data.balance, payment?.decimals ?? 6);
        setWalletBalance(Number(balance));
        setBalanceSufficient(data.isBalanceSufficient);
      }
    };

    getBalanceOf();
  }, [address, rentFee, payment?.address]);

  useEffect(() => {
    if (isExtended) {
      // Refresh the data in Leaderboard
      refetchRanking();

      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      enqueueSnackbar(
        `Congratulations! You have successfully extended the expiry of ${
          name ?? ""
        }!`,
        { variant: "success" }
      );

      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isExtended]);

  useEffect(() => {
    if (isApproved) {
      enqueueSnackbar("Token approval is completed!", { variant: "info" });
      handleExtend();
    }
  }, [isApproved]);

  useEffect(() => {
    if (xrpBalance?.value !== undefined) {
      const isSufficient =
        Number(formatEther(xrpBalance?.value ?? BigInt(0))) >= 5;
      setXrpSufficient(isSufficient);
    }
  }, [xrpBalance?.value]);

  return (
    <Grid>
      <FormContainer container>
        <Grid item xs width="min-content">
          <EnsImage name={name ?? ""} />
          {extendPage === 1 && (
            <Grace>
              <GracePeriodTip
                expiryDate={expiryDate}
                gracePeriod={gracePeriod}
              />
            </Grace>
          )}
        </Grid>
        <DetailsContainer item>
          {extendPage === 1 ? (
            <Grid>
              <Form
                name={name ?? ""}
                rentFee={rentFee}
                walletBalance={walletBalance}
                isBalanceLoading={isBalanceLoading}
                address={address}
              />
              <Collapse in={!isBalanceSufficient}>
                <FlexCenter py={2}>
                  <ErrorTip>Registration fees exceed wallet balance.</ErrorTip>
                </FlexCenter>
              </Collapse>
              <Collapse in={!isXrpSufficient}>
                <FlexCenter py={2}>
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
            </Grid>
          ) : (
            <>
              <Summary
                title={
                  <FlexLeft>
                    <IconButton
                      disabled={isPending || isSuccess}
                      onClick={() => {
                        // Go back to the previous page
                        setExtendPage(extendPage - 1);
                        setIsProgressVisible(false);
                      }}
                    >
                      <KeyboardBackspace />
                    </IconButton>
                    <SummaryLabel>Summary</SummaryLabel>
                  </FlexLeft>
                }
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
            </>
          )}
        </DetailsContainer>
      </FormContainer>
      <FlexRight>
        <ActionButton
          disabled={isPending || isExtending}
          sx={{ marginRight: 1 }}
          variant="text"
          onClick={() => {
            resetFormState();
            closeModal();
            router.replace("/", { scroll: false });
          }}
        >
          {isSuccess ? "Close" : "Cancel"}
        </ActionButton>
        <Collapse orientation="horizontal" in={!isSuccess}>
          <ActionButton
            disabled={
              isPending ||
              isSuccess ||
              isExtending ||
              !isBalanceSufficient ||
              !isXrpSufficient ||
              !isFeatureEnabled("Expiry")
            }
            variant="contained"
            onClick={() => {
              if (extendPage === 1) {
                // Move to the next page
                setExtendPage(extendPage + 1);
                updateFees({ total: rentFee });
              } else {
                if (isApproved) {
                  initializeFlags();
                  handleExtend();
                } else {
                  handleApproval();
                }
              }
            }}
          >
            {extendPage === 1 ? "Next" : "Confirm"}
          </ActionButton>
        </Collapse>
      </FlexRight>
    </Grid>
  );
};

export default Expiry;
