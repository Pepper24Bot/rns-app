import React from "react";
import { Grid } from "@mui/material";
import { EMPTY_ADDRESS } from "@/constants/components";
import { LinkProps } from "@/interfaces/components/transaction";

import AddRecord from "./AddRecord";
import AddressRecord from "./AddressRecord";
import EnsImage from "../Reusables/EnsImage";

export const LinkAddress: React.FC<LinkProps> = (props: LinkProps) => {
  const { domain } = props;

  const linkedAddr = domain?.resolver?.addr?.id;
  const hasLinkedAddr = linkedAddr && linkedAddr !== EMPTY_ADDRESS;

  return (
    <Grid container mt={6} minWidth={250} maxWidth={700}>
      <EnsImage name={domain?.name || ""} />
      {hasLinkedAddr ? <AddressRecord {...props} /> : <AddRecord {...props} />}
    </Grid>
  );
};

export default LinkAddress;
