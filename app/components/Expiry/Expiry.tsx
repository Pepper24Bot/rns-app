import React, { useEffect, useState } from "react";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useModalState } from "@/redux/modal/modalSlice";
import { useAccount } from "wagmi";
import {
  Grid,
  IconButton,
  alpha,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  FlexRight,
  ActionButton,
  SecondaryLabel,
  FlexLeft,
} from "../Theme/StyledGlobal";
import { KeyboardBackspace } from "@mui/icons-material";

import Form from "../Registration/Form";
import Summary from "./Summary";
import useFees from "@/hooks/useFees";
import useExtend from "@/hooks/useExtendExpiry";
import EnsImage from "../Reusables/EnsImage";

const SummaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

const DetailsContainer = styled(Grid)(({ theme }) => ({
  width: "350px",

  [theme.breakpoints.between("miniTablet", "tablet")]: {
    width: "max-content",
  },

  [theme.breakpoints.down("miniTablet")]: {
    width: "100%",
  },
}));

export const Expiry: React.FC = () => {
  const { address } = useAccount();

  const { useDomain, updateName } = useDomainState();
  const { labelName = "", name = "", year = 1 } = useDomain();

  const { closeModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  /**
   * Page 01 = Extend Expiry Form
   * Page 02 = Summary Form
   */
  const [extendPage, setExtendPage] = useState<number>(1);
  const [isPending, setIsPending] = useState<boolean>(false);

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
    setIsPending(true);

    const { isSuccess, error } = await renew({
      name: labelName,
      duration,
      owner: address,
      fees: { rent: rentFee as string },
    });

    if (isSuccess) {
      // closeModal();
    }
    setIsPending(false);
  };

  useEffect(() => {
    // TODO: Fix this, should not manually resetting the name details here in this component
    // TODO: Find a way to reset the values when the modal is closed
    if (!isModalOpen) {
      updateName({ ...nameInitialState, name });
    }
  }, [isModalOpen]);

  return (
    <Grid container mt={6} minWidth={250} sx={{ placeContent: "center" }}>
      <EnsImage />
      <DetailsContainer item>
        {extendPage === 1 ? (
          <Form
            name={name}
            rent={base}
            gasFee={estimatedGas}
            gasPrice={estimatedGasPrice}
          />
        ) : (
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
        )}
        <Grid mt={3}>
          <FlexRight>
            <ActionButton
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </ActionButton>
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
              {isPending && (
                <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
              )}
            </ActionButton>
          </FlexRight>
        </Grid>
      </DetailsContainer>
    </Grid>
  );
};

export default Expiry;
