import { BaseInputField } from "@/components/Theme/StyledGlobal";
import { Grid } from "@mui/material";
import React from "react";

export const RegisterName: React.FC = () => {
  return (
    <Grid>
      <BaseInputField value={"test"} />
    </Grid>
  );
};

export default RegisterName;
