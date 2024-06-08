"use client";

import React, { useEffect, useState } from "react";
import { Grid, styled } from "@mui/material";

import SearchForm from "@/components/Search/SearchForm";
import Dashboard from "@/components/Dashboard/Dashboard";
import Names from "../Dashboard/Tab/Names";

const Container = styled(Grid)(({ theme }) => ({
  paddingTop: "80px",
}));

export const MainPage: React.FC = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <Container>
      <SearchForm />
      <Dashboard hasMounted={hasMounted}>
        {/* Default active tab -- Identities */}
        <Names hasMounted={hasMounted} />
      </Dashboard>
    </Container>
  );
};

export default MainPage;
