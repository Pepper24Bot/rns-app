"use client";

import React, { useEffect, useState } from "react";
import Names from "../Dashboard/Tab/Names";

export const IdentitiesPage: React.FC = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    // probably better to have this stored in a global state
    setHasMounted(true);
  }, []);

  return <Names hasMounted={hasMounted} />;
};

export default IdentitiesPage;
