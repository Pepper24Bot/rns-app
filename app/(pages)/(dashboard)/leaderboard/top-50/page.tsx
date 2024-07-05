"use client";

import React, { useEffect, useState } from "react";
import { scrollIntoElement } from "@/utils/common";
import Holders from "@/components/Leaderboard/Holders";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Page() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // scroll into element
      scrollIntoElement("Holders-Container");
    }
  }, [hasMounted]);

  // return <Holders tab={0} />;
  return <Dashboard tab={1} />;
}
