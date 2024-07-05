"use client";

import React, { useEffect, useState } from "react";
import MainPage from "@/components/Main/MainPage";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <MainPage>
      <Dashboard tab={0} hasMounted={hasMounted} />
    </MainPage>
  );
}
