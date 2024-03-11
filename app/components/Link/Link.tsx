import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Form } from "./Form";
import { useDomainState } from "@/redux/domain/domainSlice";

import Details from "./Details";
import useRecords from "@/hooks/useRecords";
import EnsImage from "../Reusables/EnsImage";

export const Link: React.FC = () => {
  const { useDomain } = useDomainState();
  const { name } = useDomain();
  const { getTextRecord } = useRecords({});

  const [isFuturePassLinked, setIsFuturePassLinked] = useState<boolean>(false);

  useEffect(() => {
    console.log("name:: ", name);
    const response = getTextRecord({ name });

    console.log("ens-response:: ", response);
  }, []);

  return (
    <Grid container mt={6} minWidth={250}>
      <EnsImage />
      {!isFuturePassLinked ? <Form /> : <Details />}
    </Grid>
  );
};

export default Link;
