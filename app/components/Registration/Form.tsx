import React, { useState } from "react";
import {
  BaseButton,
  InputField,
  SecondaryLabel,
  FieldContainer,
  FlexJustified,
  FlexCenter,
} from "@/components/Theme/StyledGlobal";
import { Grid, alpha, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { PaymentMethod, useDomainState } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import { FONT_WEIGHT } from "@/components/Theme/Global";

import MenuField from "@/components/Reusables/MenuField";
import useFees from "@/hooks/useFees";

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
  color: alpha(theme.palette.text.primary, 0.5),
}));

const Value = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
}));

const Button = styled(BaseButton)(({ theme }) => ({
  color: theme.palette.text.primary,
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

export interface Form {
  rent: bigint;
  gasFee: bigint;
  gasPrice: bigint;
  name?: string;
}

export const Form: React.FC<Form> = (props: Form) => {
  const { rent, gasFee, gasPrice, name: nameProp } = props;

  const { useDomain, increaseYear, decreaseYear, updatePaymentOption } =
    useDomainState();

  const { name, payment, year } = useDomain();

  const { rentFee, transactionFee, totalFee } = useFees({
    rent,
    gasFee,
    gasPrice,
  });

  const getYearLabel = () => {
    return year && year > 1 ? "Years" : "Year";
  };

  return (
    <Grid minWidth={300}>
      <NameField disabled value={nameProp ? nameProp : `${name}.root`} />
      <FieldContainer sx={{ padding: "10px 25px" }}>
        <Button
          disabled={year === 1}
          onClick={() => {
            decreaseYear();
          }}
        >
          <Remove />
        </Button>
        <Value>{`${year} ${getYearLabel()}`}</Value>
        <Button
          onClick={() => {
            increaseYear();
          }}
        >
          <Add />
        </Button>
      </FieldContainer>
      <MenuField
        label="Payment Method"
        selectedOption={payment?.method as PaymentMethod}
        options={PAYMENT_METHOD}
        handleOptionSelect={(option) => {
          updatePaymentOption(option as PaymentMethod);
        }}
      />
      <FieldContainer>
        <SummaryContainer>
          <Transaction>
            <TransactionLabel>{`${year} ${getYearLabel()} Registration`}</TransactionLabel>
            <Value>{`${rentFee} ${payment?.method}`}</Value>
          </Transaction>
          <Transaction>
            <TransactionLabel>Transaction Fee</TransactionLabel>
            <Value>{`${transactionFee} ${payment?.method}`}</Value>
          </Transaction>
          <Transaction>
            <TransactionLabel>Total</TransactionLabel>
            <Value>{`${totalFee} ${payment?.method}`}</Value>
          </Transaction>
        </SummaryContainer>
      </FieldContainer>
    </Grid>
  );
};

export default Form;