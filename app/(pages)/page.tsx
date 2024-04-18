"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import SearchForm from "@/components/Search/SearchForm";
import Dashboard from "@/components/Dashboard/Dashboard";
import useConnectRoot from "@/hooks/useConnectRoot";

const Container = styled(Grid)(({ theme }) => ({
  paddingTop: "80px",
}));

export default function Home() {
  useConnectRoot();

  return (
    <Container>
      <SearchForm />
      <Dashboard />
    </Container>
  );
}
