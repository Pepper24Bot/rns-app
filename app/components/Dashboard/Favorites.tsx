import React from "react";
import { Grid, styled } from "@mui/material";
import { FlexCenter } from "../Theme/StyledGlobal";

const Container = styled(FlexCenter)(({ theme }) => ({
  minHeight: "500px",
  padding: "35px 0",
}));

export const Favorites: React.FC = () => {
  return <Container>TODO: Favorites Content</Container>;
};

export default Favorites;
