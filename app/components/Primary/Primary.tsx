import React, { useState } from "react";
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
import { Address } from "viem";
import { useDispatch } from "react-redux";
import { graphqlApi } from "@/redux/graphql/graphqlApi";
import ProgressBar from "../Reusables/ProgressBar";
import usePrimary from "@/hooks/usePrimary";

const Container = styled(FlexTop)(({ theme }) => ({}));

const ConfirmationText = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Light,
}));

export interface Primary {
  domain?: Partial<Domain>;
  owner?: {
    id?: string;
  };
}

export const Primary: React.FC<Primary> = (props: Primary) => {
  const { domain, owner } = props;
  const name = domain?.name || "";

  const dispatch = useDispatch();

  const { closeModal } = useModalState();
  const { setPrimaryName, isLoading } = usePrimary();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const initializeFlags = () => {
    // display progress bar
    setIsPending(true);
    setIsProgressVisible(true);
    setIsError(false);
    setIsSuccess(false);
  };

  const handleSetPrimary = async () => {
    initializeFlags();

    const { isSuccess } = await setPrimaryName({
      name: domain?.name || "",
      address: owner?.id as Address,
    });

    if (isSuccess) {
      dispatch(graphqlApi.util.invalidateTags(["Name"]));
      setIsSuccess(true);
    } else {
      setIsError(true);
    }

    setIsPending(false);
  };

  return (
    <Container>
      <EnsImage name={name} />
      <Grid pt={4} maxWidth={350}>
        <ConfirmationText pb={4}>
          Are you sure you want to use this name as your primary?
        </ConfirmationText>
        <InputField
          label="Linked To / Resolver"
          disabled
          focused
          value={name}
        />
        <FlexCenter marginY={1}>
          <Relative width="100%">
            <BoxContainer isVisible={isProgressVisible}>
              <ProgressBar
                isError={isError}
                isPaused={!isLoading}
                isVisible={isProgressVisible}
                isSuccess={isSuccess}
              />
            </BoxContainer>
            <FlexCenter>
              <Tip isVisible={isSuccess}>View Transaction</Tip>
            </FlexCenter>
          </Relative>
        </FlexCenter>
        <FlexRight pt={3}>
          <ActionButton
            disabled={isPending || isSuccess}
            sx={{ marginRight: 1 }}
            variant="text"
            onClick={() => {
              closeModal();
            }}
          >
            Cancel
          </ActionButton>
          <ActionButton
            disabled={isPending || isSuccess}
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
