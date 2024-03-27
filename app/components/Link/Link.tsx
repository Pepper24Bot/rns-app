import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Form } from "./Form";
import { useDomainState } from "@/redux/domain/domainSlice";
import { useAccount } from "wagmi";
import { Domain } from "@/redux/graphql/hooks";

import Details from "./Details";
import useRecords from "@/hooks/useRecords";
import EnsImage from "../Reusables/EnsImage";

export interface Link {
  domain?: Partial<Domain>;
  owner?: {
    id?: string;
  };
}

export const Link: React.FC<Link> = (props: Link) => {
  const [isFuturePassLinked, setIsFuturePassLinked] = useState<boolean>(false);

  return (
    <Grid container mt={6} minWidth={250} maxWidth={700}>
      <EnsImage />
      {!isFuturePassLinked ? <Form {...props} /> : <Details />}
    </Grid>
  );
};

export default Link;
