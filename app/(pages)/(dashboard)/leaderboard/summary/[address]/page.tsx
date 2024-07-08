"use client";

import React, { useEffect, useState } from "react";
import { scrollIntoElement } from "@/utils/common";
import { useLeaderboardState } from "@/redux/leaderboard/leaderboardSlice";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Page({ params }: { params: { address: string } }) {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const { updateSearchNameOrAddr } = useLeaderboardState();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // scroll into element
      scrollIntoElement("Holders-Container");
      updateSearchNameOrAddr(params.address);
    }
  }, [hasMounted]);

  return <Dashboard tab={1} holderTab={0} />;
}
