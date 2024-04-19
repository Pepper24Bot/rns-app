import React from "react";
import { Grid } from "@mui/material";
import { Domain } from "@/redux/graphql/hooks";
import { EMPTY_ADDRESS } from "@/services/constants";

import AddRecord from "./AddRecord";
import AddressRecord from "./AddressRecord";
import EnsImage from "../Reusables/EnsImage";

export interface Link {
  domain?: Partial<Domain>;
  owner?: {
    id?: string;
  };
}

export const LinkAddress: React.FC<Link> = (props: Link) => {
  const { domain } = props;

  const futurePassAddr = domain?.resolver?.addr?.id;

  // TODO: This is temporary
  const hasLinkedAddr = futurePassAddr && futurePassAddr !== EMPTY_ADDRESS;

  return (
    <Grid container mt={6} minWidth={250} maxWidth={700}>
      <EnsImage name={domain?.name || ""} />
      {hasLinkedAddr ? <AddressRecord {...props} /> : <AddRecord {...props} />}
    </Grid>
  );
};

export default LinkAddress;
