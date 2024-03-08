import React, { useEffect, useState } from "react";
import {
  FlexCenter,
  ToolbarButton,
  FlexRight,
  ActionButton,
} from "@/components/Theme/StyledGlobal";
import { CircularProgress, Grid } from "@mui/material";
import {
  initialState as nameInitialState,
  useDomainState,
} from "@/redux/domain/domainSlice";
import { useAccount } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address } from "viem";

import Image from "next/image";
import useRegistrationDetails from "@/hooks/useRegistrationDetails";
import useRegister from "@/hooks/useRegisterName";
import Form from "./Form";
import useFees from "@/hooks/useFees";

export const RegisterName: React.FC = () => {
  const { address } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { name = "", year = 1 } = useDomain();
  const { closeModal, toggleModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const [isPending, setIsPending] = useState<boolean>(false);
  const [isCommitSuccess, setIsCommitSuccess] = useState<boolean>(false);

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
    setIsPending(true);
    // TODO: Careful with type casting
    const hashStr = hash as unknown as string;
    const { isSuccess } = await commit({ hash: hashStr, controller });

    setTimeout(() => {
      setIsPending(false);
      setIsCommitSuccess(isSuccess);
      console.log("waiting...");
    }, 60000);
  };

  const handleRegister = async () => {
    if (isCommitSuccess) {
      setIsPending(true);
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
        closeModal();
      }
      setIsPending(false);
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

  return (
    <Grid mt={6} minWidth={350}>
      <Form rent={base} gasFee={estimatedGas} gasPrice={estimatedGasPrice} />
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
              {isPending && (
                <CircularProgress color="secondary" size={18} sx={{ ml: 1 }} />
              )}
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
