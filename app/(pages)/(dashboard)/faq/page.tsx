"use client";

import React, { useEffect, useState } from "react";
import { scrollIntoElement } from "@/utils/common";
import FrequentlyAsked from "@/components/Dashboard/Tab/Faq/Faq";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Page() {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // scroll into element
      scrollIntoElement("My Dashboard-Container");
    }
  }, [hasMounted]);

  return <FrequentlyAsked />;
}
