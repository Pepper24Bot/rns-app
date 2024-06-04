import React from "react";
import SearchForm from "@/components/Search/SearchForm";
import Dashboard from "@/components/Dashboard/Dashboard";

import { Grid, styled } from "@mui/material";

const Container = styled(Grid)(({ theme }) => ({
  paddingTop: "80px",
}));

export const MainPage: React.FC = () => {
  return (
    <Container>
      <SearchForm />
      <Dashboard />
    </Container>
  );
};

export default MainPage;
