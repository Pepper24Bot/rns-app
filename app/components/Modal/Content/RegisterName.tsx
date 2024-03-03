import React, { useEffect, useState } from "react";
import {
  BaseButton,
  InputField,
  SecondaryLabel,
  FieldContainer,
  FlexJustified,
  FlexCenter,
  ToolbarButton,
  FlexRight,
  ActionButton,
} from "@/components/Theme/StyledGlobal";
import { CircularProgress, Grid, alpha, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { PaymentMethod, useDomainState } from "@/redux/domain/domainSlice";
import { COMMITMENT_AGE, PAYMENT_METHOD } from "@/services/constants";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { useAccount, useWriteContract } from "wagmi";
import { useModalState } from "@/redux/modal/modalSlice";
import { Address } from "viem";

import MenuField from "@/components/Reusables/MenuField";
import Image from "next/image";
import useRegistrationDetails from "@/hooks/useRegistrationDetails";
import useRegister from "@/hooks/useRegister";
import useFees from "@/hooks/useFees";
import { prepareTransactionRequest } from "@wagmi/core";
import { isScalarType } from "graphql";

const NameField = styled(InputField)(({ theme }) => ({
  ".MuiInputBase-root": {
    "&.MuiOutlinedInput-root": {
      fontSize: "16px",
      padding: "16px 25px",
    },
  },
}));

const SummaryContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
}));

const Transaction = styled(FlexJustified)(({ theme }) => ({
  padding: "5px 0",
}));

const TransactionLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: FONT_WEIGHT.Light,
  color: alpha(theme.palette.primary.contrastText, 0.5),
}));

const Value = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
}));

const Tip = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "12px",
  color: alpha(theme.palette.primary.contrastText, 0.25),
  width: "calc(100% - 64px)",
  textAlign: "center",
}));

const Button = styled(BaseButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  "&.MuiButtonBase-root": {
    backgroundColor: theme.palette.primary.dark,
    filter: `drop-shadow(0px 0px 15px ${alpha(
      theme.palette.background.paper,
      0.5
    )})`,

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
  },
}));

export const RegisterName: React.FC = () => {
  const { address } = useAccount();
  const { useDomain } = useDomainState();
  const { name, payment } = useDomain();
  const { closeModal, toggleModal } = useModalState();

  const [yearCount, setYearCount] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<PaymentMethod>(
    payment?.method || "ROOT"
  );

  const { writeContractAsync, isPending, isSuccess } = useWriteContract();

  const {
    controller,
    availability,
    duration,
    rentPrice,
    nameHash,
    resolverAddr,
    estimatedGas,
  } = useRegistrationDetails({
    name,
    action: "Registration",
    year: yearCount,
    owner: address,
  });

  const { hash } = useRegister({
    name,
    owner: address as Address,
    duration,
    nameHash,
    resolverAddr,
    isAvailable: Boolean(availability),
  });

  // console.log(
  //   "details:: ",
  //   availability,
  //   duration,
  //   rentPrice,
  //   nameHash,
  //   resolverAddr
  // );

  // TODO: add hook and fix computation
  const { rentFee, transactionFee, totalFee } = useFees({
    rent: rentPrice?.base,
    transaction: estimatedGas,
  });

  const handleRegister = async () => {
    if (hash) {
      await writeContractAsync({
        abi: controller.abi,
        address: controller.address,
        functionName: "commit",
        args: [hash],
      });

      setTimeout(() => {
        console.log("waiting for commitment age...");
      }, COMMITMENT_AGE);
    }
  };

  useEffect(() => {
    const register = async () => {
      if (!isPending && isSuccess) {
        await writeContractAsync({
          abi: controller.abi,
          address: controller.address,
          functionName: "register",
          args: [hash],
        });

        closeModal();
      }
    };

    register();
  }, [isPending, isSuccess]);

  return (
    <Grid mt={6} minWidth={350}>
      <NameField value={`${name}.root`} />
      <FieldContainer sx={{ padding: "10px 25px" }}>
        <Button
          disabled={yearCount === 1}
          onClick={() => {
            setYearCount(yearCount - 1);
          }}
        >
          <Remove />
        </Button>
        <Value>{`${yearCount} Year`}</Value>
        <Button
          onClick={() => {
            setYearCount(yearCount + 1);
          }}
        >
          <Add />
        </Button>
      </FieldContainer>
      <MenuField
        label="Payment Method"
        selectedOption={selectedOption}
        options={PAYMENT_METHOD}
        handleOptionSelect={(option) => {
          setSelectedOption(option as PaymentMethod);
        }}
      />
      <FieldContainer>
        <SummaryContainer>
          <Transaction>
            <TransactionLabel>{`${yearCount} Year/s Registration`}</TransactionLabel>
            <Value>{`${rentFee} ${selectedOption}`}</Value>
          </Transaction>
          <Transaction>
            <TransactionLabel>Transaction Fee</TransactionLabel>
            <Value>{`${transactionFee} ${selectedOption}`}</Value>
          </Transaction>
          <Transaction>
            <TransactionLabel>Total</TransactionLabel>
            <Value>{`${totalFee} ${selectedOption}`}</Value>
          </Transaction>
        </SummaryContainer>
      </FieldContainer>
      <FlexCenter marginY={2.5}>
        <Tip>
          Avoid paying yearly transaction fees by selecting a longer
          registration period.
        </Tip>
      </FlexCenter>
      <Grid mt={5}>
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
