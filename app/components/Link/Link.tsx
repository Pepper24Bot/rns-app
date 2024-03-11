import React, { useEffect, useState } from "react";
import { Grid, alpha, darken, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Form } from "./Form";

import Image from "next/image";
import Details from "./Details";
import useRecords from "@/hooks/useRecords";
import { useDomainState } from "@/redux/domain/domainSlice";

const ImageContainer = styled(Grid)(({ theme }) => ({
  paddingRight: "30px",
}));

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
      <ImageContainer item>
        <Image
          src="/images/rns-image-placeholder.svg"
          alt="Wallet Icon"
          width={290}
          height={200}
          style={{
            height: "fit-content",
            border: `solid 1px ${alpha(grey[50], 0.25)}`,
            borderRadius: "4px",
            boxShadow: `0px 0px 15px 0px ${darken(grey[900], 1)}`,
          }}
        />
      </ImageContainer>
      {!isFuturePassLinked ? <Form /> : <Details />}
    </Grid>
  );
};

export default Link;
