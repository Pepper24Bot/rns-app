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
  Relative,
  SkeletonTypography,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Grid, InputAdornment, alpha, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { Payment, useDomainState } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/constants/components";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "ethers/lib/utils";

import MenuField from "@/components/Reusables/MenuField";

const SummaryContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
}));

const NameField = styled(ModalInputField)(({ theme }) => ({
  maxWidth: "500px",

  [theme.breakpoints.down(800)]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

const Transaction = styled(FlexJustified)(({ theme }) => ({}));

const TransactionLabel = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: FONT_WEIGHT.Regular,
  color: alpha(theme.palette.text.primary, 0.6),
}));

const Value = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "18px",
  textAlign: "right",
}));

const Balance = styled(TransactionLabel)(({ theme }) => ({
  fontSize: "14px",
  color: alpha(theme.palette.text.primary, 0.25),
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

export interface FormProps {
  name?: string;
  rentFee?: number;
  transactionFee?: number;
  totalFee?: number;
  walletBalance?: number;

  /** hide form when transaction is successful */
  isShowing?: boolean;
}

export const Form: React.FC<FormProps> = (props: FormProps) => {
  const { name: nameProp, isShowing = true, rentFee, walletBalance } = props;

  // Get the native currency balance
  const { address = "0x" } = useAccount();
  const { data: balance, isLoading: isXrpLoading } = useBalance({
    address,
  });

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
        <FieldContainer py={1.25} px={3.125}>
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
            <Grid py={1}>
              <Transaction>
                <TransactionLabel pr={2}>
                  {`${year} ${getYearLabel()} Registration`}
                </TransactionLabel>
                <Relative>
                  <SkeletonTypography isloading={!rentFee} />
                  <Value isloading={!rentFee}>{`${rentFee?.toFixed(6)} ${
                    payment?.label
                  }`}</Value>
                </Relative>
              </Transaction>
              <Transaction pt={0.5}>
                <Balance pr={2}>Connected Wallet Balance</Balance>
                <Relative>
                  <SkeletonTypography isloading={!walletBalance} />
                  <Balance isloading={!walletBalance}>
                    {walletBalance?.toFixed(6)}
                  </Balance>
                </Relative>
              </Transaction>
            </Grid>
            <Grid py={1}>
              <Transaction>
                <TransactionLabel pr={2}>Transaction fees</TransactionLabel>
                <Value>XRP</Value>
              </Transaction>
              <Transaction pt={0.5}>
                <Balance pr={2}>EOA Wallet Balance</Balance>
                <Relative>
                  <SkeletonTypography isloading={isXrpLoading} />
                  <Balance isloading={isXrpLoading}>
                    {Number(formatEther(balance?.value ?? 0)).toFixed(6)}
                  </Balance>
                </Relative>
              </Transaction>
            </Grid>
          </SummaryContainer>
        </FieldContainer>
      </Collapse>
    </Grid>
  );
};

export default Form;
