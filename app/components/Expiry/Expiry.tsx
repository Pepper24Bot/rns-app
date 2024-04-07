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
import { graphqlApi } from "@/redux/graphql/graphqlSlice";
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
  const { year = 1 } = useDomain();

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

  const [isExtendSuccess, setIsExtendSuccess] = useState<boolean>(false);
  const [isExtendError, setIsExtendError] = useState<boolean>(false);

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [expiryHash, setExpiryHash] = useState<Address | undefined>(undefined);

  const { data } = useWaitForTransactionReceipt({
    hash: expiryHash,
  });

  const {
    renew,
    duration,
    rentPrice: { base },
    estimatedGas,
    estimatedGasPrice,
  } = useExtend({
    name: labelName,
    year,
    owner: address,
  });

  const { rentFee, totalFee } = useFees({
    rent: base,
    gasFee: estimatedGas,
    gasPrice: estimatedGasPrice,
  });

  const handleExtend = async () => {
    setIsProgressVisible(true);
    setIsPending(true);

    const { isSuccess, error, data } = await renew({
      name: labelName,
      duration,
      owner: address,
      fees: { rent: rentFee as string, totalFee: totalFee.toString() },
    });

    if (isSuccess) {
      setIsPending(false);
      setExpiryHash(data);
    } else {
      setIsExtendError(true);
    }
  };

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal is closed
    if (!isModalOpen) {
      updateName({ ...nameInitialState });
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (data?.blockHash) {
      // invalidate Name tag to trigger refetch of the useGetName hooks
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsExtendSuccess(true);
    }
  }, [data?.blockHash]);

  return (
    <Grid container mt={6} minWidth={250} sx={{ placeContent: "center" }}>
      <EnsImage />
      <DetailsContainer item>
        {extendPage === 1 ? (
          <Form
            name={domain?.name || ""}
            rent={base}
            gasFee={estimatedGas}
            gasPrice={estimatedGasPrice}
          />
        ) : (
          <>
            <Summary
              title={
                <FlexLeft>
                  <IconButton
                    onClick={() => {
                      // Go back to the previous page
                      setExtendPage(extendPage - 1);
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
                    isError={isExtendError}
                    isPaused={isPending}
                    isVisible={isProgressVisible}
                    isSuccess={isExtendSuccess}
                  />
                </BoxContainer>
                <FlexCenter>
                  <Tip isVisible={isProgressVisible}>View Transaction</Tip>
                </FlexCenter>
              </Relative>
            </FlexCenter>
          </>
        )}
        <Grid mt={3}>
          <FlexRight>
            {!isExtendSuccess && (
              <ActionButton
                sx={{ marginRight: 1 }}
                variant="text"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </ActionButton>
            )}
            {isExtendSuccess ? (
              <ActionButton
                variant="contained"
                onClick={() => {
                  closeModal();
                }}
              >
                Close
              </ActionButton>
            ) : (
              <ActionButton
                variant="contained"
                onClick={() => {
                  if (extendPage === 1) {
                    // Move to the next page
                    setExtendPage(extendPage + 1);
                    updateName({ fee: { total: totalFee } });
                  } else {
                    handleExtend();
                  }
                }}
              >
                {extendPage === 1 ? "Next" : "Confirm"}
              </ActionButton>
            )}
          </FlexRight>
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Expiry;
