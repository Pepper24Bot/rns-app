import React, { useState } from "react";
import {
  BaseButton,
  InputField,
  SecondaryLabel,
  FieldContainer,
} from "@/components/Theme/StyledGlobal";
import { Grid, alpha, styled } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { PaymentMethod, useDomainState } from "@/redux/domain/domainSlice";
import { PAYMENT_METHOD } from "@/services/constants";
import MenuField from "@/components/Reusables/MenuField";

const NameField = styled(InputField)(({ theme }) => ({
  ".MuiInputBase-root": {
    "&.MuiOutlinedInput-root": {
      fontSize: "16px",
      padding: "16px 25px",
    },
  },
}));

const Label = styled(SecondaryLabel)(({ theme }) => ({
  fontSize: "16px",
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
  const { useDomain } = useDomainState();
  const { name, payment } = useDomain();

  const [yearCount, setYearCount] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<PaymentMethod>(
    payment?.method || "ROOT"
  );

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
        <Label>{`${yearCount} Year`}</Label>
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
    </Grid>
  );
};

export default RegisterName;
