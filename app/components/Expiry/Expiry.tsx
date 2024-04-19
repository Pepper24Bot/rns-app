import React, { useEffect, useState } from "react";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Grid, IconButton, alpha, styled } from "@mui/material";
import {
  FlexRight,
  ActionButton,
  SecondaryLabel,
  FlexLeft,
  BoxContainer,
  FlexCenter,
  Relative,
  Tip,
} from "../Theme/StyledGlobal";
import { KeyboardBackspace } from "@mui/icons-material";
import { Domain } from "@/redux/graphql/hooks";
import { Address } from "viem";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import { useDispatch } from "react-redux";

import Form from "../Registration/Form";
import Summary from "./Summary";
import useFees from "@/hooks/useFees";
import useExtend from "@/hooks/useExtendExpiry";
import EnsImage from "../Reusables/EnsImage";
import ProgressBar from "../Reusables/ProgressBar";

const SummaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const DetailsContainer = styled(Grid)(({ theme }) => ({
  width: "350px",
  height: "420px",
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

  const { address } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { year = 1, payment } = useDomain();

  const { closeModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const dispatch = useDispatch();
  const labelName = domain?.labelName || "";

  /**
   * Page 01 = Extend Expiry Form
   * Page 02 = Summary Form
   */
  const [extendPage, setExtendPage] = useState<number>(1);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [isApprovalSuccess, setIsApprovalSuccess] = useState<boolean>(false);
  const [isExtendSuccess, setIsExtendSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isDetailsEnabled, setIsDetailsEnabled] = useState<boolean>(true);

  const {
    renew,
    approve,
    duration,
    rentPrice: { base },
    estimatedGas,
    estimatedGasPrice,
    isLoading,
  } = useExtend({
    name: labelName,
    year,
    owner: address,
    payment,
    isEnabled: isDetailsEnabled,
  });

  const { rentFee, totalFee, transactionFee } = useFees({
    rent: base,
    gasFee: estimatedGas,
    gasPrice: estimatedGasPrice,
    payment,
  });

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

    const { isSuccess } = await approve({
      fee: totalFee,
    });

    if (isSuccess) {
      setIsApprovalSuccess(isSuccess);
    } else {
      setIsError(true);
      setIsPending(false);
    }
  };

  const handleExtend = async () => {
    if (isApprovalSuccess) {
      const { isSuccess, error, data } = await renew({
        name: labelName,
        duration,
        owner: address,
        fees: { rent: rentFee, totalFee: totalFee },
      });

      if (isSuccess) {
        dispatch(graphqlApi.util.invalidateTags(["Name"]));
        setIsExtendSuccess(true);
      } else {
        setIsError(true);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    handleExtend();
  }, [isApprovalSuccess]);

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal is closed
    if (!isModalOpen) {
      updateName({ ...nameInitialState });
    }
  }, [isModalOpen]);

  return (
    <Grid container mt={6} minWidth={250} sx={{ placeContent: "center" }}>
      <EnsImage />
      <DetailsContainer item>
        {extendPage === 1 ? (
          <Form
            name={domain?.name || ""}
            rentFee={rentFee}
            totalFee={totalFee}
            transactionFee={transactionFee}
          />
        ) : (
          <>
            <Summary
              title={
                <FlexLeft>
                  <IconButton
                    disabled={isPending}
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
            <FlexCenter marginY={2.5}>
              <Relative width="100%">
                <BoxContainer isVisible={isProgressVisible}>
                  <ProgressBar
                    isError={isError}
                    isPaused={!isLoading}
                    isVisible={isProgressVisible}
                    isSuccess={isExtendSuccess}
                  />
                </BoxContainer>
                <FlexCenter>
                  <Tip isVisible={isExtendSuccess}>View Transaction</Tip>
                </FlexCenter>
              </Relative>
            </FlexCenter>
          </>
        )}
        <Grid mt={3}>
          <FlexRight>
            <ActionButton
              disabled={isPending || isExtendSuccess}
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              disabled={isPending || isExtendSuccess}
              variant="contained"
              onClick={() => {
                if (extendPage === 1) {
                  // Move to the next page
                  setExtendPage(extendPage + 1);
                  updateName({ fee: { total: totalFee } });
                } else {
                  handleApproval();
                }
              }}
            >
              {extendPage === 1 ? "Next" : "Confirm"}
            </ActionButton>
          </FlexRight>
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Expiry;
