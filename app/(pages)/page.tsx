"use client";

import React, { useEffect, useState } from "react";
import MainPage from "@/components/Main/MainPage";
import Names from "@/components/Dashboard/Tab/Names";

export default function Home() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <MainPage>
      <Names hasMounted={hasMounted} />
    </MainPage>
  );
}
