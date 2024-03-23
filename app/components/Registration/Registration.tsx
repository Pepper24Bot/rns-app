import React, { useEffect, useState } from "react";
import {
  FlexCenter,
  ToolbarButton,
  FlexRight,
  ActionButton,
  SecondaryLabel,
  Relative,
} from "@/components/Theme/StyledGlobal";
import { Box, Grid, alpha, styled } from "@mui/material";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address } from "viem";
import { COMMITMENT_AGE } from "@/services/constants";

import Image from "next/image";
import useRegistrationDetails from "@/hooks/useRegistrationDetails";
import useRegister from "@/hooks/useRegisterName";
import Form from "./Form";
import useFees from "@/hooks/useFees";
import ProgressBar from "../Reusables/ProgressBar";

const Tip = styled(SecondaryLabel, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible?: boolean }>(({ isVisible, theme }) => ({
  fontSize: "12px",
  color: alpha(theme.palette.text.primary, 0.25),
  width: "calc(100% - 64px)",
  textAlign: "center",
  visibility: isVisible ? "visible" : "hidden",
}));

const BoxContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible?: boolean }>(({ isVisible }) => ({
  width: "100%",
  visibility: isVisible ? "visible" : "hidden",
}));

export const RegisterName: React.FC = () => {
  const { address } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { name = "", year = 1 } = useDomain();
  const { closeModal, toggleModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const [isProgressVisible, setIsProgressVisible] = useState<boolean>(false);
  const [isCommitSuccess, setIsCommitSuccess] = useState<boolean>(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const [isRegisterError, setIsRegisterError] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const {
    controller,
    rentPrice: { base },
    estimatedGas,
    estimatedGasPrice,
    hash,
    duration,
    nameHash,
    resolverAddr,
  } = useRegistrationDetails({
    name,
    year,
    owner: address,
  });

  const { commit, register } = useRegister();
  const { rentFee } = useFees({
    rent: base,
  });

  const handleCommit = async () => {
    setIsProgressVisible(true);
    setIsPaused(true);

    const hashStr = hash as unknown as string;
    const { isSuccess } = await commit({ hash: hashStr, controller });

    if (!isSuccess) {
      setIsRegisterError(true);
    }

    setTimeout(() => {
      if (isSuccess) {
        setIsCommitSuccess(isSuccess);
      }
    }, COMMITMENT_AGE);
  };

  const handleRegister = async () => {
    if (isCommitSuccess) {
      console.log("entering handleRegister...");
      setIsPaused(true);
      const { isSuccess } = await register({
        controller,
        fees: {
          gasPrice: estimatedGasPrice,
          rent: rentFee as string,
        },
        args: {
          name,
          owner: address as Address,
          duration,
          nameHash,
          resolverAddr,
        },
      });

      if (isSuccess) {
        setIsRegisterSuccess(true);
        setIsPaused(false);
      } else {
        setIsRegisterError(true);
      }
    }
  };

  useEffect(() => {
    handleRegister();
  }, [isCommitSuccess]);

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
        rent={base}
        gasFee={estimatedGas}
        gasPrice={estimatedGasPrice}
        isShowing={!isRegisterSuccess}
      />
      <FlexCenter marginY={2.5}>
        <Relative>
          <BoxContainer isVisible={isProgressVisible}>
            <ProgressBar
              isError={isRegisterError}
              isPaused={isPaused}
              isVisible={isProgressVisible}
            />
          </BoxContainer>
          <FlexCenter>
            <Tip isVisible={isProgressVisible}>View Transaction</Tip>
          </FlexCenter>
          <FlexCenter>
            <Tip isVisible={!isProgressVisible}>
              Avoid paying yearly transaction fees by selecting a longer
              registration period.
            </Tip>
          </FlexCenter>
        </Relative>
      </FlexCenter>
      <Grid mt={3}>
        {address ? (
          <FlexRight>
            <ActionButton
              disabled={isProgressVisible}
              sx={{ marginRight: 1 }}
              variant="text"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </ActionButton>
            <ActionButton
              disabled={isProgressVisible}
              variant="contained"
              onClick={() => {
                handleCommit();
              }}
            >
              Confirm
            </ActionButton>
          </FlexRight>
        ) : (
          <FlexCenter>
            <ToolbarButton
              variant="contained"
              onClick={() => {
                toggleModal({
                  id: "Wallets",
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
    </Grid>
  );
};

export default RegisterName;
