import React from "react";
import {
  BaseButton,
  ModalInputField,
  SecondaryLabel,
  FieldContainer,
  FlexJustified,
  AvailableText,
  NotAvailableText,
  RegisteredText,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Grid, InputAdornment, alpha, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { Payment, useDomainState } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import { FONT_WEIGHT } from "@/components/Theme/Global";

import MenuField from "@/components/Reusables/MenuField";

const SummaryContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
}));

const NameField = styled(ModalInputField)(({ theme }) => ({
  maxWidth: "500px",
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
  name?: string;
  rentFee?: number;
  transactionFee?: number;
  totalFee?: number;

  /** hide form when transaction is successful */
  isShowing?: boolean;
}

export const Form: React.FC<Form> = (props: Form) => {
  const {
    name: nameProp,
    isShowing = true,
    rentFee,
    transactionFee,
    totalFee,
  } = props;

  const { useDomain, increaseYear, decreaseYear, updatePaymentOption } =
    useDomainState();

  const { name, payment, year, status } = useDomain();

  const getYearLabel = () => {
    return year && year > 1 ? "Years" : "Year";
  };

  return (
    <Grid minWidth={250}>
      <NameField
        disabled
        value={nameProp ? nameProp : `${name}.root`}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {status === "Available" ? (
                <AvailableText>{status}</AvailableText>
              ) : status === "Registered" ? (
                <RegisteredText>Registered By You</RegisteredText>
              ) : (
                <NotAvailableText>{status}</NotAvailableText>
              )}
            </InputAdornment>
          ),
        }}
      />
      <Collapse in={isShowing}>
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
          selectedOption={{ label: payment?.label as string }}
          options={PAYMENT_METHOD}
          handleOptionSelect={(option) => {
            updatePaymentOption(option as Payment);
          }}
        />
        <FieldContainer>
          <SummaryContainer>
            <Transaction>
              <TransactionLabel>{`${year} ${getYearLabel()} Registration`}</TransactionLabel>
              <Value>{`${rentFee?.toFixed(6)} ${payment?.label}`}</Value>
            </Transaction>
            <Transaction>
              <TransactionLabel>Transaction Fee</TransactionLabel>
              <Value>{`${transactionFee?.toFixed(6)} ${payment?.label}`}</Value>
            </Transaction>
            <Transaction>
              <TransactionLabel>Total</TransactionLabel>
              <Value>{`${totalFee?.toFixed(6)} ${payment?.label}`}</Value>
            </Transaction>
          </SummaryContainer>
        </FieldContainer>
      </Collapse>
    </Grid>
  );
};

export default Form;
