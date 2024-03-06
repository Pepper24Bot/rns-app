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
  darken,
  styled,
  CircularProgress,
} from "@mui/material";
import {
  FlexRight,
  ActionButton,
  SecondaryLabel,
  FlexLeft,
} from "../Theme/StyledGlobal";
import { grey } from "@mui/material/colors";
import { KeyboardBackspace } from "@mui/icons-material";

import Image from "next/image";
import Form from "../Registration/Form";
import Summary from "./Summary";
import useFees from "@/hooks/useFees";
import useExtend from "@/hooks/useExtendExpiry";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",
}));

const SummaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "24px",
  color: alpha(theme.palette.text.primary, 0.5),
  paddingLeft: "15px",
}));

export const Expiry: React.FC = () => {
  const { address } = useAccount();

  const { useDomain, updateName } = useDomainState();
  const { name = "", year = 1 } = useDomain();

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
    name,
    year,
    owner: address,
  });

  const { totalFee } = useFees({
    rent: base,
    gasFee: estimatedGas,
    gasPrice: estimatedGasPrice,
  });

  const handleExtend = async () => {
    setIsPending(true);

    const { isSuccess, error } = await renew({ name, duration });

    if (isSuccess) {
      closeModal();
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
    <Grid>
      <Grid container mt={6} minWidth={300}>
        <ImageContainer item>
          <Image
            src="/images/rns-image-placeholder.svg"
            alt="Wallet Icon"
            width={290}
            height={200}
            style={{
              height: "fit-content",
              border: `solid 1px ${alpha(grey[50], 0.25)}`,
              borderRadius: "4px",
              boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,
            }}
          />
        </ImageContainer>
        <Grid item xs>
          {extendPage === 1 ? (
            <Form
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
        </Grid>
      </Grid>
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
            {isPending && (
              <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
            )}
            {extendPage === 1 ? "Next" : "Confirm"}
          </ActionButton>
        </FlexRight>
      </Grid>
    </Grid>
  );
};

export default Expiry;
