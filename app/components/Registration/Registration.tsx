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

  const [progress, setProgress] = useState<number>(1);

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
    const hashStr = hash as unknown as string;
    const { isSuccess } = await commit({ hash: hashStr, controller });

    if (isSuccess) {
      setProgress(1);
      setIsProgressVisible(true);
    }

    setTimeout(() => {
      if (isSuccess) {
        setIsCommitSuccess(isSuccess);
      }
    }, COMMITMENT_AGE);
  };

  const handleRegister = async () => {
    if (isCommitSuccess) {
      setIsProgressVisible(true);
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
        setProgress(100);
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
    // TODO: Find a way to reset the values when the modal is closed
    if (!isModalOpen) {
      updateName({ ...nameInitialState, name });
    }
  }, [isModalOpen]);

  // TODO: Fix this
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        return prevProgress >= 95 && !isRegisterSuccess
          ? 95
          : isRegisterSuccess
          ? 100
          : prevProgress + 1;
      });
    }, 1350);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Grid mt={6} minWidth={350}>
      <Form rent={base} gasFee={estimatedGas} gasPrice={estimatedGasPrice} />
      <FlexCenter marginY={2.5}>
        <Relative>
          <BoxContainer isVisible={isProgressVisible}>
            <ProgressBar value={progress} isError={isRegisterError} />
          </BoxContainer>
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
