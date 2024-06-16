"use client";

import React, { useEffect, useState } from "react";
import { Grid, styled } from "@mui/material";
import { useAccount } from "wagmi";
import { isAccountLoading } from "@/utils/common";

import SearchForm from "@/components/Search/SearchForm";
import Dashboard from "@/components/Dashboard/Dashboard";
import SkeletonForm from "../Search/SkeletonForm";
import SkeletonDashboard from "../Dashboard/SkeletonDashboard";

const Container = styled(Grid)(({ theme }) => ({
  paddingTop: "80px",
  minHeight: "790px",
}));

interface MainPage {
  /** Dashboard Children */
  children?: React.ReactNode;
}

export const MainPage: React.FC<MainPage> = (props: MainPage) => {
  const { children } = props;
  const { status } = useAccount();

  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    // probably better to have this stored in a global state
    setHasMounted(true);
  }, []);

  return (
    <Container>
      {hasMounted && status !== "reconnecting" ? (
        <>
          <SearchForm />
          <Dashboard>{children}</Dashboard>
        </>
      ) : (
        <>
          <SkeletonForm />
          <SkeletonDashboard />
        </>
      )}
    </Container>
  );
};

export default MainPage;
