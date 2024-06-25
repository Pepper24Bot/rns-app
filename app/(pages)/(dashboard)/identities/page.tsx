"use client";

import React, { useEffect, useState } from "react";
import { scrollIntoElement } from "@/utils/common";
import Names from "@/components/Dashboard/Tab/Names";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Page() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // scroll into element
      scrollIntoElement("Dashboard-Container");
    }
  }, [hasMounted]);

  return <Names hasMounted={hasMounted} />;
}
