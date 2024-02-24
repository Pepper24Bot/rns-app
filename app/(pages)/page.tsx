"use client";

import React from "react";
import { Grid, styled } from "@mui/material";
import SearchForm from "@/components/Search/SearchForm";

const Container = styled(Grid)(({ theme }) => ({
  paddingTop: "80px",
}));

export default function Home() {
  return (
    <Container>
      <SearchForm />
    </Container>
  );
}
