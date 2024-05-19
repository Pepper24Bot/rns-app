import React, { useEffect, useState } from "react";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";
import { Collapse, Grid, IconButton, alpha, styled } from "@mui/material";
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
import { Domain } from "@/redux/graphql/hooks";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { useDispatch } from "react-redux";
import { PAYMENT_METHOD } from "@/constants/components";
import { formatUnits } from "viem";

import Form from "../Registration/Form";
import Summary from "./Summary";
import useFees from "@/hooks/useFees";
import useExtend from "@/hooks/useExtendExpiry";
import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";
import useToken from "@/hooks/useToken";
import useBlockLatency from "@/hooks/useBlockLatency";
import ViewTransaction from "../Reusables/ViewTransaction";

const SummaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const DetailsContainer = styled(Grid)(({ theme }) => ({
  width: "360px",
  display: "grid",
  alignContent: "space-between",

  [theme.breakpoints.between("miniTablet", "tablet")]: {
    width: "max-content",
  },

  [theme.breakpoints.down("miniTablet")]: {
    width: "100%",
  },
}));

export interface Expiry {
  domain?: Partial<Domain>;
  owner?: {
    id?: string;
  };
}

export const Expiry: React.FC<Expiry> = (props: Expiry) => {
  const { domain } = props;

  const { address = "" } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { year = 1, payment } = useDomain();

  const { closeModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const dispatch = useDispatch();

  const labelName = domain?.labelName || "";
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

  const { approve, isApprovalLoading, getBalance } = useToken();
  const {
    renew,
    duration,
    rentPrice: { base },
    isLoading,
  } = useExtend({
    name: labelName,
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
      name: labelName,
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
      if (address) {
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
      // Data Invalidation: Refresh Dashboard
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
      setIsPending(false);
    }
  }, [isExtended]);

  useEffect(() => {
    if (isApproved) {
      handleExtend();
    }
  }, [isApproved]);

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal is closed
    if (!isModalOpen) {
      updateName({ ...nameInitialState });
    }
  }, [isModalOpen]);

  return (
    <Grid container mt={6} minWidth={250} sx={{ placeContent: "center" }}>
      <EnsImage name={domain?.name || ""} />
      <DetailsContainer item>
        {extendPage === 1 ? (
          <>
            <Form
              name={domain?.name || ""}
              rentFee={rentFee}
              walletBalance={walletBalance}
            />
            <Collapse in={!isBalanceSufficient}>
              <FlexCenter py={2}>
                <ErrorTip>Registration fees exceed wallet balance.</ErrorTip>
              </FlexCenter>
            </Collapse>
          </>
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
        <Grid mt={2}>
          <FlexRight>
            <ActionButton
              disabled={isPending || isExtending}
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
                  isPending || isSuccess || isExtending || !isBalanceSufficient
                }
                variant="contained"
                onClick={() => {
                  if (extendPage === 1) {
                    // Move to the next page
                    setExtendPage(extendPage + 1);
                    updateName({ fee: { total: rentFee } });
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
      </DetailsContainer>
    </Grid>
  );
};

export default Expiry;
