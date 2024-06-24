"use client";

import React, { useEffect, useState } from "react";
import MainPage from "@/components/Main/MainPage";
import Names from "@/components/Dashboard/Tab/Names";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <MainPage>
      <Dashboard>
        <Names hasMounted={hasMounted} />
      </Dashboard>
    </MainPage>
  );
}
