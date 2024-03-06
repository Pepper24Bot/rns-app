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

export const RegisterName: React.FC = () => {
  const { address } = useAccount();
  const { useDomain, updateName } = useDomainState();
  const { name = "", year = 1 } = useDomain();
  const { closeModal, toggleModal, useModal } = useModalState();
  const { isModalOpen } = useModal();

  const [isPending, setIsPending] = useState<boolean>(false);

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

  const handleRegister = async () => {
    setIsPending(true);
    // TODO: Careful with type casting
    const hashStr = hash as unknown as string;
    const { error, isSuccess } = await commit({ hash: hashStr, controller });

    console.log("success:: ", isSuccess);

    if (isSuccess) {
      register({
        controller,
        name,
        address: address as Address,
        duration,
        nameHash,
        resolverAddr,
      });
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
                handleRegister();
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
