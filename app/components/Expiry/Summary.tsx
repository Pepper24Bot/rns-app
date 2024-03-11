import React from "react";
import { Grid, styled } from "@mui/material";
import { ModalInputField as InputField } from "../Theme/StyledGlobal";
import { useDomainState } from "@/redux/domain/domainSlice";

export interface Summary {
  title: React.ReactNode | string;
}

export const Summary: React.FC<Summary> = (props: Summary) => {
  const { title } = props;

  const { useDomain } = useDomainState();
  const { year = 1, payment, fee } = useDomain();

  const getYearLabel = () => {
    return year && year > 1 ? "Years" : "Year";
  };

  return (
    <Grid item maxWidth={350}>
      {title}
      <InputField value={`${year} ${getYearLabel()}`} label="Duration" />
      <InputField value={payment?.method || "ROOT"} label="Payment Method" />
      <InputField value={fee?.total || 0} label="Total" />
    </Grid>
  );
};

export default Summary;
