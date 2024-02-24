import React from "react";
import { Grid, styled } from "@mui/material";
import { FlexCenter } from "../Theme/StyledGlobal";

const Container = styled(FlexCenter)(({ theme }) => ({
  minHeight: "500px",
  padding: "35px 0",
}));

export const LoyaltyPoints: React.FC = () => {
  return <Container>TODO: LoyaltyPoints Content</Container>;
};

export default LoyaltyPoints;
