"use client";

import React, { useEffect, useState } from "react";
import { scrollIntoElement } from "@/utils/common";
import Holders from "@/components/Leaderboard/Holders";

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

  return <Holders tab={2} />;
}
