import React from "react";
import { Grid, styled } from "@mui/material";
import { ModalInputField as InputField } from "../Theme/StyledGlobal";
import { useFormState } from "@/redux/form/formSlice";

const Container = styled(Grid)(({ theme }) => ({
  width: "360px",

  [theme.breakpoints.down(735)]: {
    width: "100%",
  },
}));

export interface Summary {
  title: React.ReactNode | string;
}

export const Summary: React.FC<Summary> = (props: Summary) => {
  const { title } = props;

  const { useForm } = useFormState();
  const { year = 1, payment, fee } = useForm();

  const getYearLabel = () => {
    return year && year > 1 ? "Years" : "Year";
  };

  return (
    <Container>
      {title}
      <InputField value={`${year} ${getYearLabel()}`} label="Duration" />
      <InputField value={payment?.label || "ROOT"} label="Payment Method" />
      <InputField value={fee?.total || 0} label="Total" />
    </Container>
  );
};

export default Summary;
