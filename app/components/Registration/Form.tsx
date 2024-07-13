import React, { useState } from "react";
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
  ToggleButtonGroup,
  ToggleButton,
  Flex,
  InformationTip,
} from "@/components/Theme/StyledGlobal";
import { Collapse, Grid, alpha, styled } from "@mui/material";
import { Add, Help, Remove } from "@mui/icons-material";
import { Payment, useFormState } from "@/redux/form/formSlice";
import { PAYMENT_METHOD } from "@/constants/components";
import { FONT_WEIGHT } from "@/components/Theme/Global";
import { useAccount, useBalance, useEnsName } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import { NameStatus } from "@/interfaces/global/types";
import { isEmpty } from "lodash";
import { Address } from "viem";

import MenuField from "@/components/Reusables/MenuField";
import TooltipContent from "../Reusables/TooltipContent";
import EndAdornment from "../Reusables/EndAdornment";

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

const PrimayField = styled(FlexJustified)(({ theme }) => ({
  alignItems: "center",
  padding: "10px 0",
}));

const PrimaryLabel = styled(SecondaryLabel)(({ theme }) => ({
  marginLeft: "5px",
  fontSize: "16px",
  color: alpha(theme.palette.text.primary, 0.5),
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

const ButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  minWidth: "100px",
}));

const Toggle = styled(ToggleButton)(({ theme }) => ({
  padding: "8px",
  height: "auto",
  backgroundColor: alpha(theme.palette.primary.dark, 0.1),

  "&.MuiToggleButton-root": {
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const ToggleValue = styled(PrimaryLabel, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ isSelected, theme }) => ({
  fontSize: "12px",
  color: isSelected
    ? theme.palette.text.primary
    : alpha(theme.palette.text.primary, 0.25),
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

export const HelpIcon = styled(Help)(({ theme }) => ({
  width: "20px",
  height: "20px",
  marginLeft: "12px",
  cursor: "pointer",
  color: theme.palette.primary.dark,
}));

export interface FormProps {
  name?: string;
  rentFee?: number;
  transactionFee?: number;
  totalFee?: number;
  walletBalance?: number;
  isBalanceLoading?: boolean;
  address?: Address;

  /** hide form when transaction is successful */
  isShowing?: boolean;
  status?: NameStatus;

  isPrimaryEnabled?: boolean;

  hasAscii?: boolean;
}

export const Form: React.FC<FormProps> = (props: FormProps) => {
  const {
    name,
    isShowing = true,
    rentFee,
    walletBalance,
    status,
    address,
    isPrimaryEnabled,
    isBalanceLoading,
    hasAscii,
  } = props;

  // Get the native currency balance
  const { address: walletAddress = "0x" } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: balance, isLoading: isXrpLoading } = useBalance({
    address: walletAddress,
  });

  const {
    useForm,
    increaseYear,
    decreaseYear,
    updatePaymentOption,
    setAsPrimary,
  } = useFormState();
  const { payment, year } = useForm();

  const [toggleValues, setToggleValues] = useState<boolean>(isEmpty(ensName));

  const getYearLabel = () => {
    return year && year > 1 ? "Years" : "Year";
  };

  const isPrimary = ensName === name;

  return (
    <Grid minWidth={250}>
      <NameField
        disabled
        value={name}
        InputProps={{
          endAdornment: (
            <EndAdornment isPrimary={isPrimary} hasAscii={hasAscii}>
              {status === "Available" ? (
                <AvailableText>{status}</AvailableText>
              ) : status === "Registered" ? (
                <RegisteredText>Registered By You</RegisteredText>
              ) : (
                <NotAvailableText>{status}</NotAvailableText>
              )}
            </EndAdornment>
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
        {isPrimaryEnabled && (
          <PrimayField>
            <Flex>
              <PrimaryLabel>Set as Primary</PrimaryLabel>
              <InformationTip
                arrow
                placement="bottom"
                title={
                  <TooltipContent content="Would you like to set your new RNS as your Primary Identity that will be displayed across third party applications, games and experiences instead of your long and complex wallet address?" />
                }
              >
                <HelpIcon />
              </InformationTip>
            </Flex>
            <ButtonGroup
              exclusive
              value={toggleValues}
              onChange={(_, value) => {
                if (value !== null) {
                  setAsPrimary(value);
                  setToggleValues(value);
                }
              }}
            >
              <Toggle value={true}>
                <ToggleValue isSelected={toggleValues}>YES</ToggleValue>
              </Toggle>
              <Toggle value={false}>
                <ToggleValue isSelected={!toggleValues}>NO</ToggleValue>
              </Toggle>
            </ButtonGroup>
          </PrimayField>
        )}
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
                  <SkeletonTypography isloading={isBalanceLoading} />
                  <Balance isloading={isBalanceLoading}>
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
